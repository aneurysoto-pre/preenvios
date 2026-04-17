/**
 * Resend email client + templates for free subscriber alerts
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'PreEnvios <alertas@preenvios.com>'
const BASE_URL = 'https://preenvios.com'

// ── Templates ──────────────────────────────────────────────────────

type ConfirmEmailData = {
  token: string
  corredor: string
  idioma: 'es' | 'en'
}

type DailyAlertData = {
  corredor: string
  corredorNombre: string
  moneda: string
  mejorOperador: string
  mejorTasa: number
  fee: number
  linkAfiliado: string
  tokenBaja: string
  idioma: 'es' | 'en'
}

type WeeklyDigestData = {
  resumen: { corredor: string; corredorNombre: string; moneda: string; mejorOperador: string; mejorTasa: number }[]
  tokenBaja: string
  idioma: 'es' | 'en'
}

function confirmEmailHtml({ token, corredor, idioma }: ConfirmEmailData): string {
  const en = idioma === 'en'
  const link = `${BASE_URL}/${idioma}/confirmar-suscripcion?token=${token}`
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Inter,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#0B1220">
    <h1 style="font-size:22px;color:#0A4FE5">${en ? 'Confirm your subscription' : 'Confirma tu suscripción'}</h1>
    <p style="font-size:16px;line-height:1.6">${en
      ? `You signed up for daily rate alerts for <strong>${corredor}</strong> on PreEnvios.com.`
      : `Te registraste para recibir alertas diarias de tasas para <strong>${corredor}</strong> en PreEnvios.com.`}</p>
    <a href="${link}" style="display:inline-block;background:#0A4FE5;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;margin:24px 0">
      ${en ? 'Confirm my email' : 'Confirmar mi email'} →
    </a>
    <p style="font-size:13px;color:#64748B">${en
      ? 'If you didn\'t sign up, just ignore this email.'
      : 'Si no te registraste, ignora este email.'}</p>
  </body></html>`
}

function dailyAlertHtml(d: DailyAlertData): string {
  const en = d.idioma === 'en'
  const unsubLink = `${BASE_URL}/${d.idioma}/baja?token=${d.tokenBaja}`
  const compareLink = `${BASE_URL}/${d.idioma}`
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Inter,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#0B1220">
    <h1 style="font-size:20px;color:#0A4FE5">${en ? `Today's rate to ${d.corredorNombre}` : `Tasa del día a ${d.corredorNombre}`}</h1>
    <div style="background:#E8F0FF;border-radius:16px;padding:24px;margin:20px 0;text-align:center">
      <p style="font-size:14px;color:#64748B;margin:0 0 4px">${en ? 'Best rate today' : 'Mejor tasa hoy'}</p>
      <p style="font-size:36px;font-weight:800;color:#0A4FE5;margin:0">${d.moneda === 'USD' ? '1.00' : d.mejorTasa.toFixed(2)} ${d.moneda}</p>
      <p style="font-size:14px;color:#475569;margin:8px 0 0">${en ? 'via' : 'con'} <strong>${d.mejorOperador}</strong> · ${d.fee === 0 ? (en ? 'No fee' : 'Sin comisión') : `$${d.fee} fee`}</p>
    </div>
    ${d.linkAfiliado ? `<a href="${d.linkAfiliado}" style="display:inline-block;background:#00D957;color:#0B1220;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;margin:0 0 16px">${en ? 'Send now with' : 'Enviar ahora con'} ${d.mejorOperador} →</a>` : ''}
    <p><a href="${compareLink}" style="color:#0A4FE5;font-weight:600">${en ? 'Compare all providers' : 'Comparar todas las remesadoras'} →</a></p>
    <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0 16px">
    <p style="font-size:11px;color:#94A3B8">${en
      ? 'You receive this because you subscribed to daily rate alerts on PreEnvios.com.'
      : 'Recibes esto porque te suscribiste a alertas diarias en PreEnvios.com.'}
      <a href="${unsubLink}" style="color:#94A3B8">${en ? 'Unsubscribe' : 'Darse de baja'}</a></p>
  </body></html>`
}

function weeklyDigestHtml(d: WeeklyDigestData): string {
  const en = d.idioma === 'en'
  const unsubLink = `${BASE_URL}/${d.idioma}/baja?token=${d.tokenBaja}`
  const rows = d.resumen.map(r => `<tr>
    <td style="padding:10px 8px;border-bottom:1px solid #E2E8F0">${r.corredorNombre}</td>
    <td style="padding:10px 8px;border-bottom:1px solid #E2E8F0;color:#0A4FE5;font-weight:700">${r.moneda === 'USD' ? '1.00' : r.mejorTasa.toFixed(2)} ${r.moneda}</td>
    <td style="padding:10px 8px;border-bottom:1px solid #E2E8F0">${r.mejorOperador}</td>
  </tr>`).join('')

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Inter,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#0B1220">
    <h1 style="font-size:20px;color:#0A4FE5">${en ? 'Weekly rate summary' : 'Resumen semanal de tasas'}</h1>
    <p style="color:#475569">${en ? 'Best rates this week across all corridors:' : 'Mejores tasas de la semana por corredor:'}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">
      <thead><tr style="background:#F8FAFC">
        <th style="text-align:left;padding:10px 8px;font-size:12px;color:#64748B">${en ? 'Country' : 'País'}</th>
        <th style="text-align:left;padding:10px 8px;font-size:12px;color:#64748B">${en ? 'Best rate' : 'Mejor tasa'}</th>
        <th style="text-align:left;padding:10px 8px;font-size:12px;color:#64748B">${en ? 'Provider' : 'Remesadora'}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <a href="${BASE_URL}/${d.idioma}" style="display:inline-block;background:#0A4FE5;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none">${en ? 'Compare now' : 'Comparar ahora'} →</a>
    <hr style="border:none;border-top:1px solid #E2E8F0;margin:32px 0 16px">
    <p style="font-size:11px;color:#94A3B8">${en
      ? 'You receive this because you subscribed to alerts on PreEnvios.com.'
      : 'Recibes esto porque te suscribiste a alertas en PreEnvios.com.'}
      <a href="${unsubLink}" style="color:#94A3B8">${en ? 'Unsubscribe' : 'Darse de baja'}</a></p>
  </body></html>`
}

// ── Send functions ─────────────────────────────────────────────────

export async function sendConfirmationEmail(email: string, data: ConfirmEmailData) {
  const en = data.idioma === 'en'
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: en ? 'Confirm your PreEnvios subscription' : 'Confirma tu suscripción en PreEnvios',
    html: confirmEmailHtml(data),
  })
}

export async function sendDailyAlert(email: string, data: DailyAlertData) {
  const en = data.idioma === 'en'
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: en
      ? `${data.corredorNombre}: 1 USD = ${data.moneda === 'USD' ? '1.00' : data.mejorTasa.toFixed(2)} ${data.moneda} today`
      : `${data.corredorNombre}: 1 USD = ${data.moneda === 'USD' ? '1.00' : data.mejorTasa.toFixed(2)} ${data.moneda} hoy`,
    html: dailyAlertHtml(data),
  })
}

export async function sendWeeklyDigest(email: string, data: WeeklyDigestData) {
  const en = data.idioma === 'en'
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: en ? 'PreEnvios — Weekly rate summary' : 'PreEnvios — Resumen semanal de tasas',
    html: weeklyDigestHtml(data),
  })
}
