const SUPABASE_URL = "https://prcfmhrccfowsykkysld.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2ZtaHJjY2Zvd3N5a2t5c2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzIzNDEsImV4cCI6MjA4ODc0ODM0MX0.60vyMR7wLT8_wYcTqZEb5wzxznIhnwmNLi8cuJ787OQ";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let ITEMS = [];
let STORES_LIST = [];

const BR_STATES = {
  "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas",
  "BA": "Bahia", "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo",
  "GO": "Goiás", "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul",
  "MG": "Minas Gerais", "PA": "Pará", "PB": "Paraíba", "PR": "Paraná",
  "PE": "Pernambuco", "PI": "Piauí", "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte",
  "RS": "Rio Grande do Sul", "RO": "Rondônia", "RR": "Roraima", "SC": "Santa Catarina",
  "SP": "São Paulo", "SE": "Sergipe", "TO": "Tocantins"
};

const US_STATES = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
  "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire",
  "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina",
  "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania",
  "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee",
  "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington",
  "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

const TRANSLATIONS = {
  BR: {
    "title": "Trove BR | Curated Vintage & Second-Hand Fashion Marketplace",
    "logo": "TROVE BR",
    "advertise-btn": "Anuncie sua loja",
    "hero-title": "Tesouros curados dos melhores brechós locais.",
    "hero-subtitle": "Peças únicas de sua preferência",
    "banner-browsing": "Navegando no acervo de ",
    "banner-clear": "Ver todas as lojas",
    "filter-cat-label": "Todas as Categorias",
    "cat-all": "Todas as Categorias",
    "cat-feminino": "Feminino",
    "cat-masculino": "Masculino",
    "cat-vintage": "Vintage",
    "cat-streetwear": "Streetwear",
    "cat-calçados": "Calçados",
    "cat-acessórios": "Acessórios",
    "filter-loc-label": "Todas as Regiões",
    "loc-all": "Todas as Regiões",
    "filter-shop-label": "Todas as Lojas",
    "empty-title": "Nenhum desapego cadastrado nesta região ainda.",
    "empty-desc": "Tente ajustar os filtros ou volte mais tarde para conferir as novidades.",
    "reset-btn": "Limpar Filtros",
    "footer-text": "TROVE &copy; 2026 - Conectando moda circular local.",
    "login-badge": "Acesso Vendedor",
    "login-heading": "Entrar",
    "label-email": "E-mail",
    "label-password": "Senha",
    "login-btn": "Entrar",
    "toggle-no-account": "Não tem uma conta de vendedor?",
    "toggle-signup-link": "Cadastre-se",
    "signup-badge": "Novo Acervo",
    "signup-heading": "Criar Conta Vendedor",
    "strength-label": "Força: -",
    "crit-length": "Mínimo de 6 caracteres",
    "crit-upper": "Uma letra maiúscula",
    "crit-number": "Pelo menos um número",
    "signup-btn": "Registrar Conta",
    "toggle-has-account": "Já possui um cadastro?",
    "toggle-login-link": "Entrar",
    "confirm-badge": "Confirmação",
    "confirm-heading": "Verifique seu E-mail",
    "confirm-desc": "Enviamos um link de confirmação para o endereço:",
    "confirm-subdesc": "Acesse sua caixa de entrada para ativar sua conta de vendedor.",
    "open-gmail": "Abrir Gmail",
    "open-outlook": "Abrir Outlook",
    "resend-btn-text": "Reenviar e-mail",
    "back-home": "Voltar para o Início",
    "create-badge": "Nova Loja",
    "create-heading": "Cadastre seu Brechó",
    "create-subheading": "Insira os dados do seu acervo para começar a publicar.",
    "label-store-name": "Nome do Brechó",
    "label-store-handle": "Identificador/Handle (@)",
    "label-store-phone": "WhatsApp para Vendas (DDD + Número)",
    "label-store-country": "País do Brechó",
    "create-btn": "Criar Meu Brechó",
    "translation-prompt-text": "Prefere o catálogo em Inglês? Conheça nossa loja dos EUA.",
    "translation-prompt-btn": "Mudar para EUA 🇺🇸",
    // JS strings
    "search-placeholder": "Pesquisar por peça, categoria ou brechó...",
    "sold": "Vendido",
    "unique-piece": "Peça Única",
    "size-label": "Tam: ",
    "secure-wa": "Garantir Peça (WhatsApp)",
    "unavailable": "Indisponível",
    "drawer-size": "Tamanho",
    "drawer-price": "Preço",
    "drawer-shipping": "Envio",
    "drawer-loc": "Local",
    "drawer-about": "Sobre o Item",
    "drawer-no-desc": "Sem descrição disponível.",
    "toast-success-login": "Login efetuado com sucesso!",
    "toast-error-login": "Erro ao entrar: ",
    "toast-success-signup": "Cadastro efetuado!",
    "toast-success-signup-confirm": "Cadastro efetuado! Confirme seu e-mail.",
    "toast-error-signup": "Erro no cadastro: ",
    "toast-success-store": "Brechó cadastrado com sucesso!",
    "toast-error-store": "Erro ao cadastrar brechó: ",
    "toast-loc-detected": "Localização detectada: ",
    "toast-loc-recommending": ". Recomendando desapegos da sua região!"
  },
  US: {
    "title": "Trove USA | Curated Vintage & Second-Hand Fashion Marketplace",
    "logo": "TROVE USA",
    "advertise-btn": "Advertise your store",
    "hero-title": "Curated treasures from the best local thrift stores.",
    "hero-subtitle": "Unique pieces of your choice",
    "banner-browsing": "Browsing the catalog of ",
    "banner-clear": "View all stores",
    "filter-cat-label": "All Categories",
    "cat-all": "All Categories",
    "cat-feminino": "Women's",
    "cat-masculino": "Men's",
    "cat-vintage": "Vintage",
    "cat-streetwear": "Streetwear",
    "cat-calçados": "Shoes",
    "cat-acessórios": "Accessories",
    "filter-loc-label": "All Regions",
    "loc-all": "All Regions",
    "filter-shop-label": "All Stores",
    "empty-title": "No unique pieces registered in this region yet.",
    "empty-desc": "Try adjusting the filters or check back later for updates.",
    "reset-btn": "Clear Filters",
    "footer-text": "TROVE &copy; 2026 - Connecting local circular fashion.",
    "login-badge": "Seller Access",
    "login-heading": "Log In",
    "label-email": "Email",
    "label-password": "Password",
    "login-btn": "Log In",
    "toggle-no-account": "Don't have a seller account?",
    "toggle-signup-link": "Sign Up",
    "signup-badge": "New Collection",
    "signup-heading": "Create Seller Account",
    "strength-label": "Strength: -",
    "crit-length": "Minimum 6 characters",
    "crit-upper": "One uppercase letter",
    "crit-number": "At least one number",
    "signup-btn": "Register Account",
    "toggle-has-account": "Already registered?",
    "toggle-login-link": "Log In",
    "confirm-badge": "Confirmation",
    "confirm-heading": "Verify your Email",
    "confirm-desc": "We sent a confirmation link to the address:",
    "confirm-subdesc": "Check your inbox to activate your seller account.",
    "open-gmail": "Open Gmail",
    "open-outlook": "Open Outlook",
    "resend-btn-text": "Resend email",
    "back-home": "Back to Home",
    "create-badge": "New Store",
    "create-heading": "Register your Thrift Store",
    "create-subheading": "Enter your inventory details to start publishing.",
    "label-store-name": "Store Name",
    "label-store-handle": "Handle (@)",
    "label-store-phone": "WhatsApp for Sales (Country/Area Code + Number)",
    "label-store-country": "Store Country",
    "create-btn": "Create My Store",
    "translation-prompt-text": "Prefere em Português? Mude para o catálogo do Brasil.",
    "translation-prompt-btn": "Switch to Brazil 🇧🇷",
    // JS strings
    "search-placeholder": "Search by piece, category or store...",
    "sold": "Sold",
    "unique-piece": "Unique Piece",
    "size-label": "Size: ",
    "secure-wa": "Secure Piece (WhatsApp)",
    "unavailable": "Unavailable",
    "drawer-size": "Size",
    "drawer-price": "Price",
    "drawer-shipping": "Shipping",
    "drawer-loc": "Location",
    "drawer-about": "About the Item",
    "drawer-no-desc": "No description available.",
    "toast-success-login": "Login successful!",
    "toast-error-login": "Error logging in: ",
    "toast-success-signup": "Registration successful!",
    "toast-success-signup-confirm": "Registration successful! Verify your email.",
    "toast-error-signup": "Registration error: ",
    "toast-success-store": "Thrift store successfully registered!",
    "toast-error-store": "Error registering thrift store: ",
    "toast-loc-detected": "Location detected: ",
    "toast-loc-recommending": ". Recommending items from your area!"
  }
};

