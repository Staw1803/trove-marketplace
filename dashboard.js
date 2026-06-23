const SUPABASE_URL = "https://prcfmhrccfowsykkysld.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2ZtaHJjY2Zvd3N5a2t5c2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzIzNDEsImV4cCI6MjA4ODc0ODM0MX0.60vyMR7wLT8_wYcTqZEb5wzxznIhnwmNLi8cuJ787OQ";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const state = {
  user: null,
  store: null,
  items: [],
  logoFile: null,
  prodFile: null,
  editingItem: null
};

// UI Elements
const shopNameTitle = document.getElementById("shop-name-title");
const shopHandleSubtitle = document.getElementById("shop-handle-subtitle");
const shopLogoDisplay = document.getElementById("shop-logo-display");
const shopLogoLetter = document.getElementById("shop-logo-letter");
const copyLinkBtn = document.getElementById("copy-shop-link-btn");
const headerLogoutBtn = document.getElementById("header-logout-btn");

// Store Settings Elements
const storeForm = document.getElementById("store-settings-form");
const logoInput = document.getElementById("logo-file-input");
const logoPreviewBox = document.getElementById("logo-preview-box");
const logoPlaceholder = document.getElementById("logo-preview-placeholder");
const settingsName = document.getElementById("settings-name");
const settingsHandle = document.getElementById("settings-handle");
const settingsPhone = document.getElementById("settings-phone");
const saveSettingsBtn = document.getElementById("save-settings-btn");

// Product Publisher Elements
const publisherForm = document.getElementById("product-publisher-form");
const publisherTitle = document.getElementById("publisher-title");
const itemIdInput = document.getElementById("publisher-item-id");
const prodFileInput = document.getElementById("prod-file-input");
const prodPreviewBox = document.getElementById("prod-preview-box");
const prodPreviewImg = document.getElementById("prod-preview-img");
const prodUploadPrompt = document.getElementById("prod-upload-prompt");
const removeProdPreviewBtn = document.getElementById("remove-prod-preview-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const publishBtn = document.getElementById("publish-btn");

const inventoryListContainer = document.getElementById("inventory-list-container");

document.addEventListener("DOMContentLoaded", async () => {
  const isAuth = await checkSession();
  if (isAuth) {
    bindEvents();
  }
});

async function checkSession() {
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    window.location.href = "index.html";
    return false;
  }
  state.user = user;
  
  // Fetch store profile
  const { data: stores, error } = await client
    .from("trove_stores")
    .select("*")
    .eq("owner_id", user.id);

  if (error || !stores || stores.length === 0) {
    // If authenticated but has no store profile, redirect to main page to complete signup flow
    window.location.href = "index.html";
    return false;
  }

  state.store = stores[0];
  populateStoreSettings();
  await loadInventory();
  return true;
}

function populateStoreSettings() {
  shopNameTitle.textContent = state.store.name;
  shopHandleSubtitle.textContent = state.store.handle;
  settingsName.value = state.store.name;
  settingsHandle.value = state.store.handle;
  settingsPhone.value = state.store.phone;
  document.getElementById("settings-country").value = state.store.country || "BR";

  const itemStateSelect = document.getElementById("item-state");
  if (state.store.country === "US") {
    itemStateSelect.innerHTML = `
      <option value="NY">New York (NY)</option>
      <option value="CA">California (CA)</option>
      <option value="FL">Florida (FL)</option>
      <option value="TX">Texas (TX)</option>
    `;
  } else {
    itemStateSelect.innerHTML = `
      <option value="AM">Amazonas (AM)</option>
      <option value="SP">São Paulo (SP)</option>
      <option value="RJ">Rio de Janeiro (RJ)</option>
      <option value="PR">Paraná (PR)</option>
    `;
  }

  updateLogoUI();
}

