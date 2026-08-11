/**
 * Branded HTML template for the "email all waitlist signups" feature
 * (endpoints/waitlistEmail.ts). One function turns the admin's plain-text
 * message (+ optional header image and CTA button) into the html/text pair
 * handed to Resend.
 *
 * Email clients are not browsers: Gmail strips <style> in the body of some
 * clients, Outlook (Windows) renders with Word. So the layout is 600px
 * table-based with every style inlined, images carry explicit width/height
 * attributes, and the only <style> block is a small-screen padding override
 * (ignored where unsupported — the inline styles remain a correct fallback).
 * Colors mirror the landing page palette in inner/src/components/showcase/
 * landing.css (teal #2f8f90 on white, square corners).
 *
 * Kept dependency-free on purpose: it can be rendered standalone
 * (`node --experimental-strip-types`) to preview the design without booting
 * the CMS.
 */

export type WaitlistEmailContent = {
  /** Plain text; blank lines separate paragraphs, bare URLs become links. */
  message: string;
  /** Unsubscribe/contact address shown in the footer. */
  contactEmail: string;
  /** Absolute https origin serving the logo + site link (no trailing slash). */
  siteOrigin: string;
  /** <html lang>: 'de' for German-only sends, 'en' otherwise. */
  lang?: 'en' | 'de';
  /** Optional image shown full-width between header and body (absolute URL). */
  headerImageUrl?: string;
  /** Optional button under the message; both label and URL or neither. */
  ctaLabel?: string;
  ctaUrl?: string;
};

export type BuiltWaitlistEmail = {
  html: string;
  text: string;
  /** Inbox snippet (first line of the message), also hidden in the html. */
  preheader: string;
};

// Landing-page palette (see landing.css) — inlined because emails can't use
// CSS variables.
const TEAL = '#2f8f90';
const TEAL_DARK = '#246b6c';
const INK = '#1b1f1f';
const MUTED = '#5d6868';
const LINE = '#e3eaea';
const PAGE_BG = '#f1f6f6';

const FONT_BODY = "'IBM Plex Sans','Segoe UI',Helvetica,Arial,sans-serif";
const FONT_DISPLAY = "'Space Grotesk','Trebuchet MS',Helvetica,Arial,sans-serif";

export const escapeHtml = (s: string): string =>
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
    `<a href="$1" style="color:${TEAL_DARK};text-decoration:underline;">$1</a>`,
  );

const paragraphsHtml = (message: string): string =>
  message
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 1em;">${linkify(escapeHtml(p)).replace(/\n/g, '<br />')}</p>`,
    )
    .join('');

/** Start of the message collapsed to one line — the inbox preview snippet. */
const preheaderFrom = (message: string): string =>
  message.replace(/\s+/g, ' ').trim().slice(0, 140);

const footerParagraphs = (contactEmail: string) => {
  const mail = escapeHtml(contactEmail);
  const link = `<a href="mailto:${mail}" style="color:${TEAL_DARK};text-decoration:underline;">${mail}</a>`;
  return {
    de: `Du erhältst diese E-Mail, weil du dich auf codingforchange.com in die Warteliste eingetragen hast. Zum Abmelden genügt eine kurze Nachricht an ${link}.`,
    en: `You are receiving this email because you joined the waitlist on codingforchange.com. To unsubscribe, just send a short message to ${link}.`,
  };
};

export function buildWaitlistEmail(input: WaitlistEmailContent): BuiltWaitlistEmail {
  const {
    message,
    contactEmail,
    siteOrigin,
    lang = 'en',
    headerImageUrl,
    ctaLabel,
    ctaUrl,
  } = input;

  const preheader = preheaderFrom(message);
  const logoUrl = `${siteOrigin}/images/email-logo.png`;

  // ---- text/plain part (kept close to what the admin typed) ----
  const textParts = [message.trim()];
  if (ctaLabel && ctaUrl) textParts.push(`${ctaLabel}: ${ctaUrl}`);
  textParts.push(
    [
      '—',
      `Du erhältst diese E-Mail, weil du dich auf codingforchange.com in die Warteliste eingetragen hast. Zum Abmelden genügt eine kurze Nachricht an ${contactEmail}.`,
      `You are receiving this email because you joined the waitlist on codingforchange.com. To unsubscribe, just send a short message to ${contactEmail}.`,
    ].join('\n\n'),
  );
  const text = textParts.join('\n\n');

  // ---- html part ----
  const heroRow = headerImageUrl
    ? `<tr>
        <td style="padding:0;">
          <img src="${escapeHtml(headerImageUrl)}" width="598" alt=""
            style="display:block;border:0;width:100%;max-width:100%;height:auto;" />
        </td>
      </tr>`
    : '';

  // Solid-color td + padded link = the classic button that survives Outlook.
  const ctaRow =
    ctaLabel && ctaUrl
      ? `<tr>
          <td class="wl-pad" align="center" style="padding:4px 36px 10px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" bgcolor="${TEAL}" style="background-color:${TEAL};">
                  <a href="${escapeHtml(ctaUrl)}"
                    style="display:inline-block;padding:13px 30px;font-family:${FONT_DISPLAY};font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(ctaLabel)}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
      : '';

  const footer = footerParagraphs(contactEmail);

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title></title>
<style>
  @media only screen and (max-width: 620px) {
    .wl-pad { padding-left: 24px !important; padding-right: 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}${'&nbsp;&zwnj;'.repeat(48)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAGE_BG};">
  <tr>
    <td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">
        <tr>
          <td style="background-color:#ffffff;border:1px solid ${LINE};border-top:4px solid ${TEAL};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="wl-pad" align="center" style="padding:26px 36px 22px;">
                  <img src="${escapeHtml(logoUrl)}" width="88" height="30" alt="&gt;_&#9825;"
                    style="display:inline-block;border:0;" />
                  <div style="font-family:${FONT_DISPLAY};font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:${INK};padding-top:10px;">Coding for Change</div>
                </td>
              </tr>
              ${heroRow}
              <tr>
                <td class="wl-pad" style="padding:26px 36px 8px;font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${INK};">
                  ${paragraphsHtml(message)}
                </td>
              </tr>
              ${ctaRow}
              <tr>
                <td style="padding:0 36px 22px;"></td>
              </tr>
              <tr>
                <td class="wl-pad" style="padding:18px 36px 22px;border-top:1px solid ${LINE};font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${MUTED};">
                  <p style="margin:0 0 8px;">${footer.de}</p>
                  <p style="margin:0;">${footer.en}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:16px 8px 0;font-family:${FONT_BODY};font-size:12px;color:${MUTED};">
            <a href="${escapeHtml(siteOrigin)}" style="color:${TEAL_DARK};text-decoration:none;">codingforchange.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { html, text, preheader };
}
