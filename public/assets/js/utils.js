// Utility functions

function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function truncate(text = '', len = 120) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '…' : text;
}

function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return alert(msg);
  el.textContent = msg;
  el.classList.remove('hidden');
  el.classList.add('show');
  setTimeout(() => {
    el.classList.remove('show');
    el.classList.add('hidden');
  }, 2500);
}

function showLoading(show) {
  const el = document.getElementById('loadingBar');
  if (!el) return;
  el.classList.toggle('hidden', !show);
}

function showDetailLoading(show) {
  const el = document.getElementById('detailLoading');
  if (!el) return;
  el.classList.toggle('hidden', !show);
}

function animateOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        // Optional: stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all card-enter elements
  document.querySelectorAll('.card-enter').forEach((el) => {
    if (!el.classList.contains('card-visible')) {
      observer.observe(el);
    }
  });
  
  // Also observe other elements that should animate
  document.querySelectorAll('.glass, .glass-strong, .hero-panel, .page-header').forEach((el) => {
    if (!el.classList.contains('animate-observed')) {
      el.classList.add('animate-observed');
      observer.observe(el);
    }
  });
}

function openModal(id) {
  const el = document.getElementById(id);
  el?.classList.remove('hidden');
}

function closeModal(id) {
  const el = document.getElementById(id);
  el?.classList.add('hidden');
}

function linkIcon(url, label) {
  if (!url) return '';
  return `<a class="btn-soft px-3 py-2 rounded-full text-sm" target="_blank" rel="noopener" href="${url}">${label}</a>`;
}