const state = {
  cat: "all",
  shop: "all",
  loc: "all",
  q: "",
  country: "BR"
};

const sellerState = {
  user: null,
  store: null
};

const grid = document.getElementById("products-grid");
const empty = document.getElementById("empty-state");
const search = document.getElementById("search-input");
const clearSearch = document.getElementById("clear-search");

const shopFilter = document.getElementById("shop-filter");
const shopFilterBtn = document.getElementById("shop-filter-btn");
const shopMenu = document.getElementById("shop-dropdown-menu");
const shopLabel = document.getElementById("active-shop-label");

const catsFilter = document.getElementById("cats-filter");
const catsFilterBtn = document.getElementById("cats-filter-btn");
const catsMenu = document.getElementById("cats-dropdown-menu");
const catsLabel = document.getElementById("active-cat-label");

const stateFilter = document.getElementById("state-filter");
const stateFilterBtn = document.getElementById("state-filter-btn");
const stateMenu = document.getElementById("state-dropdown-menu");
const stateLabel = document.getElementById("active-state-label");

const resetBtn = document.getElementById("reset-filters-btn");
const logo = document.getElementById("header-logo");

const drawer = document.getElementById("detail-drawer");
const drawerBody = document.getElementById("detail-body");
const drawerClose = document.getElementById("detail-close");

