/**
 * Datos estáticos de corredores y operadores compartidos entre componentes
 */

export const CORREDORES_DATA = [
  { id: 'dominican_republic', slug: 'usd-dop', nombre: 'Rep. Dominicana',  nombre_en: 'Dominican Republic', moneda: 'DOP', bandera: '🇩🇴', codigo: 'do' },
  { id: 'honduras',           slug: 'usd-hnl', nombre: 'Honduras',         nombre_en: 'Honduras',           moneda: 'HNL', bandera: '🇭🇳', codigo: 'hn' },
  { id: 'guatemala',          slug: 'usd-gtq', nombre: 'Guatemala',        nombre_en: 'Guatemala',          moneda: 'GTQ', bandera: '🇬🇹', codigo: 'gt' },
  { id: 'el_salvador',        slug: 'usd-svc', nombre: 'El Salvador',      nombre_en: 'El Salvador',        moneda: 'USD', bandera: '🇸🇻', codigo: 'sv' },
  { id: 'colombia',           slug: 'usd-cop', nombre: 'Colombia',         nombre_en: 'Colombia',           moneda: 'COP', bandera: '🇨🇴', codigo: 'co' },
  { id: 'mexico',             slug: 'usd-mxn', nombre: 'México',           nombre_en: 'Mexico',             moneda: 'MXN', bandera: '🇲🇽', codigo: 'mx' },
]

export const OPERADORES_DATA = [
  { slug: 'remitly',       nombre: 'Remitly',        desc_es: 'Una de las remesadoras digitales más grandes del mundo. Envíos rápidos a banco o efectivo, con tasas competitivas para nuevos usuarios.', desc_en: 'One of the largest digital remittance companies in the world. Fast transfers to bank or cash, with competitive rates for new users.' },
  { slug: 'wise',          nombre: 'Wise',           desc_es: 'Conocida por usar la tasa real del mercado sin margen oculto. Ideal para envíos a cuentas bancarias con costos transparentes.', desc_en: 'Known for using the real mid-market exchange rate with no hidden markup. Ideal for bank transfers with transparent costs.' },
  { slug: 'xoom',          nombre: 'Xoom',           desc_es: 'Servicio de remesas de PayPal. Permite enviar a cuentas bancarias, recoger en efectivo o recargar móvil en segundos.', desc_en: 'PayPal\'s remittance service. Send to bank accounts, cash pickup, or mobile reload in seconds.' },
  { slug: 'ria',           nombre: 'Ria',            desc_es: 'Una de las redes de remesas más grandes del mundo, con presencia fuerte en América Latina y costos bajos.', desc_en: 'One of the world\'s largest remittance networks, with strong Latin American presence and low costs.' },
  { slug: 'worldremit',    nombre: 'WorldRemit',     desc_es: 'Remesadora digital con cobertura global. Envíos a banco, efectivo, billetera móvil o recarga de celular.', desc_en: 'Digital remittance provider with global coverage. Transfers to bank, cash, mobile wallet, or airtime.' },
  { slug: 'western-union', nombre: 'Western Union',  desc_es: 'La red de remesas más reconocida del mundo. Miles de puntos físicos para enviar y recibir efectivo en toda Latinoamérica.', desc_en: 'The world\'s most recognized remittance network. Thousands of physical locations across Latin America.' },
  { slug: 'moneygram',     nombre: 'MoneyGram',      desc_es: 'Otra de las grandes redes globales. Envíos a banco o efectivo con cobertura amplia en Centroamérica y el Caribe.', desc_en: 'Another major global network. Bank or cash transfers with broad Central American and Caribbean coverage.' },
]