function updateLogoUI() {
  if (state.store.logo_url) {
    logoPreviewBox.style.backgroundImage = `url('${state.store.logo_url}')`;
    logoPreviewBox.style.backgroundSize = "cover";
    logoPreviewBox.style.backgroundPosition = "center";
    logoPlaceholder.style.display = "none";
    
    // Header Avatar
    shopLogoDisplay.innerHTML = `<img src="${state.store.logo_url}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
  } else {
    logoPreviewBox.style.backgroundImage = "none";
    logoPlaceholder.style.display = "block";
    const letter = state.store.name.charAt(0).toUpperCase();
    logoPlaceholder.textContent = letter;
    shopLogoDisplay.innerHTML = `<span id="shop-logo-letter">${letter}</span>`;
  }
}

async function loadInventory() {
  inventoryListContainer.innerHTML = "<p style='text-align: center; color: var(--color-text-secondary); margin-top: 40px;'>Carregando acervo...</p>";
  
  const { data: prods, error } = await client
    .from("trove_products")
    .select("*")
    .eq("store_id", state.store.id)
    .order("created_at", { ascending: false });

  if (error) {
    showToast("Erro ao carregar acervo: " + error.message, "error");
    return;
  }

  state.items = prods;
  renderInventory();
}

function renderInventory() {
  inventoryListContainer.innerHTML = "";
  if (state.items.length === 0) {
    inventoryListContainer.innerHTML = "<p style='font-size: 0.95rem; color: var(--color-text-secondary); text-align: center; margin-top:40px;'>Nenhuma peça publicada ainda. Use o formulário ao lado para cadastrar sua primeira peça!</p>";
    return;
  }

  state.items.forEach(item => {
    const isSold = item.status === "vendido";
    const card = document.createElement("div");
    card.className = `inventory-table-row ${isSold ? "sold-row" : ""}`;
    card.innerHTML = `
      <div class="inv-row-identity">
        <img class="inv-row-img" src="${item.img}" alt="${item.name}">
        <div class="inv-row-meta">
          <span class="inv-row-title">${item.name}</span>
          <span class="inv-row-details">Tam: ${item.size} | R$ ${item.price} | ${item.state}</span>
        </div>
      </div>
      <div class="inv-row-controls">
        <button class="status-toggle-badge ${isSold ? "sold" : "available"}" data-id="${item.id}" data-status="${item.status}">
          ${isSold ? "Vendido" : "Disponível"}
        </button>
        <button class="inv-action-edit-btn" data-id="${item.id}" aria-label="Editar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </button>
        <button class="inv-action-delete-btn" data-id="${item.id}" aria-label="Excluir">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `;
    inventoryListContainer.appendChild(card);
  });
}

async function uploadFile(bucket, path, file) {
  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (error) throw error;
  
  const { data: { publicUrl } } = client.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

function bindEvents() {
  const priceInput = document.getElementById("item-price");
  priceInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      e.target.value = "";
      return;
    }
    let num = (parseInt(value, 10) / 100).toFixed(2);
    e.target.value = num.replace(".", ",");
  });

  const sizeInput = document.getElementById("item-size");
  sizeInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  // Copy store link
  copyLinkBtn.addEventListener("click", () => {
    const link = window.location.origin + "/index.html?shop=" + encodeURIComponent(state.store.handle);
    navigator.clipboard.writeText(link)
      .then(() => showToast("Link do acervo copiado!", "success"))
      .catch(() => showToast("Erro ao copiar link automaticamente.", "error"));
  });

  // Logout
  headerLogoutBtn.addEventListener("click", async () => {
    await client.auth.signOut();
    window.location.href = "index.html";
  });

  // Logo Input preview
  logoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      state.logoFile = file;
      const reader = new FileReader();
      reader.onload = (ev) => {
        logoPreviewBox.style.backgroundImage = `url('${ev.target.result}')`;
        logoPreviewBox.style.backgroundSize = "cover";
        logoPreviewBox.style.backgroundPosition = "center";
        logoPlaceholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Logo form submit
  storeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    saveSettingsBtn.disabled = true;
    saveSettingsBtn.textContent = "Salvando...";

    const name = settingsName.value;
    const handle = settingsHandle.value.trim();
    const phone = settingsPhone.value.replace(/\D/g, "");
    const country = document.getElementById("settings-country").value;
    
    const formattedHandle = handle.startsWith("@") ? handle : "@" + handle;

    try {
      let logoUrl = state.store.logo_url;
      
      if (state.logoFile) {
        const fileExt = state.logoFile.name.split(".").pop();
        const path = `${state.store.id}/logo-${Date.now()}.${fileExt}`;
        logoUrl = await uploadFile("trove-images", path, state.logoFile);
      }

      const { data, error } = await client
        .from("trove_stores")
        .update({ name, handle: formattedHandle, phone, country, logo_url: logoUrl })
        .eq("id", state.store.id)
        .select();

      if (error) {
        showToast("Erro ao salvar configurações: " + error.message, "error");
      } else {
        state.store = data[0];
        state.logoFile = null;
        populateStoreSettings();
        showToast("Configurações do brechó atualizadas!", "success");
      }
    } catch (err) {
      showToast("Erro inesperado: " + err.message, "error");
    } finally {
      saveSettingsBtn.disabled = false;
      saveSettingsBtn.textContent = "Salvar Alterações";
    }
  });

  // Product Image Input Preview
  prodFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      state.prodFile = file;
      const reader = new FileReader();
      reader.onload = (ev) => {
        prodPreviewImg.src = ev.target.result;
        prodPreviewBox.style.display = "block";
        prodUploadPrompt.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Clear product preview
  removeProdPreviewBtn.addEventListener("click", () => {
    state.prodFile = null;
    prodFileInput.value = "";
    prodPreviewImg.src = "";
    prodPreviewBox.style.display = "none";
    prodUploadPrompt.style.display = "flex";
    if (!state.editingItem) {
      prodFileInput.required = true;
    }
  });

  // Product publish form submit
  publisherForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    publishBtn.disabled = true;
    publishBtn.textContent = "Publicando...";

    const name = document.getElementById("item-name").value;
    const price = document.getElementById("item-price").value;
    const size = document.getElementById("item-size").value;
    const stateVal = document.getElementById("item-state").value;
    const shipping = document.getElementById("item-shipping").value;
    const desc = document.getElementById("item-desc").value;
    
    const checkedCats = Array.from(document.querySelectorAll("input[name='item-cats']:checked")).map(el => el.value);

    try {
      let imageUrl = state.editingItem ? state.editingItem.img : "";
      
      if (state.prodFile) {
        const fileExt = state.prodFile.name.split(".").pop();
        const path = `${state.store.id}/prod-${Date.now()}.${fileExt}`;
        imageUrl = await uploadFile("trove-images", path, state.prodFile);
      }

      if (state.editingItem) {
        // Update product
        const { error } = await client
          .from("trove_products")
          .update({
            name,
            price,
            size,
            state: stateVal,
            shipping,
            img: imageUrl,
            desc,
            cats: checkedCats
          })
          .eq("id", state.editingItem.id);

        if (error) {
          showToast("Erro ao atualizar peça: " + error.message, "error");
        } else {
          showToast("Peça editada com sucesso!", "success");
          resetPublisherForm();
          await loadInventory();
        }
      } else {
        // Insert product
        if (!state.prodFile) {
          showToast("Por favor, selecione uma foto para a peça.", "error");
          publishBtn.disabled = false;
          publishBtn.textContent = "Publicar Peça";
          return;
        }

        const { error } = await client
          .from("trove_products")
          .insert([{
            name,
            price,
            size,
            state: stateVal,
            shipping,
            img: imageUrl,
            desc,
            cats: checkedCats,
            store_id: state.store.id,
            status: "disponivel"
          }]);

        if (error) {
          showToast("Erro ao publicar peça: " + error.message, "error");
        } else {
          showToast("Peça publicada com sucesso!", "success");
          resetPublisherForm();
          await loadInventory();
        }
      }
    } catch (err) {
      showToast("Erro inesperado: " + err.message, "error");
    } finally {
      publishBtn.disabled = false;
      publishBtn.textContent = state.editingItem ? "Atualizar Peça" : "Publicar Peça";
    }
  });

  cancelEditBtn.addEventListener("click", () => {
    resetPublisherForm();
  });

  // Inventory interactions (Status, Edit, Delete)
  inventoryListContainer.addEventListener("click", async (e) => {
    const statusBtn = e.target.closest(".status-toggle-badge");
    const editBtn = e.target.closest(".inv-action-edit-btn");
    const deleteBtn = e.target.closest(".inv-action-delete-btn");

    if (statusBtn) {
      const id = statusBtn.dataset.id;
      const curStatus = statusBtn.dataset.status;
      const nextStatus = curStatus === "disponivel" ? "vendido" : "disponivel";

      const { error } = await client
        .from("trove_products")
        .update({ status: nextStatus })
        .eq("id", id);

      if (error) {
        showToast("Erro ao atualizar status: " + error.message, "error");
      } else {
        showToast("Status atualizado!", "success");
        await loadInventory();
      }
    }

    if (editBtn) {
      const id = editBtn.dataset.id;
      const item = state.items.find(i => i.id === id);
      if (item) {
        setupEditMode(item);
      }
    }

    if (deleteBtn) {
      if (!confirm("Tem certeza que deseja excluir esta peça?")) return;
      const id = deleteBtn.dataset.id;

      const { error } = await client
        .from("trove_products")
        .delete()
        .eq("id", id);

      if (error) {
        showToast("Erro ao excluir: " + error.message, "error");
      } else {
        showToast("Peça removida com sucesso!", "success");
        if (state.editingItem && state.editingItem.id === id) {
          resetPublisherForm();
        }
        await loadInventory();
      }
    }
  });
}

function setupEditMode(item) {
  state.editingItem = item;
  
  publisherTitle.textContent = "Editar Peça";
  publishBtn.textContent = "Atualizar Peça";
  cancelEditBtn.style.display = "inline-block";

  document.getElementById("item-name").value = item.name;
  document.getElementById("item-price").value = item.price;
  document.getElementById("item-size").value = item.size;
  document.getElementById("item-state").value = item.state;
  document.getElementById("item-shipping").value = item.shipping || "Nacional";
  document.getElementById("item-desc").value = item.desc || "";

  // Reset checkboxes
  document.querySelectorAll("input[name='item-cats']").forEach(cb => {
    cb.checked = item.cats.includes(cb.value);
  });

  // Image preview
  prodPreviewImg.src = item.img;
  prodPreviewBox.style.display = "block";
  prodUploadPrompt.style.display = "none";
  prodFileInput.required = false;

  // Scroll to form
  document.getElementById("publisher-card").scrollIntoView({ behavior: "smooth" });
}

function resetPublisherForm() {
  state.editingItem = null;
  state.prodFile = null;
  
  publisherTitle.textContent = "Anunciar Nova Peça";
  publishBtn.textContent = "Publicar Peça";
  cancelEditBtn.style.display = "none";
  
  publisherForm.reset();
  prodFileInput.value = "";
  prodPreviewImg.src = "";
  prodPreviewBox.style.display = "none";
  prodUploadPrompt.style.display = "flex";
  prodFileInput.required = true;
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
