import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * POST /api/whatsapp/webhook
 *
 * Recibe mensajes de WhatsApp vía Twilio y responde con la tasa del día.
 * El usuario escribe el código del corredor (DOP, HNL, GTQ, SVC/USD)
 * y recibe la mejor tasa + link de afiliado.
 *
 * Requiere: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
 * Se activa cuando el usuario configure Twilio.
 */

const CORREDOR_MAP: Record<string, string> = {
  dop: 'dominican_republic',
  hnl: 'honduras',
  gtq: 'guatemala',
  usd: 'el_salvador',
  svc: 'el_salvador',
  rd: 'dominican_republic',
  hn: 'honduras',
  gt: 'guatemala',
  sv: 'el_salvador',
  dominicana: 'dominican_republic',
  honduras: 'honduras',
  guatemala: 'guatemala',
  salvador: 'el_salvador',
}

const CORREDOR_NAMES: Record<string, Record<string, string>> = {
  dominican_republic: { es: 'Rep. Dominicana', en: 'Dominican Republic' },
  honduras: { es: 'Honduras', en: 'Honduras' },
  guatemala: { es: 'Guatemala', en: 'Guatemala' },
  el_salvador: { es: 'El Salvador', en: 'El Salvador' },
}

function detectLanguage(text: string): 'es' | 'en' {
  const enWords = ['send', 'rate', 'how', 'much', 'money', 'hello', 'hi', 'what']
  const lower = text.toLowerCase()
  return enWords.some((w) => lower.includes(w)) ? 'en' : 'es'
}

export async function POST(request: NextRequest) {
  // Check if Twilio is configured
  if (!process.env.TWILIO_ACCOUNT_SID) {
    return NextResponse.json({ error: 'Twilio not configured' }, { status: 503 })
  }

  const formData = await request.formData()
  const body = formData.get('Body')?.toString().trim().toLowerCase() || ''
  const from = formData.get('From')?.toString() || ''

  // Detect language from message
  const lang = detectLanguage(body)

  // Find corridor
  const corredorKey = CORREDOR_MAP[body] || CORREDOR_MAP[body.replace(/\s/g, '')]
  if (!corredorKey) {
    const helpMsg =
      lang === 'en'
        ? 'Send a currency code to get today\'s rate:\n\n🇩🇴 DOP — Dominican Republic\n🇭🇳 HNL — Honduras\n🇬🇹 GTQ — Guatemala\n🇸🇻 USD — El Salvador\n\nExample: type DOP'
        : 'Envía un código de moneda para ver la tasa de hoy:\n\n🇩🇴 DOP — Rep. Dominicana\n🇭🇳 HNL — Honduras\n🇬🇹 GTQ — Guatemala\n🇸🇻 USD — El Salvador\n\nEjemplo: escribe DOP'

    return twimlResponse(helpMsg)
  }

  // Get best rate from Supabase
  const { data: precios } = await supabase
    .from('precios')
    .select('*')
    .eq('corredor', corredorKey)
    .eq('metodo_entrega', 'bank')
    .eq('activo', true)
    .order('tasa', { ascending: false })

  if (!precios || precios.length === 0) {
    const noData = lang === 'en' ? 'No rates available right now. Try again later.' : 'No hay tasas disponibles ahora. Intenta más tarde.'
    return twimlResponse(noData)
  }

  const best = precios[0]
  const name = CORREDOR_NAMES[corredorKey]?.[lang] || corredorKey

  const msg =
    lang === 'en'
      ? `📊 *Rate today — USA → ${name}*\n\n🥇 Best: *${best.nombre_operador}*\n💱 Rate: ${best.tasa} ${best.corredor === 'el_salvador' ? 'USD' : precios[0].corredor === 'dominican_republic' ? 'DOP' : 'per USD'}\n💰 Fee: ${best.fee === 0 ? 'Free' : '$' + best.fee}\n⚡ Speed: ${best.velocidad}\n\n${best.link ? '👉 Send now: ' + best.link : ''}\n\nCompare all: preenvios.com/en`
      : `📊 *Tasa de hoy — USA → ${name}*\n\n🥇 Mejor: *${best.nombre_operador}*\n💱 Tasa: ${best.tasa} ${best.corredor === 'el_salvador' ? 'USD' : 'por USD'}\n💰 Comisión: ${best.fee === 0 ? 'Gratis' : '$' + best.fee}\n⚡ Velocidad: ${best.velocidad}\n\n${best.link ? '👉 Enviar ahora: ' + best.link : ''}\n\nCompara todas: preenvios.com/es`

  return twimlResponse(msg)
}

function twimlResponse(message: string) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Twilio webhook verification (GET for setup)
export async function GET() {
  return NextResponse.json({ status: 'WhatsApp webhook ready' })
}
