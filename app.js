// Menorca Connect - Main Page Interactive Logic

const PLANS_DATA = {
  combos: [
    {
      tag: 'Más elegido en Menorca',
      tagClass: '',
      title: 'Combo Isla 600 Mb + 50 GB',
      subtitle: 'Ideal para parejas y hogares conectados',
      sketchPrice: 'XX,XX€',
      realPrice: '32,90€',
      featured: false,
      btnClass: 'teal',
      specs: [
        '<strong>Fibra 600 Mb</strong> simétrica de alta estabilidad',
        '<strong>Línea móvil 5G con 50 GB</strong> acumulables',
        '<strong>Llamadas ilimitadas</strong> a fijos y móviles',
        '<strong>Router Wi-Fi 6</strong> e instalación incluida'
      ]
    },
    {
      tag: 'Máxima Velocidad',
      tagClass: 'tag-orange',
      title: 'Combo Far 1 Gb + Ilimitado',
      subtitle: 'Para familias, teletrabajo y streaming 4K',
      sketchPrice: 'XX,XX€',
      realPrice: '39,90€',
      featured: true,
      btnClass: 'orange',
      specs: [
        '<strong>Fibra 1 Gb (1000 Mb)</strong> simétrica real',
        '<strong>2 Líneas móviles 5G</strong> con GB ilimitados',
        '<strong>Llamadas ilimitadas</strong> nacionales',
        '<strong>Todo en una sola factura</strong> sin permanencia'
      ]
    },
    {
      tag: 'Especial Familias',
      tagClass: '',
      title: 'Pack Familiar 1 Gb + 3 Líneas',
      subtitle: 'Todos conectados con datos compartidos',
      sketchPrice: 'XX,XX€',
      realPrice: '46,90€',
      featured: false,
      btnClass: 'teal',
      specs: [
        '<strong>Fibra 1 Gb</strong> + amplificador Mesh opcional',
        '<strong>3 Líneas 5G</strong> con 100 GB cada una',
        '<strong>Pack Menorca TV</strong> básico incluido',
        '<strong>Atención preferente</strong> en tienda y WhatsApp'
      ]
    }
  ],
  ofertas: [
    {
      tag: 'Todo Incluido',
      tagClass: 'tag-orange',
      title: 'Combo Total 600 Mb + Móvil + TV',
      subtitle: 'Fibra rápida, móvil 5G y más de 80 canales',
      sketchPrice: 'XX,XX€',
      realPrice: '38,90€',
      featured: false,
      btnClass: 'orange',
      specs: [
        '<strong>Fibra 600 Mb</strong> simétrica estable',
        '<strong>Móvil 5G con 80 GB</strong> acumulables + ilimitadas',
        '<strong>Menorca TV (+80 canales)</strong> con decodificador 4K',
        '<strong>Grabación y Replay</strong> últimos 7 días'
      ]
    },
    {
      tag: 'Oferta Estrella',
      tagClass: 'tag-orange',
      title: 'Pack Illa 1 Gb + 2 Móviles + TV Total',
      subtitle: 'La experiencia completa al mejor precio',
      sketchPrice: 'XX,XX€',
      realPrice: '45,90€',
      featured: true,
      btnClass: 'orange',
      specs: [
        '<strong>Fibra 1 Gb</strong> con Router Wi-Fi 6 Pro',
        '<strong>2 Líneas Móviles 5G</strong> con datos ilimitados',
        '<strong>TV Total (+100 canales)</strong>, cine y series',
        '<strong>Precio definitivo</strong> sin subidas ni sorpresas'
      ]
    },
    {
      tag: 'Premium Hogar',
      tagClass: 'tag-purple',
      title: 'Superpack 1 Gb + 4 Líneas + TV',
      subtitle: 'Para hogares que lo quieren absolutamente todo',
      sketchPrice: 'XX,XX€',
      realPrice: '54,90€',
      featured: false,
      btnClass: 'teal',
      specs: [
        '<strong>Fibra 1 Gb</strong> + repetidor Wi-Fi Mesh incluido',
        '<strong>4 Líneas Móviles 5G</strong> ilimitadas',
        '<strong>Menorca TV Multi-dispositivo</strong> (hasta 4 pantallas)',
        '<strong>Sin permanencia</strong> y alta en 24-48h'
      ]
    }
  ],
  fibra: [
    {
      tag: 'Esencial',
      tagClass: '',
      title: 'Fibra Óptica 300 Mb',
      subtitle: 'Conexión estable y simétrica para el día a día',
      sketchPrice: 'XX,XX€',
      realPrice: '24,90€',
      featured: false,
      btnClass: 'teal',
      specs: [
        '<strong>300 Mb simétricos</strong> (subida y bajada)',
        '<strong>Router Wi-Fi</strong> de última generación cedido',
        '<strong>Instalación rápida</strong> por técnicos locales',
        '<strong>Línea fija opcional</strong> sin coste de alta'
      ]
    },
    {
      tag: 'Más Vendida',
      tagClass: '',
      title: 'Fibra Óptica 600 Mb',
      subtitle: 'Velocidad perfecta para varios dispositivos y 4K',
      sketchPrice: 'XX,XX€',
      realPrice: '27,90€',
      featured: true,
      btnClass: 'teal',
      specs: [
        '<strong>600 Mb simétricos</strong> reales por fibra',
        '<strong>Router Wi-Fi 6</strong> de alto alcance incluido',
        '<strong>Baja latencia</strong> para videollamadas y gaming',
        '<strong>Atención directa</strong> en Menorca'
      ]
    },
    {
      tag: 'Ultra Rápida',
      tagClass: 'tag-orange',
      title: 'Fibra Óptica 1 Gb + Segunda Residencia',
      subtitle: 'Máxima potencia o flexible por temporadas',
      sketchPrice: 'XX,XX€',
      realPrice: '31,90€',
      featured: false,
      btnClass: 'teal',
      specs: [
        '<strong>Hasta 1.000 Mb (1 Gb)</strong> de velocidad simétrica',
        '<strong>Opción modo vacaciones</strong> para segundas residencias',
        '<strong>Instalación gratuita</strong> sin letra pequeña',
        '<strong>Sin permanencia</strong>: tú decides siempre'
      ]
    }
  ],
  movil: [
    {
      tag: 'Básica 5G',
      tagClass: 'tag-green',
      title: 'Tarifa Móvil 30 GB 5G',
      subtitle: 'Navega a máxima velocidad y acumula tus datos',
      sketchPrice: 'XX,XX€',
      realPrice: '8,90€',
      featured: false,
      btnClass: 'green',
      specs: [
        '<strong>30 GB a velocidad 5G</strong> en toda la isla',
        '<strong>Datos acumulables</strong> para el mes siguiente',
        '<strong>Llamadas ilimitadas</strong> a fijos y móviles',
        '<strong>Sin permanencia</strong> y SIM/eSIM gratis'
      ]
    },
    {
      tag: 'Súper Ventas',
      tagClass: 'tag-green',
      title: 'Tarifa Móvil 80 GB 5G',
      subtitle: 'Olvídate de mirar el consumo de datos',
      sketchPrice: 'XX,XX€',
      realPrice: '11,90€',
      featured: true,
      btnClass: 'green',
      specs: [
        '<strong>80 GB a velocidad 5G</strong> acumulables',
        '<strong>Llamadas ilimitadas</strong> nacionales + Roaming UE',
        '<strong>Conserva tu número</strong> en 24h sin cortes',
        '<strong>Sin permanencia</strong> ni cargos ocultos'
      ]
    },
    {
      tag: 'Sin Límites',
      tagClass: 'tag-green',
      title: 'Tarifa Móvil GB Ilimitados 5G',
      subtitle: 'Todo el 5G que necesites dentro y fuera de casa',
      sketchPrice: 'XX,XX€',
      realPrice: '16,90€',
      featured: false,
      btnClass: 'green',
      specs: [
        '<strong>Datos Ilimitados 5G</strong> a máxima velocidad',
        '<strong>Llamadas ilimitadas</strong> y 1.000 SMS incluidos',
        '<strong>Compartir datos (Tethering)</strong> sin restricciones',
        '<strong>Atención 100% local</strong> por WhatsApp o tienda'
      ]
    }
  ],
  tv: [
    {
      tag: 'Entretenimiento',
      tagClass: 'tag-purple',
      title: 'Menorca Connect TV Esencial',
      subtitle: 'Más de 80 canales temáticos para toda la familia',
      sketchPrice: 'XX,XX€',
      realPrice: '6,90€',
      featured: false,
      btnClass: 'purple',
      specs: [
        '<strong>Más de 80 canales</strong> de cine, series y documentales',
        '<strong>Canales autonómicos y locales</strong> en HD',
        '<strong>App para Smart TV, móvil y tablet</strong>',
        '<strong>Función Ver desde el inicio</strong> incluida'
      ]
    },
    {
      tag: 'Con Deco 4K',
      tagClass: 'tag-purple',
      title: 'Menorca Connect TV Total + Deco 4K',
      subtitle: 'Convierte tu televisor en un centro multimedia',
      sketchPrice: 'XX,XX€',
      realPrice: '9,90€',
      featured: true,
      btnClass: 'purple',
      specs: [
        '<strong>Más de 100 canales</strong> en calidad Full HD y 4K',
        '<strong>Decodificador Android TV 4K</strong> incluido',
        '<strong>Grabación en la nube (350h)</strong> y Replay 7 días',
        '<strong>Hasta 4 dispositivos</strong> simultáneos'
      ]
    },
    {
      tag: 'Cine & Deporte',
      tagClass: 'tag-purple',
      title: 'Pack TV Familiar + Infantil & Motor',
      subtitle: 'El catálogo más completo de canales y contenidos bajo demanda',
      sketchPrice: 'XX,XX€',
      realPrice: '12,90€',
      featured: false,
      btnClass: 'purple',
      specs: [
        '<strong>Todos los canales temáticos</strong> + videoclub bajo demanda',
        '<strong>Control parental</strong> y perfiles personalizados',
        '<strong>Pausa en directo</strong> y descarga para ver sin conexión',
        '<strong>Sin permanencia</strong>: actívalo cuando quieras'
      ]
    }
  ]
};

