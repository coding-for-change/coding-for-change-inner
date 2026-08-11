import type { Endpoint, PayloadRequest } from 'payload';
import { getPool, requireAdmin } from './util';

/**
 * Admin-only bulk mail to the waitlist (`waitlist-signups` collection).
 *
 *   GET  /api/waitlist/email-recipients   unique-address counts, total + per locale
 *   POST /api/waitlist/send-email         body { subject, message, locale?,
 *                                                test?, testRecipients? }
 *
 * Every recipient gets their own individual email, so addresses are never
 * exposed to other recipients — the reason this exists instead of a
 * hand-written BCC mail. Delivery reuses the transactional email config from
 * payload.config.ts (RESEND_API_KEY / EMAIL_FROM / EMAIL_FROM_NAME) but calls
 * Resend's batch API directly: 100 mails per request instead of one request
 * per mail, so a full-list send finishes in seconds rather than minutes.
 * Without an API key (local dev) it falls back to payload.sendEmail, which
 * logs each mail to the server console; in production a missing key is a 503,
 * never a silent no-op.
 *
 * Every message gets a bilingual footer explaining why the recipient is
 * getting it and how to unsubscribe (a short mail to CONTACT_TO_EMAIL —
 * replies also go there). `test: true` sends only to the logged-in admin —
 * or, when `testRecipients` is given, to that hand-picked list (≤10
 * addresses, e.g. personal inboxes to preview rendering in different mail
 * clients) — with the subject prefixed "[Test]". Test mode never reads the
 * waitlist.
 */

const FROM = () =>
  `${process.env.EMAIL_FROM_NAME || 'Coding for Change'} <${process.env.EMAIL_FROM || 'noreply@codingforchange.com'}>`;
const CONTACT = () => process.env.CONTACT_TO_EMAIL || 'info@codingforchange.com';

const BATCH_URL = 'https://api.resend.com/emails/batch';
const BATCH_SIZE = 100; // Resend's maximum per batch request
const BATCH_INTERVAL_MS = 600; // stay under Resend's default 2 requests/second

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Test sends may target a hand-picked address list (e.g. personal inboxes, to
// preview rendering across mail clients) instead of the admin's own address.
// Comma/semicolon/whitespace separated; the small cap keeps the test path
// from doubling as a second bulk sender.
const MAX_TEST_RECIPIENTS = 10;

const parseTestRecipients = (raw: unknown): { emails: string[] } | { error: string } => {
  const parts = Array.isArray(raw)
    ? raw.map((p) => String(p))
    : typeof raw === 'string'
      ? raw.split(/[\s,;]+/)
      : [];
  const emails = [...new Set(parts.map((p) => p.trim().toLowerCase()).filter(Boolean))];
  const invalid = emails.find((e) => !EMAIL_RE.test(e));
  if (invalid) return { error: `Invalid test recipient address: “${invalid}”` };
  if (emails.length > MAX_TEST_RECIPIENTS) {
    return { error: `At most ${MAX_TEST_RECIPIENTS} test recipients are allowed.` };
  }
  return { emails };
};

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Turn bare http(s) URLs in already-escaped text into links (quotes are
// escaped, so the URL can't break out of the href attribute). The final
// character class keeps trailing sentence punctuation out of the link.
const linkify = (escaped: string): string =>
  escaped.replace(
    /(https?:\/\/[^\s<]*[^\s<.,;:!?)"'])/g,
    '<a href="$1" style="color:#2a78d6;">$1</a>',
  );

const renderHtml = (message: string): string =>
  message
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 1em;">${linkify(escapeHtml(p)).replace(/\n/g, '<br />')}</p>`)
    .join('');

const footerText = () =>
  [
    '—',
    `Du erhältst diese E-Mail, weil du dich auf codingforchange.com in die Warteliste eingetragen hast. Zum Abmelden genügt eine kurze Nachricht an ${CONTACT()}.`,
    `You are receiving this email because you joined the waitlist on codingforchange.com. To unsubscribe, just send a short message to ${CONTACT()}.`,
  ].join('\n\n');

const footerHtml = () =>
  `<hr style="border:none;border-top:1px solid #ddd;margin:24px 0 12px;" />` +
  `<p style="margin:0;color:#666;font-size:12px;line-height:1.5;">` +
  `Du erhältst diese E-Mail, weil du dich auf codingforchange.com in die Warteliste eingetragen hast. ` +
  `Zum Abmelden genügt eine kurze Nachricht an <a href="mailto:${CONTACT()}">${CONTACT()}</a>.<br />` +
  `You are receiving this email because you joined the waitlist on codingforchange.com. ` +
  `To unsubscribe, just send a short message to <a href="mailto:${CONTACT()}">${CONTACT()}</a>.` +
  `</p>`;

type BatchItem = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
};

/**
 * POST the prepared per-recipient emails to Resend in chunks of 100.
 * 429/5xx/network errors are retried (up to 3 attempts per chunk, honouring
 * Retry-After); other 4xx rejections mark the whole chunk failed — Resend
 * validates batches atomically, so one bad address fails its chunk.
 */
async function sendViaResend(
  apiKey: string,
  items: BatchItem[],
): Promise<{ sent: number; failed: number; errors: string[] }> {
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const chunk = items.slice(i, i + BATCH_SIZE);
    if (i > 0) await sleep(BATCH_INTERVAL_MS);
    for (let attempt = 1; ; attempt += 1) {
      let res: Response;
      try {
        res = await fetch(BATCH_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chunk),
        });
      } catch (err) {
        if (attempt < 3) {
          await sleep(1000 * attempt);
          continue;
        }
        failed += chunk.length;
        errors.push(err instanceof Error ? err.message : 'network error');
        break;
      }
      if (res.ok) {
        sent += chunk.length;
        break;
      }
      if ((res.status === 429 || res.status >= 500) && attempt < 3) {
        const after = Number(res.headers.get('retry-after'));
        await sleep(Number.isFinite(after) && after > 0 ? after * 1000 : 1000 * attempt);
        continue;
      }
      failed += chunk.length;
      const detail = (await res.text().catch(() => '')).slice(0, 300);
      errors.push(`Resend ${res.status}${detail ? `: ${detail}` : ''}`);
      break;
    }
  }
  return { sent, failed, errors };
}