const sellerModal = document.getElementById("seller-modal");
const sellerModalCard = document.getElementById("seller-modal-card");
const advTrigger = document.getElementById("advertise-trigger");
const profileBtn = document.getElementById("profile-avatar-btn");
const profileLetter = document.getElementById("profile-avatar-letter");
const sellerClose = document.getElementById("seller-modal-close");

const loginView = document.getElementById("seller-view-login");
const signupView = document.getElementById("seller-view-signup");
const emailConfirmView = document.getElementById("seller-view-email-confirm");
const createStoreView = document.getElementById("seller-view-create-store");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const signupPass = document.getElementById("signup-password");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

const createStoreForm = document.getElementById("create-store-form");
const emailConfirmOkBtn = document.getElementById("email-confirm-ok-btn");

const shopBanner = document.getElementById("shop-banner");
const shopBannerTitle = document.getElementById("shop-banner-title");
const shopBannerHandle = document.getElementById("shop-banner-handle");
const shopBannerClear = document.getElementById("shop-banner-clear-btn");

let resendTimer = null;
let resendSeconds = 60;

document.addEventListener("DOMContentLoaded", async () => {
  await loadCatalog();
  
  // 1. Read URL Search Parameters
  const params = new URLSearchParams(window.location.search);
  const countryParam = params.get("country");
  
  if (countryParam && (countryParam === "BR" || countryParam === "US")) {
    state.country = countryParam;
  } else {
    // 2. Geolocation detection if no country param is supplied
    await detectGeolocation();
  }

  // Translate page to active country's language
  translatePage(state.country);
  updateRegionsDropdown();
  initShopDropdown();

  checkSharedLink();
  bindEvents();
  setupTranslationPromptCard();
  await checkSession();
});

function translatePage(lang) {
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  // Document Title
  document.title = dict.title;

  // Header Logo
  const headerLogo = document.getElementById("header-logo");
  if (headerLogo) headerLogo.textContent = dict.logo;

  // Search input placeholder
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.placeholder = dict["search-placeholder"];
  }

  // All translatable HTML nodes
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (dict[key]) {
      if (el.tagName === "INPUT" && el.type === "submit") {
        el.value = dict[key];
      } else if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // Header switcher trigger
  const activeCountryFlag = document.getElementById("active-country-flag");
  const activeCountryLabel = document.getElementById("active-country-label");
  if (activeCountryFlag && activeCountryLabel) {
    activeCountryFlag.textContent = lang === "BR" ? "🇧🇷" : "🇺🇸";
    activeCountryLabel.textContent = lang;
  }

  // Set HTML lang attribute
  document.documentElement.lang = lang === "BR" ? "pt-BR" : "en-US";
}

async function detectGeolocation() {
  try {
    const res = await Promise.race([
      fetch("https://ipapi.co/json/"),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
    ]);
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    
    const detectedCountry = data.country_code; // e.g. "BR" or "US"
    const detectedRegion = data.region_code; // e.g. "AM" or "NY"
    const detectedCity = data.city || "";

    if (detectedCountry === "BR" || detectedCountry === "US") {
      state.country = detectedCountry;
      
      const isBR = detectedCountry === "BR";
      const statesDict = isBR ? BR_STATES : US_STATES;
      
      if (detectedRegion && statesDict[detectedRegion.toUpperCase()]) {
        state.loc = detectedRegion.toUpperCase();
        
        // Show premium toast
        const dict = TRANSLATIONS[state.country];
        const stateName = statesDict[state.loc];
        const cityName = detectedCity ? `${detectedCity}, ` : "";
        
        setTimeout(() => {
          showToast(`${dict["toast-loc-detected"]}${cityName}${stateName} (${state.loc})${dict["toast-loc-recommending"]}`, "success");
        }, 1000);
      }
    }
  } catch (err) {
    console.warn("Geolocation detection failed, defaulting to BR:", err);
    state.country = "BR";
    state.loc = "all";
  }
}

function setupTranslationPromptCard() {
  const card = document.getElementById("translation-prompt-card");
  const closeBtn = document.getElementById("translation-prompt-close");
  const toggleBtn = document.getElementById("translation-prompt-btn");
  const textPrompt = document.getElementById("translation-prompt-text");
  
  if (!card || !closeBtn || !toggleBtn) return;

  if (sessionStorage.getItem("translation-prompt-dismissed") === "true") {
    card.style.display = "none";
    return;
  }

  // Update card content based on active language
  const isBR = state.country === "BR";
  if (isBR) {
    textPrompt.textContent = "Prefer English? Browse our US marketplace.";
    toggleBtn.textContent = "Switch to US 🇺🇸";
  } else {
    textPrompt.textContent = "Prefere em Português? Conheça nossa loja do Brasil.";
    toggleBtn.textContent = "Mudar para Brasil 🇧🇷";
  }

  // Show card with transition after 1.5s delay
  setTimeout(() => {
    if (sessionStorage.getItem("translation-prompt-dismissed") !== "true") {
      card.style.display = "flex";
    }
  }, 1500);

  closeBtn.addEventListener("click", () => {
    card.style.display = "none";
    sessionStorage.setItem("translation-prompt-dismissed", "true");
  });

  toggleBtn.addEventListener("click", () => {
    card.style.display = "none";
    sessionStorage.setItem("translation-prompt-dismissed", "true");
    
    const newCountry = state.country === "BR" ? "US" : "BR";
    state.country = newCountry;
    
    // Update URL param
    window.history.pushState(null, "", `?country=${newCountry}`);
    
    // Update switchers, translate page, reload drops
    translatePage(newCountry);
    updateRegionsDropdown();
    initShopDropdown();
    reset();
  });
}


