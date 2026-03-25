export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  topic: z.string().max(100).optional(),
  message: z.string().min(1).max(5000),
  lang: z.enum(['de', 'en']).optional(),
});

const topicMap: Record<string, Record<string, string>> = {
  health:   { de: 'Krankenkasse', en: 'Health Insurance' },
  pension:  { de: 'Vorsorge', en: 'Pension Planning' },
  property: { de: 'Sachversicherung', en: 'Property Insurance' },
  general:  { de: 'Allgemeine Anfrage', en: 'General Inquiry' },
};

export const POST: APIRoute = async ({ request }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Validation failed', issues: parsed.error.issues }),
      { status: 422, headers: corsHeaders }
    );
  }

  const { name, email, phone, topic, message, lang = 'de' } = parsed.data;
  const topicLabel = topic ? (topicMap[topic]?.[lang] ?? topic) : '';

  const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
  const TO = import.meta.env.CONTACT_TO_EMAIL ?? 'service@solidwave.ch';
  const FROM = import.meta.env.CONTACT_FROM_EMAIL ?? 'noreply@solidwave.ch';

  if (!RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY not set');
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <div style="background: #0A2647; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 18px; font-weight: 600;">
          Neue Kontaktanfrage / New Contact Request
        </h1>
      </div>
      <div style="background: #f8fafc; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 120px; vertical-align: top;">Name</td>
            <td style="padding: 8px 0; font-weight: 500;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">E-Mail</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4A7C8C;">${email}</a></td>
          </tr>
          ${phone ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Telefon</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
          ${topicLabel ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Thema</td><td style="padding: 8px 0;">${topicLabel}</td></tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Sprache</td>
            <td style="padding: 8px 0;">${lang.toUpperCase()}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">Nachricht / Message</p>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
      </div>
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">
        Solidwave Group AG · Zug, Switzerland · solidwave.ch
      </p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Solidwave Contact <${FROM}>`,
      to: [TO],
      reply_to: email,
      subject: `[Solidwave] ${topicLabel || 'Kontaktanfrage'} – ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[contact] Resend error:', err);
    return new Response(JSON.stringify({ error: 'Email delivery failed' }), {
      status: 502,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: corsHeaders,
  });
};
