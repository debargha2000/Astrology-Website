import React, { useState } from 'react';
import { Send, X, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { googleSignIn } from '../../lib/firebase';
import { getAccessToken } from './useCmsState';
import { GMAIL_TEMPLATES } from './seedData';
import type { MailRecord } from './types';
import type { CmsState } from './useCmsState';
import type { CmsHandlers } from './useCmsHandlers';

interface Props {
  state: CmsState;
}

const SEED_HISTORY: MailRecord[] = [
  { clientName: 'Aarav Mehta', email: 'aarav.mehta@hotmail.com', subject: 'Astral Prosperity Consecration Certificate Complete', dateStr: 'May 24, 2026' },
  { clientName: 'Priya Sharma', email: 'priya.sharma2@gmail.com', subject: 'Your Evil Eye Armour Rings Are Attuned', dateStr: 'May 25, 2026' }
];

const TEMPLATE_LABELS: Record<string, string> = {
  blessing: 'Crystal Blessing',
  shipping: 'Vedic Dispatch',
  ledger: 'Ledger Attestation'
};

export function GmailTab({ state }: Props) {
  const { googleUser, isAuthLoading, requestGmailAuthorization } = state;
  const [template, setTemplate] = useState<keyof typeof GMAIL_TEMPLATES>('blessing');
  const [subject, setSubject] = useState<string>(GMAIL_TEMPLATES.blessing.subject);
  const [body, setBody] = useState<string>(GMAIL_TEMPLATES.blessing.body);
  const [recipient, setRecipient] = useState('');
  const [history, setHistory] = useState<MailRecord[]>(SEED_HISTORY);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const loadTemplate = (key: keyof typeof GMAIL_TEMPLATES) => {
    setTemplate(key);
    setSubject(GMAIL_TEMPLATES[key].subject as string);
    setBody(GMAIL_TEMPLATES[key].body as string);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject || !body) {
      setStatus('error: Missing required fields: Recipient, Subject, or Body.');
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error('Missing active Google OAuth credentials. Please authorize first.');

      const sanitizedRecipient = recipient.replace(/\r?\n|\r/g, ' ').trim();
      const sanitizedSubject = subject.replace(/\r?\n|\r/g, ' ').trim();
      const mimeMessage = [
        `To: ${sanitizedRecipient}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${sanitizedSubject}`,
        '',
        body
      ].join('\r\n');

      const encodedMsg = btoa(unescape(encodeURIComponent(mimeMessage)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: encodedMsg })
      });

      if (!response.ok) {
        const errDetails = await response.json().catch(() => ({}));
        throw new Error(`Gmail API Gateway rejection: ${errDetails?.error?.message || response.statusText}`);
      }

      setHistory((prev) => [
        { clientName: 'Staff Dispatcher', email: recipient, subject, dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
        ...prev
      ]);
      setStatus('success');
      setRecipient('');
      setSubject(GMAIL_TEMPLATES.blessing.subject);
      setBody(GMAIL_TEMPLATES.blessing.body);
      setTemplate('blessing');
    } catch (err: any) {
      console.error('Gmail Dispatch Error:', err);
      setStatus(`error: ${err?.message || 'Failed to dispatch Gmail message.'}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      <div className="bg-cream border border-stone p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-ink text-amber-200 font-mono text-[9px] uppercase tracking-widest rounded-md font-bold flex items-center gap-1.5 shadow-xs">
              <Send className="h-3 w-3 text-gold" /> GMAIL COMMUNICATIONS GATEWAY
            </span>
            {googleUser ? (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-mono font-bold tracking-tight uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ON AIR</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono font-bold tracking-tight uppercase bg-zinc-100 border border-dashed border-zinc-300 px-2.5 py-0.5 rounded-full">
                <span>LOCKED</span>
              </div>
            )}
          </div>
          <h2 className="font-serif text-2xl font-light text-ink">
            Chamber of <span className="font-semibold text-gold-muted">Electronic Correspondence</span>
          </h2>
          <p className="text-xs text-ink/60 max-w-2xl leading-relaxed font-light">
            Secure electronic dispatch wing for Aura & Stone operations. Draft crystal blessing messages, order dispatches,
            or attested ledger invoices directly to your global clientele using real Google credentials.
          </p>
        </div>

        {googleUser && (
          <div className="flex items-center gap-3 bg-white border border-stone p-3 rounded-2xl shadow-xs self-start md:self-center">
            {googleUser.photoURL ? (
              <img src={googleUser.photoURL} alt="User Avatar" className="h-9 w-9 rounded-full border border-stone" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-ink text-white flex items-center justify-center font-serif text-sm">
                {googleUser.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-left">
              <p className="text-[11px] font-mono font-bold text-ink max-w-[150px] truncate leading-tight">
                {googleUser.displayName || 'Authorized operator'}
              </p>
              <p className="text-[9px] font-mono text-clay truncate max-w-[150px] leading-tight">{googleUser.email}</p>
            </div>
            <button
              onClick={async () => {
                await googleSignIn();
              }}
              className="cursor-pointer p-1.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
              title="Re-authorize"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!googleUser ? (
        <div className="bg-white border border-stone p-12 rounded-3xl text-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="mx-auto h-16 w-16 bg-cream border border-stone/45 rounded-2xl flex items-center justify-center text-gold">
            <Send className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-light text-ink tracking-wide">Initiate Secure Google Handshake</h3>
            <p className="text-xs text-clay max-w-md mx-auto leading-relaxed">
              To comply with security best-practice, Gmail dispatch uses an OAuth scope granted on-demand. Your existing
              CMS session can continue without this elevated permission.
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                await requestGmailAuthorization();
              } catch (e) {
                setStatus('error: Handshake denied: Google account workspace session refused.');
              }
            }}
            disabled={isAuthLoading}
            className="cursor-pointer bg-ink hover:bg-black text-white px-8 py-4 rounded-2xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md inline-flex items-center gap-3"
          >
            <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.543 0 2.95.549 4.053 1.458l3.142-3.14C18.91 1.776 15.783 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.262 0 11.36-4.99 11.36-11.24 0-.7-.075-1.378-.195-2.015H12.24z" />
            </svg>
            <span>Authorize Gmail Scope</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-stone p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
            <div className="border-b border-cream pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-gold-muted uppercase font-bold block">Composer Client</span>
                <h3 className="font-serif text-lg text-ink">Attuned Correspondence Draft</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-clay font-bold uppercase tracking-wider">Template:</span>
                <select
                  value={template}
                  onChange={(e) => loadTemplate(e.target.value as keyof typeof GMAIL_TEMPLATES)}
                  className="bg-cream text-ink border border-stone rounded-xl px-2.5 py-1 text-xs font-mono font-bold focus:outline-hidden cursor-pointer"
                >
                  {Object.entries(TEMPLATE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={send} className="space-y-4">
              {status && (
                <div
                  className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    status === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {status === 'success' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>MIME message successfully dispatched via official Gmail API.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                      <span>Dispatch Failed: {status}</span>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-ink uppercase tracking-wider font-bold">Recipient Mailbox</label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. client@prosperity.com"
                  className="w-full bg-cream border border-stone rounded-2xl px-4 py-3 text-xs font-mono text-ink focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-ink uppercase tracking-wider font-bold">Subject Header</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of Vedic Notice"
                  className="w-full bg-cream border border-stone rounded-2xl px-4 py-3 text-xs font-sans text-ink focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-ink uppercase tracking-wider font-bold">Message Body</label>
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Compose your spiritual cosmic letter details here gracefully..."
                  className="w-full bg-cream border border-stone rounded-2xl p-4 text-xs font-sans text-ink focus:outline-hidden leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="cursor-pointer w-full bg-ink hover:bg-black disabled:bg-zinc-300 text-white py-3.5 px-4 rounded-2xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-gold" />
                    <span>DISPATCHING VIA GMAIL...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-gold" />
                    <span>COMPILE & DISPATCH MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-white border border-stone p-6 rounded-3xl shadow-xs space-y-6 self-start">
            <div>
              <span className="text-[9px] font-mono tracking-[0.25em] text-gold-muted uppercase font-bold block">Transmission History</span>
              <h3 className="font-serif text-lg text-ink">Sent Correspondences</h3>
            </div>
            <div className="divide-y divide-cream max-h-[420px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-12 text-xs font-mono text-clay">No digital correspondence sent during this operational session.</div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="py-4 space-y-2 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-sans font-medium text-ink">{item.clientName}</span>
                        <span className="block text-[10px] font-mono text-clay">{item.email}</span>
                      </div>
                      <span className="text-[9.5px] font-mono text-gold-muted bg-cream border border-stone/45 px-2 py-0.5 rounded leading-none whitespace-nowrap">
                        {item.dateStr}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-ink/70 line-clamp-1 italic font-light">"{item.subject}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
