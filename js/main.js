/* =====================================================
   ARISE – Digital Marketing Platform
   main.js  |  Minimal interactions
   ===================================================== */

(function () {
  'use strict';

  /* ── Mobile Navigation Toggle ── */
  var navbar    = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close menu when a nav link is clicked */
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu on outside click */
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Navbar scroll state ── */
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Back To Top ── */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Scroll Reveal (IntersectionObserver) ── */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: show all reveal elements immediately */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Blog category filter ── */
  var filterBtns   = document.querySelectorAll('.filter-btn');
  var articleCards = document.querySelectorAll('.article-card[data-category]');

  if (filterBtns.length && articleCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-filter');

        /* Update active state */
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        /* Filter cards */
        articleCards.forEach(function (card) {
          var cardCat = card.getAttribute('data-category');
          var show = (category === 'all' || cardCat === category);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ── TOC active link on scroll (article pages) ── */
  var tocLinks = document.querySelectorAll('.toc-link[href^="#"]');
  if (tocLinks.length) {
    var headings = [];
    tocLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) headings.push({ link: link, el: el });
    });

    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 120;
      var active = null;
      headings.forEach(function (item) {
        if (item.el.offsetTop <= scrollPos) active = item;
      });
      tocLinks.forEach(function (l) { l.classList.remove('active'); });
      if (active) active.link.classList.add('active');
    }, { passive: true });
  }

}());
