/* ─── Andre Fernández «Aji-Panco» · main.js ─── */

// ── Nav: píldora flotante al bajar
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Menú móvil con atrapado de foco
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

function atraparFoco(e) {
  if (e.key === 'Escape') { cerrarMenu(); hamburger?.focus(); return; }
  if (e.key !== 'Tab' || !mobileNav) return;

  const focusables = mobileNav.querySelectorAll('a, button');
  if (!focusables.length) return;
  const primero = focusables[0];
  const ultimo  = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === primero) {
    e.preventDefault(); ultimo.focus();
  } else if (!e.shiftKey && document.activeElement === ultimo) {
    e.preventDefault(); primero.focus();
  }
}

function cerrarMenu() {
  mobileNav?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  mobileNav?.removeEventListener('keydown', atraparFoco);
}

hamburger?.addEventListener('click', () => {
  const abierto = mobileNav?.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(Boolean(abierto)));
  document.body.style.overflow = abierto ? 'hidden' : '';

  if (abierto && mobileNav) {
    mobileNav.querySelector('a, button')?.focus();
    mobileNav.addEventListener('keydown', atraparFoco);
  } else {
    mobileNav?.removeEventListener('keydown', atraparFoco);
  }
});

mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));

// ── Aparición al hacer scroll (una sola vez por elemento)
const observadorReveal = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add('in');
    observadorReveal.unobserve(entrada.target);
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observadorReveal.observe(el));

// ── FAQ en acordeón
document.querySelectorAll('.faq-q').forEach(pregunta => {
  pregunta.addEventListener('click', () => {
    const item = pregunta.parentElement;
    const resp = item.querySelector('.faq-a');
    const estabaAbierta = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(abierta => {
      abierta.classList.remove('open');
      abierta.querySelector('.faq-a').style.maxHeight = 0;
      abierta.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    if (!estabaAbierta) {
      item.classList.add('open');
      resp.style.maxHeight = resp.scrollHeight + 'px';
      pregunta.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Contadores de las cifras
// Quien pide menos movimiento ve el número final directamente, sin animación.
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observadorCifras = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;
    observadorCifras.unobserve(entrada.target);

    const el = entrada.target;
    const fin = Number(el.dataset.count);

    if (sinMovimiento) { el.textContent = fin; return; }

    const duracion = 1100;
    const inicio = performance.now();
    const paso = (ahora) => {
      const p = Math.min((ahora - inicio) / duracion, 1);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(c => observadorCifras.observe(c));

// ── Botón flotante de WhatsApp: aparición diferida tras superar el hero
const waFloat = document.querySelector('.wa-float');
const hero = document.getElementById('inicio');

if (waFloat && hero) {
  if ('IntersectionObserver' in window) {
    const observadorWa = new IntersectionObserver(([entry]) => {
      waFloat.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0 });
    observadorWa.observe(hero);
  } else {
    window.addEventListener('scroll', () => {
      const rect = hero.getBoundingClientRect();
      waFloat.classList.toggle('visible', rect.bottom <= 0);
    }, { passive: true });
  }
}
