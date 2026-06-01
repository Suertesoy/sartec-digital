// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Close menu on nav link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// Scroll-based fade-in animations
const observer = new IntersectionObserver(
  (entries) => entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
      setTimeout(() => entry.target.classList.add('aos-in'), delay);
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
