import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'

/**
 * GET /api/admin/ingresos
 * Reporte de ingresos — placeholder hasta que afiliados estén activos.
 * En Fase 3+ se conecta a Impact, CJ, Partnerize APIs para datos reales.
 */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Placeholder: datos reales vienen cuando afiliados estén activos
  return NextResponse.json({
    periodo: new Date().toISOString().slice(0, 7), // YYYY-MM
    afiliados: {
      impact: { operador: 'Remitly', clics: 0, conversiones: 0, comision: 0, status: 'pendiente aplicación' },
      partnerize: { operador: 'Wise', clics: 0, conversiones: 0, comision: 0, status: 'pendiente aplicación' },
      cj: { operadores: ['Xoom', 'Ria', 'WorldRemit'], clics: 0, conversiones: 0, comision: 0, status: 'pendiente aplicación' },
    },
    suscripciones: {
      free: 0,
      premium: 0,
      mrr: 0,
      note: 'Se activa en Fase 4.4.A (free) y Fase 4.4.B (premium)',
    },
    total_mes: 0,
    note: 'Datos reales disponibles cuando afiliados estén activos (Fase 3)',
  })
}