// ─────────────────────────────────────────────────────────────────────
// WIKI ARTICLES — 14 entries en 5 categorías (paridad 100% con el lote
// 2026-04-25). Todos los slugs alineados al frontmatter de los .md en
// `content/wiki/`. Los slugs viejos (que eran placeholders sin tráfico
// SEO real) fueron reemplazados.
// ─────────────────────────────────────────────────────────────────────
export const WIKI_ARTICLES = [
  // Fundamentos (4) — slugs alineados al frontmatter de los .md publicados
  { slug: 'que-es-tasa-cambio-mid-market-por-que-importa',   cat: 'fundamentos',  titulo: 'Qué es la tasa de cambio mid-market y por qué importa',         titulo_en: 'What is the mid-market exchange rate and why it matters' },
  { slug: 'diferencia-tasa-fee-cual-cuesta-mas-realmente',   cat: 'fundamentos',  titulo: 'Diferencia entre tasa y fee — cuál cuesta más realmente',       titulo_en: 'Rate vs fee — which actually costs more' },
  { slug: 'como-elegir-mejor-remesadora-segun-monto',        cat: 'fundamentos',  titulo: 'Cómo elegir la mejor remesadora según el monto que envías',     titulo_en: 'How to choose the best provider based on the amount you send' },
  { slug: 'documentos-necesarios-enviar-dinero-eeuu',        cat: 'fundamentos',  titulo: 'Qué documentos necesito para enviar dinero desde EE.UU.',       titulo_en: 'What documents do I need to send money from the US' },
  // Métodos de envío (2) — categoría agregada 2026-04-25
  { slug: 'cash-pickup-vs-deposito-bancario',                cat: 'metodos',      titulo: 'Cash pickup vs depósito bancario — cuál me conviene',           titulo_en: 'Cash pickup vs bank deposit — which is better for you' },
  { slug: 'clabe-interbancaria-18-digitos',                  cat: 'metodos',      titulo: 'CLABE interbancaria de 18 dígitos — qué es y por qué la necesitas', titulo_en: '18-digit CLABE interbank code — what it is and why you need it' },
  // Educativos (4) — categoría agregada 2026-04-25
  { slug: 'que-es-remesadora-como-gana-dinero',              cat: 'educativos',   titulo: 'Qué es una remesadora y cómo gana dinero',                      titulo_en: 'What is a remittance company and how it makes money' },
  { slug: 'tipo-cambio-afecta-mas-que-comision',             cat: 'educativos',   titulo: 'Por qué el tipo de cambio afecta más que la comisión',          titulo_en: 'Why the exchange rate matters more than the fee' },
  { slug: 'cuanto-tarda-envio-internacional-realmente',      cat: 'educativos',   titulo: 'Cuánto tarda realmente un envío internacional',                 titulo_en: 'How long does an international transfer really take' },
  { slug: 'que-metodo-es-mejor-efectivo-banco-billetera-digital', cat: 'educativos', titulo: 'Qué método es mejor: efectivo, banco o billetera digital',  titulo_en: 'Which method is best: cash, bank, or digital wallet' },
  // Por corredor (5) — wikis dedicados al pais especifico (HN, DR, GT, SV, CO).
  // Mexico tiene su wiki dedicado en cat:'metodos' (CLABE) por decision del founder
  // en el frontmatter del .md (2026-04-25).
  { slug: 'como-recibir-dinero-republica-dominicana-paso-paso', cat: 'corredor',  titulo: 'Cómo recibir dinero en República Dominicana paso a paso',       titulo_en: 'How to receive money in the Dominican Republic step by step' },
  { slug: 'bancos-honduras-convenio-remesadoras',            cat: 'corredor',     titulo: 'Qué bancos en Honduras tienen convenio con remesadoras',        titulo_en: 'Which banks in Honduras work with remittance providers' },
  { slug: 'cuanto-tarda-transferencia-guatemala-realmente',  cat: 'corredor',     titulo: 'Cuánto tarda una transferencia a Guatemala realmente',          titulo_en: 'How long does a transfer to Guatemala really take' },
  { slug: 'recibir-remesas-el-salvador-tigo-money-chivo',    cat: 'corredor',     titulo: 'Recibir remesas en El Salvador con Tigo Money y Chivo Wallet', titulo_en: 'Receiving remittances in El Salvador with Tigo Money and Chivo Wallet' },
  { slug: 'recibir-remesas-colombia-nequi-bre-b',            cat: 'corredor',     titulo: 'Cómo recibir remesas en Colombia con Nequi y Bre-B',            titulo_en: 'How to receive remittances in Colombia with Nequi and Bre-B' },
  // Educación financiera (2)
  { slug: 'impuestos-remesas-eeuu-pais-receptor',            cat: 'educacion',    titulo: 'Impuestos sobre remesas en EE.UU. y en el país receptor',       titulo_en: 'Taxes on remittances in the US and receiving country' },
  { slug: 'alertas-tipo-cambio-para-que-sirven-como-usarlas', cat: 'educacion',   titulo: 'Alertas de tipo de cambio — para qué sirven y cómo usarlas',    titulo_en: 'Exchange rate alerts — what they do and how to use them' },
]

