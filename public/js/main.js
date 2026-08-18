// ============ MOT D'ACCUEIL ANIMÉ ============
const morphWord = document.getElementById('morphWord');
const langOrder = ['en', 'ar', 'fr', 'rw', 'sw'];
let morphIndex = 0;

function cycleGreeting() {
  morphWord.style.opacity = '0';
  morphWord.style.transform = 'translateY(8px)';

  setTimeout(() => {
    morphIndex = (morphIndex + 1) % langOrder.length;
    const lang = langOrder[morphIndex];
    morphWord.textContent = GREETINGS[lang];
    morphWord.style.fontFamily = lang === 'ar'
      ? "'Noto Naskh Arabic', serif"
      : "'Fraunces', serif";
    morphWord.style.opacity = '1';
    morphWord.style.transform = 'translateY(0)';
  }, 320);
}

morphWord.style.transition = 'opacity 0.32s ease, transform 0.32s ease';
setInterval(cycleGreeting, 2600);

// ============ SÉLECTEUR DE LANGUE ============
const langSwitcher = document.querySelector('.lang-switcher');
const langCurrentBtn = document.getElementById('langCurrent');
const langCurrentLabel = document.getElementById('langCurrentLabel');
const langOptions = document.getElementById('langOptions');

langCurrentBtn.addEventListener('click', () => {
  langSwitcher.classList.toggle('open');
  langCurrentBtn.setAttribute('aria-expanded', langSwitcher.classList.contains('open'));
});

document.addEventListener('click', (e) => {
  if (!langSwitcher.contains(e.target)) langSwitcher.classList.remove('open');
});

langOptions.querySelectorAll('li').forEach((item) => {
  item.addEventListener('click', () => {
    const lang = item.getAttribute('data-lang');
    setLanguage(lang);
    langSwitcher.classList.remove('open');
  });
});

function setLanguage(lang) {
  const isRtl = RTL_LANGS.includes(lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

  langCurrentLabel.textContent = lang.toUpperCase();

  // Applique les traductions à tous les éléments marqués data-i18n
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  // Mémorise le choix pour la prochaine visite
  localStorage.setItem('dd_lang', lang);
}

// Charge la langue sauvegardée au démarrage (sinon anglais par défaut)
const savedLang = localStorage.getItem('dd_lang') || 'en';
if (savedLang !== 'en') setLanguage(savedLang);

// ============ MONTANTS DE DON ============
const amountButtons = document.querySelectorAll('.amount-btn:not(.amount-custom)');
const customBtn = document.getElementById('customAmountBtn');
const customInput = document.getElementById('customAmountInput');
let selectedAmount = null;

amountButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    amountButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedAmount = parseFloat(btn.getAttribute('data-amount'));
    customInput.classList.add('hidden');
    customBtn.classList.remove('active');
  });
});

customBtn.addEventListener('click', () => {
  amountButtons.forEach((b) => b.classList.remove('active'));
  customBtn.classList.add('active');
  customInput.classList.remove('hidden');
  customInput.focus();
  selectedAmount = null;
});

customInput.addEventListener('input', () => {
  selectedAmount = parseFloat(customInput.value) || null;
});

document.getElementById('donateSubmit').addEventListener('click', async () => {
  if (!selectedAmount || selectedAmount < 1) {
    alert('Please choose or enter a donation amount.');
    return;
  }

  try {
    const res = await fetch('/api/payments/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: selectedAmount }),
    });
    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert(data.message || 'Something went wrong.');
    }
  } catch (err) {
    console.error(err);
    alert('Could not start the donation. Please try again.');
  }
});
