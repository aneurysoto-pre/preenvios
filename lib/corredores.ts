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

export const WIKI_ARTICLES = [
  // Fundamentos
  { slug: 'tasa-cambio-mid-market',         cat: 'fundamentos',  titulo: 'Qué es la tasa de cambio mid-market y por qué importa', titulo_en: 'What is the mid-market exchange rate and why it matters' },
  { slug: 'diferencia-tasa-fee',            cat: 'fundamentos',  titulo: 'Diferencia entre tasa y fee — cuál cuesta más realmente', titulo_en: 'Rate vs fee — which actually costs more' },
  { slug: 'elegir-remesadora-segun-monto',  cat: 'fundamentos',  titulo: 'Cómo elegir la mejor remesadora según el monto que envías', titulo_en: 'How to choose the best provider based on the amount you send' },
  { slug: 'cash-pickup-vs-banco',           cat: 'fundamentos',  titulo: 'Cash pickup vs depósito bancario — cuál me conviene', titulo_en: 'Cash pickup vs bank deposit — which is better for you' },
  { slug: 'documentos-enviar-dinero-usa',   cat: 'fundamentos',  titulo: 'Qué documentos necesito para enviar dinero desde EE.UU.', titulo_en: 'What documents do I need to send money from the US' },
  // Por corredor
  { slug: 'recibir-dinero-republica-dominicana', cat: 'corredor', titulo: 'Cómo recibir dinero en República Dominicana paso a paso', titulo_en: 'How to receive money in the Dominican Republic step by step' },
  { slug: 'bancos-honduras-remesadoras',         cat: 'corredor', titulo: 'Qué bancos en Honduras tienen convenio con remesadoras', titulo_en: 'Which banks in Honduras work with remittance providers' },
  { slug: 'tiempo-transferencia-guatemala',      cat: 'corredor', titulo: 'Cuánto tarda una transferencia a Guatemala realmente', titulo_en: 'How long does a transfer to Guatemala really take' },
  // Educación financiera
  { slug: 'impuestos-remesas',                   cat: 'educacion', titulo: 'Impuestos sobre remesas en EE.UU. y en el país receptor', titulo_en: 'Taxes on remittances in the US and receiving country' },
  { slug: 'alertas-tipo-cambio',                 cat: 'educacion', titulo: 'Alertas de tipo de cambio — para qué sirven y cómo usarlas', titulo_en: 'Exchange rate alerts — what they do and how to use them' },
]