async function loadCatalog() {
  const { data: shops, error: sErr } = await client.from("trove_stores").select("*");
  const { data: prods, error: pErr } = await client.from("trove_products").select("*");

  if (sErr || pErr) return;

  STORES_LIST = shops;
  ITEMS = prods.map(p => {
    const store = STORES_LIST.find(s => s.id === p.store_id);
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      size: p.size,
      store: store || { name: "Desconhecido", handle: "@desconhecido", phone: "" },
      cats: p.cats,
      state: p.state,
      img: p.img,
      desc: p.desc,
      shipping: p.shipping,
      status: p.status
    };
  });

  initShopDropdown();
  render();
}

function checkSharedLink() {
  const params = new URLSearchParams(window.location.search);
  const handle = params.get("shop");
  if (!handle) return;

  state.shop = handle;
  
  const store = STORES_LIST.find(s => s.handle.toLowerCase() === handle.toLowerCase());
  if (store) {
    shopBannerTitle.textContent = `Navegando no acervo de ${store.name}`;
    shopBannerHandle.textContent = store.handle;
    
    const logoWrapper = document.getElementById("shop-banner-logo-wrapper");
    if (logoWrapper) {
      if (store.logo_url) {
        logoWrapper.innerHTML = `<img src="${store.logo_url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        logoWrapper.innerHTML = `<span style="font-family: var(--font-serif); font-weight: 700; color: var(--color-primary); font-size: 1.1rem; text-transform: uppercase;">${store.name.charAt(0)}</span>`;
      }
    }

    shopBanner.style.display = "block";
    document.getElementById("filters-section").style.display = "none";
  }
}

function initShopDropdown() {
  const dict = TRANSLATIONS[state.country];
  let html = `
    <button class="shop-item selected" data-shop="all">
      <div class="shop-avatar">A</div>
      <div class="shop-item-info">
        <span class="shop-item-name">${dict["filter-shop-label"]}</span>
        <span class="shop-item-handle">${state.country === "BR" ? "Todos os acervos" : "All collections"}</span>
      </div>
    </button>
  `;

  const added = new Set();
  ITEMS.forEach(item => {
    const s = item.store;
    if (s && s.handle && !added.has(s.handle)) {
      const fullStore = STORES_LIST.find(st => st.id === s.id);
      const storeCountry = fullStore ? fullStore.country : "BR";
      if (storeCountry !== state.country) return;

      added.add(s.handle);
      
      const logoUrl = fullStore ? fullStore.logo_url : null;
      const avatarHtml = logoUrl 
        ? `<img src="${logoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
        : s.name.charAt(0).toUpperCase();

      html += `
        <button class="shop-item" data-shop="${s.handle}">
          <div class="shop-avatar">${avatarHtml}</div>
          <div class="shop-item-info">
            <span class="shop-item-name">${s.name}</span>
            <span class="shop-item-handle">${s.handle}</span>
          </div>
        </button>
      `;
    }
  });

  shopMenu.innerHTML = html;
}

function getWaLink(item) {
  const isBR = state.country === "BR";
  const currency = isBR ? "R$" : "$";
  const msg = isBR 
    ? `Olá! Vi a peça *${item.name}* no valor de *${currency}${item.price}* na Trove e quero ficar com ela!`
    : `Hello! I saw the item *${item.name}* priced at *${currency}${item.price}* on Trove and I want to secure it!`;
  return `https://wa.me/${item.store.phone}?text=${encodeURIComponent(msg)}`;
}

