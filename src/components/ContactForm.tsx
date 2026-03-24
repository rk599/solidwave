import { useState } from 'react';

interface Props {
  lang: 'de' | 'en';
  labels: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    topic: string;
    topicDefault: string;
    topic1: string;
    topic2: string;
    topic3: string;
    topic4: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    successTitle: string;
    successDesc: string;
    errorTitle: string;
    errorDesc: string;
  };
}

export default function ContactForm({ lang, labels }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    // Basic client-side validation
    const newErrors: Record<string, string> = {};
    if (!data.name) newErrors.name = lang === 'de' ? 'Pflichtfeld' : 'Required';
    if (!data.email) newErrors.email = lang === 'de' ? 'Pflichtfeld' : 'Required';
    if (!data.message) newErrors.message = lang === 'de' ? 'Pflichtfeld' : 'Required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl bg-[#4A7C8C]/10 border border-[#4A7C8C]/20 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4A7C8C]/20">
          <svg className="h-6 w-6 text-[#4A7C8C]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#0A2647] mb-2">{labels.successTitle}</h3>
        <p className="text-slate-500 text-sm">{labels.successDesc}</p>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-[#4A7C8C] focus:ring-2 focus:ring-[#4A7C8C]/20 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === 'error' && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-700">{labels.errorTitle}</p>
          <p className="text-sm text-red-600 mt-0.5">{labels.errorDesc}</p>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="name">
          {labels.name} <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={labels.namePlaceholder}
          className={inputClass('name')}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="email">
          {labels.email} <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={labels.emailPlaceholder}
          className={inputClass('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="phone">
          {labels.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={labels.phonePlaceholder}
          className={inputClass('phone')}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="topic">
          {labels.topic}
        </label>
        <select
          id="topic"
          name="topic"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-[#4A7C8C] focus:ring-2 focus:ring-[#4A7C8C]/20 hover:border-slate-300"
        >
          <option value="">{labels.topicDefault}</option>
          <option value="health">{labels.topic1}</option>
          <option value="pension">{labels.topic2}</option>
          <option value="property">{labels.topic3}</option>
          <option value="general">{labels.topic4}</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="message">
          {labels.message} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={labels.messagePlaceholder}
          className={inputClass('message') + ' resize-none'}
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2 bg-[#0A2647] hover:bg-[#0e3568] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-150 text-sm"
      >
        {status === 'sending' ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {labels.sending}
          </>
        ) : (
          <>
            {labels.submit}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
