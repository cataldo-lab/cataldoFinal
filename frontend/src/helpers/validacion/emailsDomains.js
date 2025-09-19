export const EMAILS_DOMINIOS_PERMITIDOS = [
  // === PROVEEDORES GLOBALES PRINCIPALES ===
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "yahoo.es",
  "icloud.com",
  "me.com",
  "msn.com",

  // === PROVEEDORES LOCALES CHILE ===
  "gmail.cl",
  "live.cl",
  "yahoo.cl",

  // === UNIVERSIDADES CHILENAS ===
  // Universidades públicas principales
  "uchile.cl",       // Universidad de Chile
  "usach.cl",        // Universidad de Santiago
  "uv.cl",           // Universidad de Valparaíso
  "udec.cl",         // Universidad de Concepción
  "uach.cl",         // Universidad Austral
  "ufro.cl",         // Universidad de la Frontera (corregido)
  "utem.cl",         // Universidad Tecnológica Metropolitana
  "utalca.cl",       // Universidad de Talca
  "uda.cl",          // Universidad de Atacama
  "ulagos.cl",       // Universidad de Los Lagos
  "unap.cl",         // Universidad Arturo Prat
  "uoh.cl",          // Universidad de O'Higgins

  // Universidades católicas
  "puc.cl",          // Pontificia Universidad Católica
  "uc.cl",           // Alternativa de la UC
  "ucn.cl",          // Universidad Católica del Norte
  "uct.cl",          // Universidad Católica de Temuco
  "ucsc.cl",         // Universidad Católica de la Santísima Concepción
  "ucsh.cl",         // Universidad Católica Silva Henríquez

  // Universidades técnicas
  "usm.cl",          // Universidad Técnica Federico Santa María
  "utfsm.cl",        // Alias USM

  // Universidades privadas
  "udp.cl",          // Universidad Diego Portales
  "uandes.cl",       // Universidad de los Andes
  "uai.cl",          // Universidad Adolfo Ibáñez
  "unab.cl",         // Universidad Andrés Bello
  "ubo.cl",          // Universidad Bernardo O'Higgins
  "ucentral.cl",     // Universidad Central de Chile
  "uahurtado.cl",    // Universidad Alberto Hurtado
  "uautonoma.cl",    // Universidad Autónoma de Chile

  // Dominios específicos de facultades
  "unegocios.cl",    // Facultad Economía y Negocios U. Chile

  // === INSTITUTOS Y FORMACIÓN TÉCNICA ===
  "duoc.cl",         // Duoc UC
  "inacap.cl",       // Inacap
  "ipchile.cl",      // IP Chile
  "aiep.cl",         // AIEP
  "santotomas.cl",   // Santo Tomás
  "cftestatal.cl",   // CFT Estatales

  // === DOMINIOS EDUCATIVOS GENERALES ===
  "profesor.cl",
  "educacion.cl",

  // === GOBIERNO DE CHILE ===
  // Dominio principal
  "gob.cl",

  // Ministerios
  "mineduc.cl",        // Ministerio de Educación
  "minsal.cl",         // Ministerio de Salud
  "minvu.cl",          // Ministerio de Vivienda y Urbanismo
  "minsegpres.cl",     // Secretaría General de la Presidencia
  "minrel.gob.cl",     // Ministerio de Relaciones Exteriores
  "minjusticia.gob.cl",// Ministerio de Justicia y DDHH
  "minmineria.cl",     // Ministerio de Minería
  "minenergia.cl",     // Ministerio de Energía
  "mindefensa.cl",     // Ministerio de Defensa
  "mintransporte.cl",  // Ministerio de Transportes y Telecomunicaciones
  "mintrab.gob.cl",    // Ministerio del Trabajo
  "minagri.gob.cl",    // Ministerio de Agricultura
  "mineco.gob.cl",     // Ministerio de Economía
  "minhacienda.cl",    // Ministerio de Hacienda
  "segegob.cl",        // Secretaría General de Gobierno

  // Servicios públicos
  "subtel.gob.cl",     // Subsecretaría de Telecomunicaciones
  "serviciospublicos.cl",
  "municipalidad.cl",
];

// Dominios bloqueados organizados por categoría
export const EMAILS_DOMINIOS_BLOQUEADOS = [
  // === DOMINIOS MALICIOSOS GENÉRICOS ===
  "spam.com",
  "fake.com", 
  "blocked.com",
  "malicious.com",
  "phishing.com",
  "scam.com",
  "virus.com",
  "hack.com",
  "badcontent.com",
  "inappropriate.net",
  "suspicious.org",

  // === EMAILS TEMPORALES/DESECHABLES ===
  // Servicios principales
  "10minutemail.com",
  "20minutemail.com",
  "tempmail.org",
  "temp-mail.org",
  "temp-mail.io",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "mailinator.com",
  "throwaway.email",
  "disposablemail.com",
  "yopmail.com",
  "maildrop.cc",
  "tempail.com",
  "sharklasers.com",
  "grr.la",

  // Servicios menos conocidos
  "spam4.me",
  "mails.tk",
  "emailondeck.com",
  "fakeinbox.com",
  "mytrashmail.com",
  "trashmail.com",
  "tempinbox.com",
  "mohmal.com",
  "emailfake.com",
  "dispostable.com",
  "burnermail.io",
  "tempmailer.com",
  "instant-mail.de",
  "e4ward.com",
  "mintemail.com",
  "getnada.com",
  "tempmail.net",
  "1secmail.com",
  "1secmail.org",
  "1secmail.net",
  "jetable.org",
  "jetable.com",
  "jetable.net",
  "nwytg.net",
  "tmpnator.live",
  "rootfest.net",
  "tmails.net",
  "inboxkitten.com",
  "tempmail24.com",
  "tempmailo.com",
  "mail.tm",

  // === DOMINIOS QUE IMITAN SERVICIOS LEGÍTIMOS ===
  "gmial.com",
  "gmai.com",
  "gmail.co",
  "hotmial.com",
  "hotmai.com",
  "yahooo.com",
  "outloook.com",
  "outlok.com",

  // === DOMINIOS DE PRUEBA/DESARROLLO ===
  "test.com",
  "testing.com",
  "example.com",
  "example.org",
  "example.net",
  "localhost.com",
  "dev.com",
  "staging.com",

  // === TLD GRATUITOS SOSPECHOSOS ===
  "example.tk",
  "test.ml",
  "demo.ga",
  "sample.cf",
  "test.tk",
  "spam.tk",
  "fake.ml",
  "temp.ga",
  "bad.cf",

  // === SERVICIOS DE EMAIL MASKING (OPCIONAL) ===
  "relay.firefox.com",
  "duck.com",
  "simplelogin.co",
  "anonaddy.com",

  // === DOMINIOS SIN VERIFICACIÓN ===
  "cock.li",
  "dicksinhisan.us",
  "loves.dicksinhisan.us",
  "wants.dicksinhisan.us",
  "cocaine.ninja",
  "national.shitposting.agency",

  // === DOMINIOS DE RESPUESTA AUTOMÁTICA ===
  "noreply.com",
  "donotreply.com",
  "no-reply.com",
  "bounce.com",
  "returned.com",

  // === SERVICIOS DE SPAM/MARKETING AGRESIVO ===
  "nospam.com",
  "antispam.com",
  "mailcatch.com",
  "spambog.com",
  "spambog.de",
  "spambog.ru",
];