// ─────────────────────────────────────────────────────────────────────
// BLOG ARTICLES — 21 entries en 4 categorías (paridad 100% con el lote
// 2026-04-25). 15 con .md publicado en `content/blog/`, 6 placeholders
// "Próximamente" automáticos (sin .md).
//
// Categorías nuevas (todas con 4+ artículos por regla):
//   guias-pais   → Guías por país (incluye los 3 blog originales)
//   comparaciones → Comparativas vs entre operadores
//   tendencias    → Innovaciones (WhatsApp, nuevas remesadoras)
//   practicas     → Guías prácticas (apps, emergencias, según monto)
// ─────────────────────────────────────────────────────────────────────
export const BLOG_ARTICLES = [
  // Guías por país (7) — high-intent + 2 existentes recategorizados
  { slug: 'mejor-remesadora-republica-dominicana-2026',        cat: 'guias-pais',     titulo: 'Mejor remesadora para enviar dinero a República Dominicana en 2026', titulo_en: 'Best remittance company to send money to the Dominican Republic in 2026' },
  { slug: 'enviar-dinero-colombia-opciones-costos',            cat: 'guias-pais',     titulo: 'Enviar dinero a Colombia desde Estados Unidos — opciones y costos',  titulo_en: 'Sending money to Colombia from the US — options and costs' },
  { slug: 'remesadora-mas-barata-mexico',                      cat: 'guias-pais',     titulo: 'Cuál es la remesadora más barata para enviar dinero a México',       titulo_en: 'Which is the cheapest remittance company to send money to Mexico' },
  { slug: 'enviar-dinero-latinoamerica-sin-comisiones-altas',  cat: 'guias-pais',     titulo: 'Cómo enviar dinero a Latinoamérica sin pagar comisiones altas',      titulo_en: 'How to send money to Latin America without paying high fees' },
  { slug: 'cuanto-dinero-se-pierde-comisiones-remesas',        cat: 'guias-pais',     titulo: 'Cuánto dinero se pierde en comisiones al enviar remesas',            titulo_en: 'How much money is lost in fees when sending remittances' },
  { slug: 'cuanto-cobra-western-union-honduras',               cat: 'guias-pais',     titulo: 'Cuánto cobra Western Union para enviar dinero a Honduras hoy',       titulo_en: 'How much does Western Union charge to send money to Honduras today' },
  { slug: 'forma-mas-barata-enviar-guatemala',                 cat: 'guias-pais',     titulo: 'La forma más barata de mandar dinero a Guatemala en 2026',           titulo_en: 'The cheapest way to send money to Guatemala in 2026' },
  // Comparativas (6) — Wise vs Remitly reemplaza Félix Pago vs Remitly (decisión founder 2026-04-25)
  { slug: 'remitly-vs-western-union-dominicana',               cat: 'comparaciones',  titulo: 'Remitly vs Western Union para enviar a República Dominicana',        titulo_en: 'Remitly vs Western Union for sending to the Dominican Republic' },
  { slug: 'remitly-vs-ria-money-transfer-cual-conviene',       cat: 'comparaciones',  titulo: 'Remitly vs Ria Money Transfer — cuál conviene más',                  titulo_en: 'Remitly vs Ria Money Transfer — which is better' },
  { slug: 'western-union-vs-moneygram-comparacion-completa',   cat: 'comparaciones',  titulo: 'Western Union vs MoneyGram — comparación completa',                  titulo_en: 'Western Union vs MoneyGram — full comparison' },
  { slug: 'wise-vs-remitly-cual-conviene',                     cat: 'comparaciones',  titulo: 'Wise vs Remitly — cuál te conviene más en 2026',                     titulo_en: 'Wise vs Remitly — which is better in 2026' },
  { slug: 'ria-money-transfer-vs-moneygram-rapido-barato',     cat: 'comparaciones',  titulo: 'Ria Money Transfer vs MoneyGram — cuál es más rápido y barato',      titulo_en: 'Ria Money Transfer vs MoneyGram — faster and cheaper' },
  { slug: 'xoom-vs-remitly-cual-conviene-mas',                 cat: 'comparaciones',  titulo: 'Xoom vs Remitly — cuál conviene más para enviar remesas',            titulo_en: 'Xoom vs Remitly — which is better for remittances' },
  // Tendencias (4) — innovaciones del corredor
  { slug: 'enviar-dinero-whatsapp-como-funciona',              cat: 'tendencias',     titulo: 'Enviar dinero por WhatsApp — cómo funciona y si vale la pena',       titulo_en: 'Sending money via WhatsApp — how it works and if it is worth it' },
  { slug: 'nuevas-remesadoras-digitales-latam-2026',           cat: 'tendencias',     titulo: 'Las nuevas remesadoras digitales en Latinoamérica (2026)',           titulo_en: 'New digital remittance companies in Latin America (2026)' },
  { slug: 'alternativas-western-union-mas-baratas-2026',       cat: 'tendencias',     titulo: 'Alternativas a Western Union más baratas en 2026',                   titulo_en: 'Cheaper alternatives to Western Union in 2026' },
  { slug: 'como-saber-cuanto-dinero-recibe-realmente-persona', cat: 'tendencias',     titulo: 'Cómo saber cuánto dinero recibe realmente la persona',               titulo_en: 'How to know how much money the recipient really receives' },
  // Guías prácticas (4) — bonus
  { slug: 'enviar-dinero-republica-dominicana-whatsapp-guia',  cat: 'practicas',      titulo: 'Enviar dinero a República Dominicana por WhatsApp (guía completa)',  titulo_en: 'Sending money to the Dominican Republic via WhatsApp (full guide)' },
  { slug: 'mejores-apps-enviar-dinero-latinoamerica',          cat: 'practicas',      titulo: 'Mejores apps para enviar dinero a Latinoamérica',                    titulo_en: 'Best apps to send money to Latin America' },
  { slug: 'como-enviar-dinero-rapido-emergencias',             cat: 'practicas',      titulo: 'Cómo enviar dinero rápido en emergencias',                           titulo_en: 'How to send money fast in emergencies' },
  { slug: 'que-remesadora-usar-segun-monto-envias',            cat: 'practicas',      titulo: 'Qué remesadora usar según el monto que envías',                      titulo_en: 'Which remittance company to use depending on the amount' },
]
