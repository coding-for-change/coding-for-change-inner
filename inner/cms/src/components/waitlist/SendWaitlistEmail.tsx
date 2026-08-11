'use client';
import React, { useEffect, useState } from 'react';
import './waitlist-email.css';

/**
 * "Email all waitlist signups" panel above the Waitlist Signups list view
 * (registered via admin.components.beforeListTable in the collection config).
 * Composes a message and POSTs it to /api/waitlist/send-email, which delivers
 * an individual email to every unique signup address via Resend — recipients
 * never see each other's addresses. Collapsed by default so the list view
 * stays uncluttered; "Send test to me" mails only the logged-in admin.
 */

type Counts = {
  total: number;
  byLocale: { locale: string; count: number }[];
};

type SendResult = {
  transport: 'resend' | 'console';
  requested: number;
  sent: number;
  failed: number;
  errors: string[];
};

const LOCALE_LABELS: Record<string, string> = {
  de: 'German signups (de)',
  en: 'English signups (en)',
  unknown: 'No language recorded',
};

export const SendWaitlistEmail: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [countsError, setCountsError] = useState(false);
  const [locale, setLocale] = useState(''); // '' = all signups
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState<null | 'test' | 'all'>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || counts) return;
    fetch('/api/waitlist/email-recipients')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: Counts) => setCounts(data))
      .catch(() => setCountsError(true));
  }, [open, counts]);

  const recipientCount = locale
    ? (counts?.byLocale.find((l) => l.locale === locale)?.count ?? 0)
    : (counts?.total ?? 0);

  const send = async (test: boolean) => {
    setError(null);
    setResult(null);
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are both required.');
      return;
    }
    if (!test) {
      const noun = recipientCount === 1 ? 'address' : 'addresses';
      if (
        !window.confirm(
          `Send “${subject.trim()}” to ${recipientCount} unique waitlist ${noun}? This cannot be undone.`,
        )
      ) {
        return;
      }
    }
    setSending(test ? 'test' : 'all');
    try {
      const res = await fetch('/api/waitlist/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          locale: locale || undefined,
          test,
        }),
      });
      const data = (await res.json().catch(() => null)) as (SendResult & { error?: string }) | null;
      if (!res.ok) {
        setError((data && typeof data.error === 'string' && data.error) || `Sending failed (HTTP ${res.status}).`);
        return;
      }
      if (data) setResult(data);
    } catch {
      setError('Sending failed — network error.');
    } finally {
      setSending(null);
    }
  };

  const busy = sending !== null;

  return (
    <div className="wl-email">
      <button
        type="button"
        className="wl-email__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ✉ Email all waitlist signups {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="wl-email__panel">
          <p className="wl-email__hint">
            Each person receives an <strong>individual</strong> email — recipients never see each
            other&apos;s addresses. A bilingual footer (why they&apos;re receiving this, and how to
            unsubscribe) is appended automatically, and plain URLs become clickable links.
          </p>
          <label className="wl-email__field">
            Recipients
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              disabled={busy || !counts}
            >
              <option value="">
                {counts ? `All signups (${counts.total} unique)` : 'Loading…'}
              </option>
              {counts?.byLocale.map((l) => (
                <option key={l.locale} value={l.locale}>
                  {LOCALE_LABELS[l.locale] ?? `Signups in “${l.locale}”`} ({l.count})
                </option>
              ))}
            </select>
          </label>
          {countsError && (
            <div className="wl-email__notice wl-email__notice--error">
              Could not load recipient counts — are you still logged in?
            </div>
          )}
          <label className="wl-email__field">
            Subject
            <input
              type="text"
              value={subject}
              maxLength={200}
              placeholder="e.g. Our next event — save your spot"
              onChange={(e) => setSubject(e.target.value)}
              disabled={busy}
            />
          </label>
          <label className="wl-email__field">
            Message
            <textarea
              value={message}
              rows={8}
              placeholder={'Hi!\n\nHere is the link to our event: https://lu.ma/…'}
              onChange={(e) => setMessage(e.target.value)}
              disabled={busy}
            />
          </label>
          <div className="wl-email__actions">
            <button
              type="button"
              className="wl-email__btn wl-email__btn--secondary"
              onClick={() => void send(true)}
              disabled={busy}
            >
              {sending === 'test' ? 'Sending test…' : 'Send test to me'}
            </button>
            <button
              type="button"
              className="wl-email__btn wl-email__btn--primary"
              onClick={() => void send(false)}
              disabled={busy || !counts || recipientCount === 0}
            >
              {sending === 'all'
                ? 'Sending…'
                : `Send to ${counts ? recipientCount : '…'} recipient${recipientCount === 1 ? '' : 's'}`}
            </button>
          </div>
          {error && <div className="wl-email__notice wl-email__notice--error">{error}</div>}
          {result && (
            <div
              className={`wl-email__notice ${
                result.failed > 0 ? 'wl-email__notice--warn' : 'wl-email__notice--ok'
              }`}
            >
              {result.transport === 'console'
                ? `No RESEND_API_KEY configured — ${result.sent} mail(s) were logged to the server console instead of being sent (dev mode).`
                : result.failed > 0
                  ? `Sent ${result.sent} of ${result.requested}; ${result.failed} failed.${result.errors[0] ? ` First error: ${result.errors[0]}` : ''}`
                  : `Sent ${result.sent} email${result.sent === 1 ? '' : 's'}.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
