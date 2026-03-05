/* =====================================================
   ARISE – Digital Marketing Agency
   main.js
   ===================================================== */

(function () {
  'use strict';

  /* ── Preloader ── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });
  document.body.style.overflow = 'hidden';

  /* ── Navbar ── */
  const navbar  = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
    toggleBackToTop();
  });

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Active Nav Link on Scroll ── */
  function updateActiveLink() {
    var sections = document.querySelectorAll('section[id]');
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var link = document.querySelector('.nav-link[href="#' + section.id + '"]');
      if (!link) return;
      var top    = section.offsetTop;
      var bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }

  /* ── Back To Top ── */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Scroll Reveal (IntersectionObserver) ── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── Count-Up Animation ── */
  function animateCount(el, target, duration) {
    var start = 0;
    var step  = target / (duration / 16);
    var timer = setInterval(function () {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start);
    }, 16);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var numbers = entry.target.querySelectorAll('.stat-number');
        numbers.forEach(function (num) {
          var target = parseInt(num.getAttribute('data-target'), 10);
          animateCount(num, target, 1600);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) statsObserver.observe(statsGrid);

  /* ── Testimonials Carousel ── */
  var track   = document.getElementById('testimonialsTrack');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var dots    = document.querySelectorAll('.dot');
  var current = 0;
  var total   = document.querySelectorAll('.testimonial-card').length;
  var autoSlideTimer;

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () { goTo(current - 1); resetAutoSlide(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); resetAutoSlide(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); resetAutoSlide(); });
    });
    startAutoSlide();
  }

  // Touch/swipe support for carousel
  if (track) {
    var carouselTouchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      carouselTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = carouselTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAutoSlide();
      }
    }, { passive: true });
  }

  /* ── Contact Form Validation ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      function validate(fieldId, errorId, checkFn, msg) {
        var field = document.getElementById(fieldId);
        var errorEl = document.getElementById(errorId);
        var val = field.value.trim();
        if (!checkFn(val)) {
          field.classList.add('error');
          errorEl.textContent = msg;
          valid = false;
        } else {
          field.classList.remove('error');
          errorEl.textContent = '';
        }
      }

      validate('name',    'nameError',    function (v) { return v.length >= 2; },              'Please enter your full name.');
      validate('email',   'emailError',   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Please enter a valid email address.');
      validate('subject', 'subjectError', function (v) { return v.length >= 3; },              'Please enter a subject (min 3 characters).');
      validate('message', 'messageError', function (v) { return v.length >= 10; },             'Please enter a message (min 10 characters).');

      if (valid) {
        var successEl = document.getElementById('formSuccess');
        successEl.classList.add('visible');
        form.reset();
        setTimeout(function () { successEl.classList.remove('visible'); }, 6000);
      }
    });

    // Live validation: clear error on input
    ['name','email','subject','message'].forEach(function (id) {
      var field = document.getElementById(id);
      if (field) {
        field.addEventListener('input', function () {
          field.classList.remove('error');
          var err = document.getElementById(id + 'Error');
          if (err) err.textContent = '';
        });
      }
    });
  }

  /* ── Particle Canvas ── */
  var canvas  = document.getElementById('particleCanvas');
  if (canvas && canvas.getContext) {
    var ctx     = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 60;

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x:    randomBetween(0, canvas.width),
        y:    randomBetween(0, canvas.height),
        r:    randomBetween(0.5, 2),
        dx:   randomBetween(-0.3, 0.3),
        dy:   randomBetween(-0.4, -0.1),
        alpha: randomBetween(0.2, 0.7)
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 197, 24, ' + p.alpha + ')';
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.y < -5) p.y = canvas.height + 5;
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

}());
