const SUPABASE_URL = "https://prcfmhrccfowsykkysld.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2ZtaHJjY2Zvd3N5a2t5c2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzIzNDEsImV4cCI6MjA4ODc0ODM0MX0.60vyMR7wLT8_wYcTqZEb5wzxznIhnwmNLi8cuJ787OQ";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let ITEMS = [];
let STORES_LIST = [];

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
  checkSharedLink();
  bindEvents();
  await checkSession();
});

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
  let html = `
    <button class="shop-item selected" data-shop="all">
      <div class="shop-avatar">A</div>
      <div class="shop-item-info">
        <span class="shop-item-name">Todas as Lojas</span>
        <span class="shop-item-handle">Todos os acervos</span>
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
  const msg = `Olá! Vi a peça *${item.name}* no valor de *R$${item.price}* na Trove e quero ficar com ela!`;
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
      const card = document.createElement("article");
      card.className = "product-card";
      card.style.opacity = isSold ? "0.6" : "1";
      card.innerHTML = `
        <div class="card-img-wrapper">
          <span class="card-badge">${isSold ? "Vendido" : "Peça Única"}</span>
          <img class="card-img" src="${item.img}" alt="${item.name}" loading="lazy">
        </div>
        <div class="card-info">
          <span class="card-shop">${item.store.handle}</span>
          <h2 class="card-title">${item.name}</h2>
          <div class="card-meta-row">
            <span class="card-size">Size: ${item.size}</span>
            <span class="card-price">R$ ${item.price}</span>
          </div>
        </div>
        <button class="wa-button" data-id="${item.id}" ${isSold ? "disabled style='background-color:var(--color-border);color:var(--color-text-secondary);'" : ""} aria-label="Comprar ${item.name} no WhatsApp">
          <svg class="btn-wa-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          ${isSold ? "Indisponível" : "Secure Piece (WhatsApp)"}
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
  
  drawerBody.innerHTML = `
    <div class="drawer-img-wrapper">
      <span class="drawer-badge">${isSold ? "Vendido" : "Peça Única"}</span>
      <img class="drawer-img" src="${item.img}" alt="${item.name}">
    </div>
    <div class="drawer-info">
      <span class="drawer-shop">${item.store.handle}</span>
      <h1 class="drawer-title">${item.name}</h1>
      
      <div class="drawer-meta-grid">
        <div class="drawer-meta-item">
          <span class="drawer-meta-label">Tamanho</span>
          <span class="drawer-meta-val">${item.size}</span>
        </div>
        <div class="drawer-meta-item">
          <span class="drawer-meta-label">Preço</span>
          <span class="drawer-meta-val">R$ ${item.price}</span>
        </div>
      </div>

      <div class="drawer-meta-grid" style="border-bottom:none; margin-bottom:12px; padding-bottom:0;">
        <div class="drawer-meta-item">
          <span class="drawer-meta-label">Envio</span>
          <span class="drawer-meta-val" style="font-size:0.95rem;">${item.shipping || "Nacional"}</span>
        </div>
        <div class="drawer-meta-item">
          <span class="drawer-meta-label">Local</span>
          <span class="drawer-meta-val" style="font-size:0.95rem;">${item.state}</span>
        </div>
      </div>

      <h2 class="drawer-desc-title">Sobre o Item</h2>
      <p class="drawer-desc-text">${item.desc || "Sem descrição disponível."}</p>
    </div>
    <div class="drawer-cta-wrapper">
      <a href="${isSold ? '#' : link}" target="${isSold ? '_self' : '_blank'}" rel="noopener noreferrer" class="drawer-cta-btn" ${isSold ? "style='background-color:var(--color-border);color:var(--color-text-secondary);pointer-events:none;'" : ""}>
        <svg class="btn-wa-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        ${isSold ? "Peça Indisponível" : "Comprar Peça (WhatsApp)"}
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
    
    document.getElementById("active-country-flag").textContent = newCountry === "BR" ? "🇧🇷" : "🇺🇸";
    document.getElementById("active-country-label").textContent = newCountry;
    
    countryMenu.querySelectorAll(".country-opt").forEach(opt => {
      opt.classList.toggle("selected", opt.dataset.country === newCountry);
    });
    
    countryMenu.style.display = "none";
    
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

    btn.disabled = true;
    btn.textContent = "Entrando...";

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        showToast("Erro ao entrar: " + error.message, "error");
      } else {
        showToast("Login efetuado com sucesso!", "success");
        sellerState.user = data.user;
        await fetchSellerStoreAfterLogin();
      }
    } catch (err) {
      showToast("Erro inesperado: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrar";
    }
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = signupPass.value;
    const btn = document.getElementById("signup-submit-btn");

    btn.disabled = true;
    btn.textContent = "Registrando...";

    try {
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) {
        showToast("Erro no cadastro: " + error.message, "error");
      } else {
        if (data.session) {
          showToast("Cadastro efetuado!", "success");
          sellerState.user = data.user;
          showView("create-store");
        } else {
          showToast("Cadastro efetuado! Confirme seu e-mail.", "success");
          document.getElementById("confirm-email-address").textContent = email;
          showView("email-confirm");
          startResendCountdown(email);
        }
      }
    } catch (err) {
      showToast("Erro inesperado: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Registrar Conta";
    }
  });

  createStoreForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("store-name").value;
    const handle = document.getElementById("store-handle").value.trim();
    const phone = document.getElementById("store-phone").value.replace(/\D/g, "");
    const country = document.getElementById("store-country").value;

    const submitBtn = createStoreForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Criando...";

    const formattedHandle = handle.startsWith("@") ? handle : "@" + handle;

    try {
      const { data, error } = await client
        .from("trove_stores")
        .insert([{ name, handle: formattedHandle, phone, country, owner_id: sellerState.user.id }])
        .select();

      if (error) {
        showToast("Erro ao cadastrar brechó: " + error.message, "error");
      } else {
        showToast("Brechó cadastrado com sucesso!", "success");
        sellerState.store = data[0];
        window.location.href = "dashboard.html";
      }
    } catch (err) {
      showToast("Erro inesperado: " + err.message, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Criar Meu Brechó";
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
  
  search.value = "";
  clearSearch.style.display = "none";
  shopLabel.textContent = "Todas as Lojas";
  catsLabel.textContent = "Todas as Categorias";
  stateLabel.textContent = "Todas as Regiões";

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

  state.loc = "all";
  
  if (state.country === "BR") {
    stateLabel.textContent = "Todas as Regiões";
    stateMenu.innerHTML = `
      <button class="state-item selected" data-state="all">Todas as Regiões</button>
      <button class="state-item" data-state="AM">Amazonas (AM)</button>
      <button class="state-item" data-state="SP">São Paulo (SP)</button>
      <button class="state-item" data-state="RJ">Rio de Janeiro (RJ)</button>
      <button class="state-item" data-state="PR">Paraná (PR)</button>
    `;
  } else {
    stateLabel.textContent = "All Regions";
    stateMenu.innerHTML = `
      <button class="state-item selected" data-state="all">All Regions</button>
      <button class="state-item" data-state="NY">New York (NY)</button>
      <button class="state-item" data-state="CA">California (CA)</button>
      <button class="state-item" data-state="FL">Florida (FL)</button>
      <button class="state-item" data-state="TX">Texas (TX)</button>
    `;
  }
}
