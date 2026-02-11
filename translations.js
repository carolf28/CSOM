// ---------------------
// TRANSLATIONS
// ---------------------
const translations = {
  en: {
    mobile_loading_message: "If you're on mobile,<br>unmute or use 🎧",

    // Navigation translations
    menu_button: "Menu",
    nav_quemsomos: "About Us",
    nav_barulhario: "Barulhário",
    nav_oficinascsom: "CSOM Workshops",
    nav_criacoescsom: "CSOM Creations",
    nav_contacto: "Contact",

    // INDEX HTML
    sidebar_upcoming_events: "UPCOMING EVENTS",

    // Event 1
    events_upcoming_title: "Upcoming Events",
    event1_title: "CSOM presents: CParty é esta? ✴︎ February 7 ✴︎ 11PM ✴︎ Damas",
    event1_date: "02/07/2026",
    event1_location: "Damas, Lisbon",
    event1_desc1: "We start the year with a very special event at Damas: the launch of our new website and a benefit party to continue the project and new sonic ideas.",
    event1_desc2: "At night, starting at 11PM, the website launch will take place with a brief chat with us and carolf, who made it with love.",
    event1_desc3: "Then we have a CSOM concert with participants from all workshops and the official debut of the duo Kebra Noize.",
    event1_desc4: "The dance floor will be on fire with DJ Nervoso and a b2b with the CSOM team aka Miguel Limão & Serpente Flor, until 4AM.",
    event1_highlight: "<strong>CSOM – CParty</strong> Show up! 👀",

    // Event 2
    event2_title: "CSOM Workshop ✴︎ Build a Sampler February 7 (Saturday) 1–6PM ✴︎ Damas",
    event2_date: "02/07/2026",
    event2_location: "Damas, Lisbon",
    event2_desc1: "Using a module with an integrated circuit and a microphone, we will solder various components and build a Sampler uoꙨou. It has two mini-jack IN/OUT outputs, which you can connect to another audio source or directly to a speaker. It has non-volatile memory, which means if you turn it off and on again, the sample will remain recorded. Powered by a 9V battery.",
    event2_desc2: "In this workshop, you will build your own Sampler uoꙨou.",
    event2_list: "<li>✴︎ Record from the microphone or audio input (max 10 sec.)</li><li>✴︎ Change the pitch of the sample up to 20s</li><li>✴︎ Play the sample in loop</li>",
    event2_desc3: "All materials and kits are included. You only need to bring the box where you want to build your sampler.",
    event2_desc4: "It’s recommended to have some soldering experience, but no one will be excluded if they don’t 🙂",
    event2_info: "<strong>↪ More info and registration:</strong> <a href='mailto:csom@riseup.net'>csom@riseup.net</a>",
    event2_extra: "<strong>Age:</strong> 16+<br><strong>Duration:</strong> 5 hours<br><strong>Schedule:</strong> 1–6PM<br><strong>Max participants:</strong> 10<br><strong>Fee:</strong> 45 sons",
    event2_highlight: "This workshop is part of the first event of <strong>CSOM – CParty</strong>. More news coming soon 👀",

    start_button_text: "[click the copper stripes]",

    // ABOUT PAGE
    page_title_about: "About Us",
    csom_team_caption: "© Photo by Vera Marmelo",

    about_intro: "<strong>CSOM</strong> is a sound and electronics project that promotes autonomous and inclusive pedagogies, sharing tools, and demystifying knowledge. Through workshops and various gatherings, we aim to create spaces for listening, experimentation, and collective learning.",
    history_intro: "Since the beginning of 2025, we have organized a series of workshops and moments of sound experimentation. We held some activities in our studio in Almada, as well as in spaces, cultural associations, and festivals in Lisbon, Sintra, Coimbra, Porto, and Cape Verde.",
    history_barulhario: "In September we inaugurated BARULHÁRIO, which integrates CSOM activities as an educational proposal for sound exploration for children and teenagers.",
    history_team: "The CSOM team consists of: <br> <strong>Mariana Pinho</strong> <br> <strong>Miguel Limão</strong>",
    
    contact_title: "Contact",
    contact_form_title: "Want to get in touch?<br>Send us a message.",
    contact_form_subtitle: "We will respond as soon as possible.",
    form_name: "Name",
    form_email: "Email",
    form_message: "Message",
    form_submit: "Send",

    // OFICINAS PAGE

    workshops_title: "CSOM Workshops",
    workshops_about_title: "About the CSOM workshops",
    workshops_about_desc: "CSOM workshops are spaces for learning, sharing, and experimentation. Open to everyone, whether you have experience in electronics or not.",

    workshop_build_title: "Build Your Own Electro-Acoustic Box",
    workshop_build_credits: "September 14, 2025<br>Escola do Povo at Festival Clarão, Sintra",
    workshop_build_desc: "In this workshop, we’ll learn to solder and build an electro-acoustic box using piezo microphones and springs. It has a mini-jack audio output so you can connect it directly to a speaker or effects pedals.",

    workshop_photosynth_title: "Build a PHOTOSYNTH",
    workshop_photosynth_credits: "August 23, 2025<br>Casa das Artes Bissaya Barreto, Coimbra",
    workshop_photosynth_desc: "In this workshop, we’ll learn to build a PHOTOSYNTH 𓆙𓆙𓆙 — a synthesizer that works with photosensitive cells. These cells convert light intensity into an electrical signal that controls the frequency and modulation of the generated sound. You can play it with your hand by moving closer or farther to let in more or less light. You can also use a flashlight or other light source to create different sounds.",

    
  

  }
};

























// ---------------------
// LANGUAGE SWITCHING
// ---------------------
let currentLang = "pt"; 
const originalText = {};
const originalPlaceholder = {};

// ---------------------
// Initialize language and store PT text
// ---------------------
export function initLanguage(buttonSelector = "#lang-btn") {
  const buttonElement = document.querySelector(buttonSelector);

  // Store PT text at page load (use innerHTML to keep HTML like <br>)
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      originalText[key] = el.innerHTML;
    }
  });

  // Store PT placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) {
      originalPlaceholder[key] = el.placeholder;
    }
  });

  // Determine current language: saved or browser
  const savedLang = localStorage.getItem("siteLang");
  if (savedLang && (savedLang === "pt" || savedLang === "en")) {
    currentLang = savedLang;
  } else {
    const browserLang = navigator.language || navigator.userLanguage;
    currentLang = browserLang.startsWith("en") ? "en" : "pt";
  }

  // Apply language to page
  applyLanguage();

  // Setup button click
  if (buttonElement) {
    buttonElement.textContent = currentLang === "pt" ? "EN" : "PT";
    buttonElement.addEventListener("click", () => toggleLanguage(buttonElement));
  }
}

// ---------------------
// Apply current language to all elements
// ---------------------
function applyLanguage() {
  // Translate innerHTML elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;

    if (currentLang === "en" && translations.en[key]) {
      el.innerHTML = translations.en[key]; // keep <br> if present
    } else {
      el.innerHTML = originalText[key]; // restore PT
    }
  });

  // Translate placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;

    if (currentLang === "en" && translations.en[key]) {
      el.placeholder = translations.en[key];
    } else {
      el.placeholder = originalPlaceholder[key]; // restore PT
    }
  });
}

// ---------------------
// Toggle language
// ---------------------
export function toggleLanguage(buttonElement) {
  currentLang = currentLang === "pt" ? "en" : "pt";

  applyLanguage();

  if (buttonElement) {
    buttonElement.textContent = currentLang === "pt" ? "EN" : "PT";
  }

  localStorage.setItem("siteLang", currentLang);
}