let currentPriceMode = 'sketch'; // 'sketch' ('XX,XX€') or 'real' ('24,90€')
let currentCategory = 'combos';
const PANEL_BRIDGE_URL = 'https://panel.menorcaconnect.com/api/public/web-bridge';

async function syncCatalogFromPanelDb() {
  try {
    const res = await fetch(PANEL_BRIDGE_URL, { method: 'GET', mode: 'cors' });
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.ok && data.plansByCategory) {
      ['combos', 'ofertas', 'fibra', 'movil', 'tv'].forEach((cat) => {
        if (Array.isArray(data.plansByCategory[cat]) && data.plansByCategory[cat].length > 0) {
          PLANS_DATA[cat] = data.plansByCategory[cat];
        }
      });
      renderPlans(currentCategory);
    }
  } catch {
    // Fallback silencioso a PLANS_DATA estático si el navegador está sin red
  }
}

function sendLeadToPanelDb(payload) {
  try {
    fetch(PANEL_BRIDGE_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // No bloquear apertura de WhatsApp
  }
}

function updateAllPriceElements() {
  const priceElements = document.querySelectorAll('[data-sketch][data-real]');
  priceElements.forEach((el) => {
    el.textContent = currentPriceMode === 'sketch'
      ? el.getAttribute('data-sketch')
      : el.getAttribute('data-real');
  });
}

function renderPlans(categoryKey) {
  currentCategory = categoryKey;
  const container = document.getElementById('plansContainer');
  const plans = PLANS_DATA[categoryKey] || PLANS_DATA.combos;

  container.innerHTML = plans
    .map((plan) => {
      const displayPrice = currentPriceMode === 'sketch' ? plan.sketchPrice : plan.realPrice;
      const waText = encodeURIComponent(`Hola Menorca Connect, me interesa información sobre la tarifa: ${plan.title}`);
      return `
        <div class="plan-detail-card ${plan.featured ? 'featured' : ''}" data-category="${categoryKey}">
          <div class="plan-tag ${plan.tagClass}">${plan.tag}</div>
          <div class="plan-header">
            <h3>${plan.title}</h3>
            <p>${plan.subtitle}</p>
          </div>
          <div class="plan-price-box">
            <span class="plan-price-val" data-sketch="${plan.sketchPrice}" data-real="${plan.realPrice}">${displayPrice}</span>
            <span class="plan-price-meta">/mes · IVA incl.</span>
          </div>
          <ul class="plan-specs">
            ${plan.specs.map((s) => `<li>${s}</li>`).join('')}
          </ul>
          <a href="https://wa.me/34671123456?text=${waText}" target="_blank" rel="noopener" class="plan-cta-btn ${plan.btnClass}" data-plan-title="${plan.title}">
            Lo quiero por WhatsApp
          </a>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('[data-plan-title]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const planTitle = btn.getAttribute('data-plan-title') || '';
      sendLeadToPanelDb({
        fullName: `Interesado Web (${planTitle})`,
        plan: planTitle,
        source: 'web_menorcaconnect_tarifa',
        notes: `Clic en contratar tarifa "${planTitle}" (${categoryKey}) desde menorcaconnect.com`,
      });
    });
  });

  // Update active state on tabs
  document.querySelectorAll('.tariff-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.getAttribute('data-tab') === categoryKey);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Tariff Tabs
  const tabs = document.querySelectorAll('.tariff-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      renderPlans(targetTab);
    });
  });

  // 2. Connect Hero Cards & Nav Links to Tariff Tabs
  const tabTriggers = document.querySelectorAll('[data-select-tab], [data-filter]');
  tabTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const cat = trigger.getAttribute('data-select-tab') || trigger.getAttribute('data-filter');
      if (cat && PLANS_DATA[cat]) {
        renderPlans(cat);
      }
      // Close mobile menu if open
      const nav = document.querySelector('.main-nav');
      if (nav) nav.classList.remove('open');
    });
  });

  // 3. Presentation Price Mode Switcher (Boceto XX,XX€ vs Precios Demo)
  const btnSketch = document.getElementById('btnModeSketch');
  const btnReal = document.getElementById('btnModeReal');

  if (btnSketch && btnReal) {
    btnSketch.addEventListener('click', () => {
      currentPriceMode = 'sketch';
      btnSketch.classList.add('active');
      btnReal.classList.remove('active');
      updateAllPriceElements();
    });

    btnReal.addEventListener('click', () => {
      currentPriceMode = 'real';
      btnReal.classList.add('active');
      btnSketch.classList.remove('active');
      updateAllPriceElements();
    });
  }

  // 4. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.querySelector('.main-nav');
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  // 5. Coverage Form Submission -> Save in Panel DB (real_leads) + Direct WhatsApp Consultation
  const coverageForm = document.getElementById('coverageForm');
  if (coverageForm) {
    coverageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const address = document.getElementById('coverageAddress').value.trim();
      const phone = document.getElementById('coveragePhone').value.trim();
      sendLeadToPanelDb({
        fullName: `Consulta Cobertura (${phone})`,
        phone,
        address,
        source: 'web_menorcaconnect_cobertura',
        notes: `Solicitud de cobertura en "${address}" · Teléfono/WhatsApp: ${phone}`,
      });
      const message = encodeURIComponent(
        `Hola Menorca Connect, quiero comprobar la cobertura de fibra/5G en mi dirección: "${address}". Mi teléfono de contacto es: ${phone}.`
      );
      window.open(`https://wa.me/34671123456?text=${message}`, '_blank', 'noopener');
    });
  }

  // 6. Hydrate tariffs live from panel.menorcaconnect.com (Supabase real_products)
  syncCatalogFromPanelDb();
});