const emailRecipients: Endpoint = {
  path: '/waitlist/email-recipients',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const pool = getPool(req);
    if (!pool) return new Response('Database unavailable', { status: 500 });
    const [{ rows: byLocale }, { rows: totals }] = await Promise.all([
      pool.query(
        `SELECT COALESCE(NULLIF(locale, ''), 'unknown') AS locale,
                COUNT(DISTINCT lower(email))::int AS count
         FROM waitlist_signups
         GROUP BY 1
         ORDER BY 2 DESC, 1`,
      ),
      pool.query(`SELECT COUNT(DISTINCT lower(email))::int AS total FROM waitlist_signups`),
    ]);
    return Response.json({
      total: Number(totals[0]?.total) || 0,
      byLocale: byLocale.map((r) => ({
        locale: String(r.locale),
        count: Number(r.count) || 0,
      })),
    });
  },
};

const sendEmail: Endpoint = {
  path: '/waitlist/send-email',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const denied = requireAdmin(req);
    if (denied) return denied;

    let body: {
      subject?: unknown;
      message?: unknown;
      locale?: unknown;
      test?: unknown;
      testRecipients?: unknown;
    };
    try {
      body = ((await req.json?.()) ?? {}) as typeof body;
    } catch {
      return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const locale = typeof body.locale === 'string' ? body.locale.trim() : '';
    const test = body.test === true;
    if (!subject || subject.length > 200) {
      return Response.json({ error: 'Subject is required (max 200 characters).' }, { status: 400 });
    }
    if (!message || message.length > 20000) {
      return Response.json({ error: 'Message is required (max 20,000 characters).' }, { status: 400 });
    }

    // Recipients: the admin themself for a test run, otherwise every unique
    // waitlist address (optionally narrowed to one signup locale). Addresses
    // are lowercased on write by the collection hook; DISTINCT lower() also
    // catches anything older than that hook.
    let recipients: string[];
    if (test) {
      const parsed = parseTestRecipients(body.testRecipients);
      if ('error' in parsed) {
        return Response.json({ error: parsed.error }, { status: 400 });
      }
      if (parsed.emails.length > 0) {
        recipients = parsed.emails;
      } else {
        // No explicit list: default to the logged-in admin. req.user is
        // User | PayloadMcpApiKey (the MCP plugin's key auth); only real
        // admin users have an email to send the test to.
        const u = req.user;
        const adminEmail = u && 'email' in u && typeof u.email === 'string' ? u.email : null;
        if (!adminEmail) {
          return Response.json(
            { error: 'Test mode requires a logged-in admin user or explicit test recipients.' },
            { status: 400 },
          );
        }
        recipients = [adminEmail];
      }
    } else {
      const pool = getPool(req);
      if (!pool) return new Response('Database unavailable', { status: 500 });
      const where = locale ? `WHERE COALESCE(NULLIF(locale, ''), 'unknown') = $1` : '';
      const { rows } = await pool.query(
        `SELECT DISTINCT lower(trim(email)) AS email FROM waitlist_signups ${where} ORDER BY 1`,
        locale ? [locale] : [],
      );
      recipients = rows.map((r) => String(r.email)).filter((e) => EMAIL_RE.test(e));
    }
    if (recipients.length === 0) {
      return Response.json({ error: 'No recipients found.' }, { status: 400 });
    }

    const finalSubject = test ? `[Test] ${subject}` : subject;
    const text = `${message}\n\n${footerText()}`;
    const html =
      `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#111;max-width:600px;">` +
      `${renderHtml(message)}${footerHtml()}</div>`;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const items: BatchItem[] = recipients.map((to) => ({
        from: FROM(),
        to: [to],
        reply_to: CONTACT(),
        subject: finalSubject,
        text,
        html,
      }));
      const { sent, failed, errors } = await sendViaResend(apiKey, items);
      // Counts only — recipient addresses stay out of the server logs.
      req.payload.logger.info(
        `[waitlist-email] resend: ${sent} sent, ${failed} failed of ${recipients.length}${test ? ' (test)' : ''}`,
      );
      return Response.json({
        transport: 'resend',
        requested: recipients.length,
        sent,
        failed,
        errors: errors.slice(0, 3),
      });
    }

    // No API key: refuse in production rather than silently doing nothing…
    if (process.env.NODE_ENV === 'production') {
      return Response.json(
        { error: 'RESEND_API_KEY is not configured on the server.' },
        { status: 503 },
      );
    }
    // …but in local dev fall back to payload.sendEmail, which (with no email
    // adapter configured) logs each mail to the console — enough to preview
    // content and exercise the whole flow end to end.
    for (const to of recipients) {
      await req.payload.sendEmail({ from: FROM(), to, subject: finalSubject, text, html });
    }
    req.payload.logger.info(
      `[waitlist-email] console: ${recipients.length} mail(s) logged (no RESEND_API_KEY)`,
    );
    return Response.json({
      transport: 'console',
      requested: recipients.length,
      sent: recipients.length,
      failed: 0,
      errors: [],
    });
  },
};

export const waitlistEmailEndpoints: Endpoint[] = [emailRecipients, sendEmail];
