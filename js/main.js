/* ============================================================
   NMCL – Nationwide Mortgage Company Limited
   Main JavaScript – Shared across all pages
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PAGE LOADER ─────────────────────────────────────────── */
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Premium Reveal Duration: 1.8 seconds
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 800);
    }, 1800);
  }

  /* ── NAVBAR SCROLL STATE ─────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── HAMBURGER MOBILE MENU ───────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const active = mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', active);
      hamburger.classList.toggle('active');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));

  /* ── MORTGAGE CALCULATOR ─────────────────────────────────── */
  const calcForm = document.getElementById('calc-form');
  if (calcForm) {
    const propVal = document.getElementById('calc-prop-value');
    const downPay = document.getElementById('calc-down-payment');
    const termSel = document.getElementById('calc-term');
    const rateInp = document.getElementById('calc-rate');
    
    function formatKES(n) {
      return 'KES ' + Math.round(n).toLocaleString('en-KE');
    }

    function calculate() {
      const pv = parseFloat(propVal.value.replace(/,/g, '')) || 0;
      const dp = parseFloat(downPay.value.replace(/,/g, '')) || 0;
      const term = parseInt(termSel.value) || 15;
      const rate = parseFloat(rateInp.value) / 100 / 12 || 0;
      
      const loanAmt = Math.max(0, pv - dp);
      const months = term * 12;
      
      let monthly = 0;
      if (rate > 0) {
        monthly = loanAmt * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      } else {
        monthly = loanAmt / months;
      }
      
      const totalPaid = monthly * months;
      const totalInterest = totalPaid - loanAmt;

      document.getElementById('res-monthly').textContent = formatKES(monthly);
      document.getElementById('res-loan').textContent = formatKES(loanAmt);
      document.getElementById('res-total').textContent = formatKES(totalPaid);
      document.getElementById('res-interest').textContent = formatKES(totalInterest);
    }

    // Input formatting (KES commas)
    [propVal, downPay].forEach(input => {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/,/g, '').replace(/[^\d]/g, '');
        if (value) {
          e.target.value = parseInt(value).toLocaleString('en-KE');
        } else {
          e.target.value = '';
        }
        calculate();
      });
    });

    [termSel, rateInp].forEach(el => el.addEventListener('change', calculate));
    
    // Initial calc
    calculate();
  }

  /* ── TESTIMONIAL CAROUSEL ────────────────────────────────── */
  const slides = document.querySelectorAll('.testimonial-item');
  if (slides.length > 0) {
    let current = 0;
    const dots = document.querySelectorAll('.carousel-dots-home .dot');

    function showSlide(idx) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      
      slides[idx].classList.add('active');
      dots[idx].classList.add('active');
    }

    setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 5000);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        current = i;
        showSlide(current);
      });
    });
  }

  /* ── MULTI-STEP LOAN KYC FORM ────────────────────────────── */
  const forms = document.querySelectorAll('.kyc-loan-form');
  
  forms.forEach(form => {
    const steps = form.querySelectorAll('.form-step');
    const nextBtns = form.querySelectorAll('.next-step');
    const prevBtns = form.querySelectorAll('.prev-step');
    const progressDots = form.querySelectorAll('.progress-dot');
    let currentStep = 0;

    function updateForm() {
      steps.forEach((step, i) => {
        step.classList.toggle('active', i === currentStep);
      });
      if (progressDots.length > 0) {
        progressDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentStep);
        });
      }
    }

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          updateForm();
          
          // Scroll form into view if needed
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          updateForm();
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  });

  /* ── KES INPUT FORMATTER ─────────────────────────────── */
  const kesInputs = document.querySelectorAll('.kes-format');
  kesInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/,/g, '').replace(/[^\d]/g, '');
      if (value) {
        e.target.value = parseInt(value).toLocaleString('en-KE');
      } else {
        e.target.value = '';
      }
    });
  });

});