function render() {
  const filtered = ITEMS.filter(item => {
    const fullStore = STORES_LIST.find(st => st.id === item.store.id);
    const storeCountry = fullStore ? fullStore.country : "BR";
    const matchCountry = storeCountry === state.country;

    const matchCat = state.cat === "all" || item.cats.includes(state.cat);
    const matchShop = state.shop === "all" || item.store.handle === state.shop;
    const matchLoc = state.loc === "all" || item.state === state.loc;
    
    const query = state.q.toLowerCase().trim();
    const matchQ = query === "" ||
      item.name.toLowerCase().includes(query) ||
      item.store.name.toLowerCase().includes(query) ||
      item.store.handle.toLowerCase().includes(query) ||
      item.cats.some(c => c.toLowerCase().includes(query));

    return matchCountry && matchCat && matchShop && matchLoc && matchQ;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.style.display = "none";
    empty.style.display = "flex";
  } else {
    grid.style.display = "grid";
    empty.style.display = "none";

    filtered.forEach(item => {
      const isSold = item.status === "vendido";
      const dict = TRANSLATIONS[state.country];
      const card = document.createElement("article");
      card.className = "product-card";
      card.style.opacity = isSold ? "0.6" : "1";
      card.innerHTML = `
        <div class="card-img-wrapper">
          <span class="card-badge">${isSold ? dict["sold"] : dict["unique-piece"]}</span>
          <img class="card-img" src="${item.img}" alt="${item.name}" loading="lazy">
        </div>
        <div class="card-info">
          <span class="card-shop">${item.store.handle}</span>
          <h2 class="card-title">${item.name}</h2>
          <div class="card-meta-row">
            <span class="card-size">${dict["size-label"]}${item.size}</span>
            <span class="card-price">${state.country === "BR" ? "R$ " : "$ "}${item.price}</span>
          </div>
        </div>
        <button class="wa-button" data-id="${item.id}" ${isSold ? "disabled style='background-color:var(--color-border);color:var(--color-text-secondary);'" : ""} aria-label="Comprar ${item.name} no WhatsApp">
          <svg class="btn-wa-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          ${isSold ? dict["unavailable"] : dict["secure-wa"]}
        </button>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".wa-button")) {
          e.stopPropagation();
          if (isSold) return;
          const link = getWaLink(item);
          window.open(link, "_blank", "noopener,noreferrer");
          return;
        }
        openDrawer(item);
      });

      grid.appendChild(card);
    });
  }
}

function openDrawer(item) {
  const link = getWaLink(item);
  const isSold = item.status === "vendido";
  
  const dict = TRANSLATIONS[state.country];
  const isBR = state.country === "BR";
  const currency = isBR ? "R$" : "$";
  const stateLabelText = isBR ? (BR_STATES[item.state] || item.state) : (US_STATES[item.state] || item.state);

  drawerBody.innerHTML = `
    <div class="drawer-img-wrapper">
      <span class="drawer-badge">${isSold ? dict["sold"] : dict["unique-piece"]}</span>
      <img class="drawer-img" src="${item.img}" alt="${item.name}">
    </div>
    <div class="drawer-info">
      <span class="drawer-shop">${item.store.handle}</span>
      <h1 class="drawer-title">${item.name}</h1>
      
      <div class="drawer-meta-grid">
        <div class="drawer-meta-item">
          <span class="drawer-meta-label">${dict["drawer-size"]}</span>
          <span class="drawer-meta-val">${item.size}</span>
        </div>
        <div class="drawer-meta-item">
          <span class="drawer-meta-label">${dict["drawer-price"]}</span>
          <span class="drawer-meta-val">${currency} ${item.price}</span>
        </div>
      </div>

      <div class="drawer-meta-grid" style="border-bottom:none; margin-bottom:12px; padding-bottom:0;">
        <div class="drawer-meta-item">
          <span class="drawer-meta-label">${dict["drawer-shipping"]}</span>
          <span class="drawer-meta-val" style="font-size:0.95rem;">${item.shipping || (isBR ? "Nacional" : "National")}</span>
        </div>
        <div class="drawer-meta-item">
          <span class="drawer-meta-label">${dict["drawer-loc"]}</span>
          <span class="drawer-meta-val" style="font-size:0.95rem;">${stateLabelText} (${item.state})</span>
        </div>
      </div>

      <h2 class="drawer-desc-title">${dict["drawer-about"]}</h2>
      <p class="drawer-desc-text">${item.desc || dict["drawer-no-desc"]}</p>
    </div>
    <div class="drawer-cta-wrapper">
      <a href="${isSold ? '#' : link}" target="${isSold ? '_self' : '_blank'}" rel="noopener noreferrer" class="drawer-cta-btn" ${isSold ? "style='background-color:var(--color-border);color:var(--color-text-secondary);pointer-events:none;'" : ""}>
        <svg class="btn-wa-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        ${isSold ? dict["unavailable"] : dict["secure-wa"]}
      </a>
    </div>
  `;

  drawer.classList.add("active");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawer.classList.remove("active");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

async function checkSession() {
  const { data: { user } } = await client.auth.getUser();
  if (user) {
    sellerState.user = user;
    await fetchSellerStoreOnLoad();
  } else {
    updateHeader();
  }
}

async function fetchSellerStoreOnLoad() {
  const { data: stores } = await client
    .from("trove_stores")
    .select("*")
    .eq("owner_id", sellerState.user.id);

  if (stores && stores.length > 0) {
    sellerState.store = stores[0];
  }
  updateHeader();
}

async function fetchSellerStoreAfterLogin() {
  const { data: stores, error } = await client
    .from("trove_stores")
    .select("*")
    .eq("owner_id", sellerState.user.id);

  if (error) return;

  if (stores && stores.length > 0) {
    sellerState.store = stores[0];
    updateHeader();
    window.location.href = "dashboard.html";
  } else {
    showView("create-store");
  }
}

function showView(viewName) {
  loginView.style.display = "none";
  signupView.style.display = "none";
  emailConfirmView.style.display = "none";
  createStoreView.style.display = "none";

  sellerModalCard.classList.remove("mode-register");

  if (viewName === "login") {
    loginView.style.display = "flex";
  } else if (viewName === "signup") {
    signupView.style.display = "flex";
    sellerModalCard.classList.add("mode-register");
  } else if (viewName === "email-confirm") {
    emailConfirmView.style.display = "flex";
    sellerModalCard.classList.add("mode-register");
  } else if (viewName === "create-store") {
    createStoreView.style.display = "flex";
  }
}

function updateHeader() {
  if (sellerState.user) {
    advTrigger.style.display = "none";
    profileBtn.style.display = "flex";
    if (sellerState.store && sellerState.store.logo_url) {
      profileBtn.innerHTML = `<img src="${sellerState.store.logo_url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
      const letter = sellerState.store ? sellerState.store.name.charAt(0).toUpperCase() : "V";
      profileBtn.innerHTML = `<span id="profile-avatar-letter">${letter}</span>`;
    }
  } else {
    advTrigger.style.display = "block";
    profileBtn.style.display = "none";
  }
}

function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

function updatePasswordCriteria(password) {
  const lenCrit = document.getElementById("crit-length");
  const upperCrit = document.getElementById("crit-upper");
  const numCrit = document.getElementById("crit-number");

  const hasLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /\d/.test(password);

  toggleCritState(lenCrit, hasLen);
  toggleCritState(upperCrit, hasUpper);
  toggleCritState(numCrit, hasNum);
}

function toggleCritState(el, met) {
  if (!el) return;
  const icon = el.querySelector(".crit-icon");
  if (met) {
    el.style.color = "var(--color-primary)";
    if (icon) {
      icon.textContent = "✔";
      icon.style.color = "var(--color-primary)";
    }
  } else {
    el.style.color = "var(--color-text-secondary)";
    if (icon) {
      icon.textContent = "○";
      icon.style.color = "var(--color-text-secondary)";
    }
  }
}

function startResendCountdown(email) {
  const btn = document.getElementById("resend-email-btn");
  const countSpan = document.getElementById("resend-countdown");
  if (!btn || !countSpan) return;

  btn.disabled = true;
  btn.style.backgroundColor = "var(--color-border)";
  btn.style.color = "var(--color-text-secondary)";
  
  resendSeconds = 60;
  countSpan.textContent = resendSeconds;

  if (resendTimer) clearInterval(resendTimer);

  resendTimer = setInterval(() => {
    resendSeconds--;
    countSpan.textContent = resendSeconds;
    
    if (resendSeconds <= 0) {
      clearInterval(resendTimer);
      btn.disabled = false;
      btn.textContent = "Reenviar e-mail";
      btn.style.backgroundColor = "var(--color-primary)";
      btn.style.color = "#FFFFFF";
      btn.style.cursor = "pointer";
    }
  }, 1000);

  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = "Enviando...";
    btn.style.backgroundColor = "var(--color-border)";
    btn.style.color = "var(--color-text-secondary)";
    
    const { error } = await client.auth.resend({
      type: 'signup',
      email: email
    });
    
    if (error) {
      showToast("Erro ao reenviar: " + error.message, "error");
      btn.disabled = false;
      btn.textContent = "Reenviar e-mail";
      btn.style.backgroundColor = "var(--color-primary)";
      btn.style.color = "#FFFFFF";
    } else {
      showToast("E-mail de confirmação reenviado!", "success");
      startResendCountdown(email);
    }
  };
}

function bindEvents() {
  search.addEventListener("input", (e) => {
    state.q = e.target.value;
    clearSearch.style.display = state.q.length > 0 ? "flex" : "none";
    render();
  });

  clearSearch.addEventListener("click", () => {
    search.value = "";
    state.q = "";
    clearSearch.style.display = "none";
    search.focus();
    render();
  });

  shopFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = shopMenu.classList.toggle("show");
    shopFilter.classList.toggle("active", open);
    shopFilterBtn.setAttribute("aria-expanded", open);
    
    catsMenu.classList.remove("show");
    catsFilter.classList.remove("active");
    catsFilterBtn.setAttribute("aria-expanded", "false");
    
    stateMenu.classList.remove("show");
    stateFilter.classList.remove("active");
    stateFilterBtn.setAttribute("aria-expanded", "false");
  });

  shopMenu.addEventListener("click", (e) => {
    const btn = e.target.closest(".shop-item");
    if (!btn) return;

    document.querySelectorAll(".shop-item").forEach(i => i.classList.remove("selected"));
    btn.classList.add("selected");

    state.shop = btn.dataset.shop;
    shopLabel.textContent = btn.querySelector(".shop-item-name").textContent;
    
    shopMenu.classList.remove("show");
    shopFilter.classList.remove("active");
    shopFilterBtn.setAttribute("aria-expanded", "false");

    render();
  });

  catsFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = catsMenu.classList.toggle("show");
    catsFilter.classList.toggle("active", open);
    catsFilterBtn.setAttribute("aria-expanded", open);
    
    shopMenu.classList.remove("show");
    shopFilter.classList.remove("active");
    shopFilterBtn.setAttribute("aria-expanded", "false");
    
    stateMenu.classList.remove("show");
    stateFilter.classList.remove("active");
    stateFilterBtn.setAttribute("aria-expanded", "false");
  });

  catsMenu.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-item");
    if (!btn) return;

    document.querySelectorAll(".cat-item").forEach(i => i.classList.remove("selected"));
    btn.classList.add("selected");

    state.cat = btn.dataset.category;
    catsLabel.textContent = btn.textContent;
    
    catsMenu.classList.remove("show");
    catsFilter.classList.remove("active");
    catsFilterBtn.setAttribute("aria-expanded", "false");

    render();
  });

  stateFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = stateMenu.classList.toggle("show");
    stateFilter.classList.toggle("active", open);
    stateFilterBtn.setAttribute("aria-expanded", open);
    
    shopMenu.classList.remove("show");
    shopFilter.classList.remove("active");
    shopFilterBtn.setAttribute("aria-expanded", "false");
    
    catsMenu.classList.remove("show");
    catsFilter.classList.remove("active");
    catsFilterBtn.setAttribute("aria-expanded", "false");
  });

  stateMenu.addEventListener("click", (e) => {
    const btn = e.target.closest(".state-item");
    if (!btn) return;

    document.querySelectorAll(".state-item").forEach(i => i.classList.remove("selected"));
    btn.classList.add("selected");

    state.loc = btn.dataset.state;
    stateLabel.textContent = btn.textContent;
    
    stateMenu.classList.remove("show");
    stateFilter.classList.remove("active");
    stateFilterBtn.setAttribute("aria-expanded", "false");

    render();
  });

  const countryTriggerBtn = document.getElementById("country-trigger-btn");
  const countryMenu = document.getElementById("country-dropdown-menu");
  
  countryTriggerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = countryMenu.style.display === "block";
    countryMenu.style.display = open ? "none" : "block";
    countryTriggerBtn.setAttribute("aria-expanded", !open);
    
    shopMenu.classList.remove("show");
    shopFilter.classList.remove("active");
    shopFilterBtn.setAttribute("aria-expanded", "false");
    catsMenu.classList.remove("show");
    catsFilter.classList.remove("active");
    catsFilterBtn.setAttribute("aria-expanded", "false");
    stateMenu.classList.remove("show");
    stateFilter.classList.remove("active");
    stateFilterBtn.setAttribute("aria-expanded", "false");
  });

  countryMenu.addEventListener("click", (e) => {
    const btn = e.target.closest(".country-opt");
    if (!btn) return;
    
    const newCountry = btn.dataset.country;
    if (newCountry === state.country) {
      countryMenu.style.display = "none";
      return;
    }
    
    state.country = newCountry;
    
    // Update URL query parameter
    window.history.pushState(null, "", `?country=${newCountry}`);
    
    // Translate the entire page dynamically
    translatePage(newCountry);
    
    countryMenu.querySelectorAll(".country-opt").forEach(opt => {
      opt.classList.toggle("selected", opt.dataset.country === newCountry);
    });
    
    countryMenu.style.display = "none";
    
    // Hide translation prompt card since user explicitly selected their country
    const translationCard = document.getElementById("translation-prompt-card");
    if (translationCard) translationCard.style.display = "none";
    
    updateRegionsDropdown();
    initShopDropdown();
    reset();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#country-switcher")) {
      countryMenu.style.display = "none";
      countryTriggerBtn.setAttribute("aria-expanded", "false");
    }
    if (!e.target.closest("#shop-filter")) {
      shopMenu.classList.remove("show");
      shopFilter.classList.remove("active");
      shopFilterBtn.setAttribute("aria-expanded", "false");
    }
    if (!e.target.closest("#cats-filter")) {
      catsMenu.classList.remove("show");
      catsFilter.classList.remove("active");
      catsFilterBtn.setAttribute("aria-expanded", "false");
    }
    if (!e.target.closest("#state-filter")) {
      stateMenu.classList.remove("show");
      stateFilter.classList.remove("active");
      stateFilterBtn.setAttribute("aria-expanded", "false");
    }
  });

  resetBtn.addEventListener("click", reset);
  logo.addEventListener("click", (e) => {
    e.preventDefault();
    reset();
  });

  drawerClose.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) closeDrawer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      sellerModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  advTrigger.addEventListener("click", () => {
    showView("login");
    sellerModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  profileBtn.addEventListener("click", () => {
    if (sellerState.user) {
      window.location.href = "dashboard.html";
    }
  });

  sellerClose.addEventListener("click", () => {
    sellerModal.classList.remove("active");
    document.body.style.overflow = "";
  });

  sellerModal.addEventListener("click", (e) => {
    if (e.target === sellerModal) {
      sellerModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  document.getElementById("go-to-signup-btn").addEventListener("click", (e) => {
    e.preventDefault();
    showView("signup");
  });

  document.getElementById("go-to-login-btn").addEventListener("click", (e) => {
    e.preventDefault();
    showView("login");
  });

  emailConfirmOkBtn.addEventListener("click", () => {
    sellerModal.classList.remove("active");
    document.body.style.overflow = "";
    signupForm.reset();
    loginForm.reset();
  });

  signupPass.addEventListener("input", () => {
    const val = signupPass.value;
    updatePasswordCriteria(val);

    if (!val) {
      strengthBar.style.width = "0%";
      strengthText.textContent = "Força: -";
      return;
    }

    const score = checkPasswordStrength(val);
    let color = "#D32F2F";
    let text = "Fraca";
    let width = "33%";

    if (score >= 3 && score <= 4) {
      color = "#FBC02D";
      text = "Média";
      width = "66%";
    } else if (score >= 5) {
      color = "#388E3C";
      text = "Forte";
      width = "100%";
    }

    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `Força: ${text}`;
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const btn = document.getElementById("login-submit-btn");
    const dict = TRANSLATIONS[state.country];

    btn.disabled = true;
    btn.textContent = state.country === "BR" ? "Entrando..." : "Logging in...";

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(dict["toast-error-login"] + error.message, "error");
      } else {
        showToast(dict["toast-success-login"], "success");
        sellerState.user = data.user;
        await fetchSellerStoreAfterLogin();
      }
    } catch (err) {
      showToast((state.country === "BR" ? "Erro inesperado: " : "Unexpected error: ") + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = dict["login-btn"];
    }
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = signupPass.value;
    const btn = document.getElementById("signup-submit-btn");
    const dict = TRANSLATIONS[state.country];

    btn.disabled = true;
    btn.textContent = state.country === "BR" ? "Registrando..." : "Registering...";

    try {
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) {
        showToast(dict["toast-error-signup"] + error.message, "error");
      } else {
        if (data.session) {
          showToast(dict["toast-success-signup"], "success");
          sellerState.user = data.user;
          showView("create-store");
        } else {
          showToast(dict["toast-success-signup-confirm"], "success");
          document.getElementById("confirm-email-address").textContent = email;
          showView("email-confirm");
          startResendCountdown(email);
        }
      }
    } catch (err) {
      showToast((state.country === "BR" ? "Erro inesperado: " : "Unexpected error: ") + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = dict["signup-btn"];
    }
  });

  createStoreForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("store-name").value;
    const handle = document.getElementById("store-handle").value.trim();
    const phone = document.getElementById("store-phone").value.replace(/\D/g, "");
    const country = document.getElementById("store-country").value;

    const submitBtn = createStoreForm.querySelector("button[type='submit']");
    const dict = TRANSLATIONS[state.country];
    submitBtn.disabled = true;
    submitBtn.textContent = state.country === "BR" ? "Criando..." : "Creating...";

    const formattedHandle = handle.startsWith("@") ? handle : "@" + handle;

    try {
      const { data, error } = await client
        .from("trove_stores")
        .insert([{ name, handle: formattedHandle, phone, country, owner_id: sellerState.user.id }])
        .select();

      if (error) {
        showToast(dict["toast-error-store"] + error.message, "error");
      } else {
        showToast(dict["toast-success-store"], "success");
        sellerState.store = data[0];
        window.location.href = "dashboard.html";
      }
    } catch (err) {
      showToast((state.country === "BR" ? "Erro inesperado: " : "Unexpected error: ") + err.message, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = dict["create-btn"];
    }
  });

  shopBannerClear.addEventListener("click", () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    shopBanner.style.display = "none";
    document.getElementById("filters-section").style.display = "block";
    reset();
  });
}

function reset() {
  state.cat = "all";
  state.shop = "all";
  state.loc = "all";
  state.q = "";
  
  const dict = TRANSLATIONS[state.country];
  
  search.value = "";
  clearSearch.style.display = "none";
  shopLabel.textContent = dict["filter-shop-label"];
  catsLabel.textContent = dict["filter-cat-label"];
  stateLabel.textContent = dict["filter-loc-label"];

  document.querySelectorAll(".shop-item").forEach(i => {
    i.classList.toggle("selected", i.dataset.shop === "all");
  });
  
  document.querySelectorAll(".cat-item").forEach(c => {
    c.classList.toggle("selected", c.dataset.category === "all");
  });

  document.querySelectorAll(".state-item").forEach(s => {
    s.classList.toggle("selected", s.dataset.state === "all");
  });
  
  render();
}

function showToast(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateRegionsDropdown() {
  const stateMenu = document.getElementById("state-dropdown-menu");
  const stateLabel = document.getElementById("active-state-label");
  if (!stateMenu || !stateLabel) return;

  const isBR = state.country === "BR";
  const dict = TRANSLATIONS[state.country];
  const statesDict = isBR ? BR_STATES : US_STATES;

  // Extract unique states for the current country from the items loaded
  const activeStates = new Set();
  ITEMS.forEach(item => {
    const fullStore = STORES_LIST.find(st => st.id === item.store.id);
    const storeCountry = fullStore ? fullStore.country : "BR";
    if (storeCountry === state.country && item.state) {
      activeStates.add(item.state.toUpperCase());
    }
  });

  const stateList = Array.from(activeStates).sort();

  if (state.loc === "all") {
    stateLabel.textContent = dict["filter-loc-label"];
  } else {
    const stateName = statesDict[state.loc] || state.loc;
    stateLabel.textContent = `${stateName} (${state.loc})`;
  }

  let html = `
    <button class="state-item ${state.loc === "all" ? "selected" : ""}" data-state="all">${dict["loc-all"]}</button>
  `;

  stateList.forEach(stCode => {
    const stateName = statesDict[stCode] || stCode;
    html += `
      <button class="state-item ${state.loc === stCode ? "selected" : ""}" data-state="${stCode}">
        ${stateName} (${stCode})
      </button>
    `;
  });

  stateMenu.innerHTML = html;
}
