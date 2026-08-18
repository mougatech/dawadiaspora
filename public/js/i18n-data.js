// Mot d'accueil affiché en boucle dans le hero, un par langue
const GREETINGS = {
  en: "Welcome",
  ar: "أهلاً بكم",
  fr: "Bienvenue",
  rw: "Murakaza neza",
  sw: "Karibu"
};

const RTL_LANGS = ["ar"];

// Traductions de l'interface (miroir simplifié des fichiers locales/*.json du backend)
const TRANSLATIONS = {
  en: {
    "nav.courses": "Courses", "nav.faq": "Q&A", "nav.about": "About", "nav.donate": "Donate", "nav.login": "Log In",
    "hero.eyebrow": "A platform for the diaspora",
    "hero.subtitle": "Learn the languages of home — through lessons built in PDF, audio, and video, in the language you already speak.",
    "hero.available_in": "Available in",
    "btn.start_learning": "Start Learning", "btn.how_it_works": "How it works", "btn.custom_amount": "Custom", "btn.donate": "Donate",
    "courses.eyebrow": "Lessons", "courses.title": "Choose your language",
    "course.level.beginner": "Beginner", "course.level.intermediate": "Intermediate",
    "how.eyebrow": "The method", "how.title": "Three ways in, one goal",
    "how.subtitle": "Every lesson comes in the format that fits how you learn — read, listen, or watch. Move at your pace, unlock the next step when you're ready.",
    "how.pdf.title": "Read", "how.pdf.desc": "Structured lesson guides you can print, annotate, and keep.",
    "how.audio.title": "Listen", "how.audio.desc": "Native pronunciation, repeated until it sticks.",
    "how.video.title": "Watch", "how.video.desc": "Real teachers, real context, on screen.",
    "donate.eyebrow": "Keep it going", "donate.title": "Help a language stay spoken",
    "donate.subtitle": "Your gift funds new lessons and keeps courses accessible to families across the diaspora.",
    "faq.eyebrow": "Need help", "faq.title": "Questions & Answers",
    "faq.category.audio": "Audio", "faq.category.video": "Video", "faq.category.pdf": "PDF",
    "footer.rights": "All rights reserved."
  },
  ar: {
    "nav.courses": "الدورات", "nav.faq": "الأسئلة", "nav.about": "من نحن", "nav.donate": "تبرع", "nav.login": "تسجيل الدخول",
    "hero.eyebrow": "منصة للشتات",
    "hero.subtitle": "تعلّم لغة الوطن — من خلال دروس بصيغة PDF وصوت وفيديو، باللغة التي تتحدثها بالفعل.",
    "hero.available_in": "متوفر باللغات",
    "btn.start_learning": "ابدأ التعلم", "btn.how_it_works": "كيف يعمل", "btn.custom_amount": "مبلغ آخر", "btn.donate": "تبرع",
    "courses.eyebrow": "الدروس", "courses.title": "اختر لغتك",
    "course.level.beginner": "مبتدئ", "course.level.intermediate": "متوسط",
    "how.eyebrow": "الطريقة", "how.title": "ثلاث طرق، هدف واحد",
    "how.subtitle": "كل درس متوفر بالصيغة التي تناسب طريقة تعلمك — اقرأ أو استمع أو شاهد.",
    "how.pdf.title": "اقرأ", "how.pdf.desc": "أدلة دروس منظمة يمكنك طباعتها والاحتفاظ بها.",
    "how.audio.title": "استمع", "how.audio.desc": "نطق أصلي، يتكرر حتى يترسخ.",
    "how.video.title": "شاهد", "how.video.desc": "معلمون حقيقيون، وسياق حقيقي.",
    "donate.eyebrow": "استمر معنا", "donate.title": "ساعد لغة على البقاء حية",
    "donate.subtitle": "تبرعك يمول دروسًا جديدة ويبقي الدورات متاحة للعائلات في الشتات.",
    "faq.eyebrow": "تحتاج مساعدة", "faq.title": "الأسئلة والأجوبة",
    "faq.category.audio": "صوتي", "faq.category.video": "فيديو", "faq.category.pdf": "PDF",
    "footer.rights": "جميع الحقوق محفوظة."
  },
  fr: {
    "nav.courses": "Cours", "nav.faq": "Q&R", "nav.about": "À propos", "nav.donate": "Faire un don", "nav.login": "Connexion",
    "hero.eyebrow": "Une plateforme pour la diaspora",
    "hero.subtitle": "Apprenez la langue de vos racines — avec des leçons en PDF, audio et vidéo, dans la langue que vous parlez déjà.",
    "hero.available_in": "Disponible en",
    "btn.start_learning": "Commencer", "btn.how_it_works": "Comment ça marche", "btn.custom_amount": "Montant libre", "btn.donate": "Faire un don",
    "courses.eyebrow": "Leçons", "courses.title": "Choisissez votre langue",
    "course.level.beginner": "Débutant", "course.level.intermediate": "Intermédiaire",
    "how.eyebrow": "La méthode", "how.title": "Trois formats, un seul objectif",
    "how.subtitle": "Chaque leçon existe dans le format qui vous convient — lisez, écoutez ou regardez, à votre rythme.",
    "how.pdf.title": "Lire", "how.pdf.desc": "Des guides de leçon structurés à imprimer et annoter.",
    "how.audio.title": "Écouter", "how.audio.desc": "Prononciation native, répétée jusqu'à ce qu'elle s'ancre.",
    "how.video.title": "Regarder", "how.video.desc": "De vrais enseignants, en contexte, à l'écran.",
    "donate.eyebrow": "Continuons ensemble", "donate.title": "Aidez une langue à rester vivante",
    "donate.subtitle": "Votre don finance de nouvelles leçons et garde les cours accessibles aux familles de la diaspora.",
    "faq.eyebrow": "Besoin d'aide", "faq.title": "Questions & Réponses",
    "faq.category.audio": "Audio", "faq.category.video": "Vidéo", "faq.category.pdf": "PDF",
    "footer.rights": "Tous droits réservés."
  },
  rw: {
    "nav.courses": "Amasomo", "nav.faq": "Ibibazo", "nav.about": "Abo turi bo", "nav.donate": "Tanga impano", "nav.login": "Injira",
    "hero.eyebrow": "Urubuga rw'abo mu mahanga",
    "hero.subtitle": "Iga ururimi rw'iwanyu — binyuze mu masomo ya PDF, amajwi, na videwo, mu rurimi usanzwe uvuga.",
    "hero.available_in": "Iboneka mu ndimi",
    "btn.start_learning": "Tangira Kwiga", "btn.how_it_works": "Uko bikora", "btn.custom_amount": "Andi mafaranga", "btn.donate": "Tanga impano",
    "courses.eyebrow": "Amasomo", "courses.title": "Hitamo ururimi rwawe",
    "course.level.beginner": "Utangira", "course.level.intermediate": "Rugero rwo hagati",
    "how.eyebrow": "Uburyo", "how.title": "Uburyo butatu, intego imwe",
    "how.subtitle": "Buri isomo riboneka mu buryo bukwiye uko wiga — soma, umva, cyangwa reba.",
    "how.pdf.title": "Soma", "how.pdf.desc": "Amasomo yateguwe neza wachapa kandi ukayasoma.",
    "how.audio.title": "Umva", "how.audio.desc": "Imvugo nyakuri, isubirwamo kugeza igushize mu mutwe.",
    "how.video.title": "Reba", "how.video.desc": "Abarimu nyabo, mu buzima nyabwo.",
    "donate.eyebrow": "Dukomeze", "donate.title": "Fasha ururimi kuguma ruvugwa",
    "donate.subtitle": "Impano yawe itera inkunga amasomo mashya kandi igafasha imiryango yo mu mahanga.",
    "faq.eyebrow": "Ukeneye ubufasha", "faq.title": "Ibibazo n'Ibisubizo",
    "faq.category.audio": "Amajwi", "faq.category.video": "Videwo", "faq.category.pdf": "PDF",
    "footer.rights": "Uburenganzira bwose burarinzwe."
  },
  sw: {
    "nav.courses": "Kozi", "nav.faq": "Maswali", "nav.about": "Kuhusu Sisi", "nav.donate": "Changia", "nav.login": "Ingia",
    "hero.eyebrow": "Jukwaa la watu wa diaspora",
    "hero.subtitle": "Jifunze lugha ya kwenu — kupitia masomo ya PDF, sauti, na video, kwa lugha unayoizungumza tayari.",
    "hero.available_in": "Inapatikana kwa",
    "btn.start_learning": "Anza Kujifunza", "btn.how_it_works": "Jinsi inavyofanya kazi", "btn.custom_amount": "Kiasi kingine", "btn.donate": "Changia",
    "courses.eyebrow": "Masomo", "courses.title": "Chagua lugha yako",
    "course.level.beginner": "Mwanzo", "course.level.intermediate": "Kati",
    "how.eyebrow": "Mbinu", "how.title": "Njia tatu, lengo moja",
    "how.subtitle": "Kila somo linapatikana kwa mtindo unaokufaa — soma, sikiliza, au tazama, kwa mwendo wako.",
    "how.pdf.title": "Soma", "how.pdf.desc": "Miongozo ya masomo iliyoandaliwa vizuri unayoweza kuchapisha.",
    "how.audio.title": "Sikiliza", "how.audio.desc": "Matamshi asilia, yanayorudiwa hadi uyahifadhi.",
    "how.video.title": "Tazama", "how.video.desc": "Walimu halisi, muktadha halisi, skrini.",
    "donate.eyebrow": "Tuendelee", "donate.title": "Saidia lugha iendelee kuzungumzwa",
    "donate.subtitle": "Mchango wako unafadhili masomo mapya na kuweka kozi zipatikane kwa familia za diaspora.",
    "faq.eyebrow": "Unahitaji msaada", "faq.title": "Maswali na Majibu",
    "faq.category.audio": "Sauti", "faq.category.video": "Video", "faq.category.pdf": "PDF",
    "footer.rights": "Haki zote zimehifadhiwa."
  }
};
