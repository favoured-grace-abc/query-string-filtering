// ── DOM references ──
const grid       = document.getElementById("pokemon-grid");
const loading    = document.getElementById("loading");
const errorMsg   = document.getElementById("error-msg");
const pagination = document.getElementById("pagination");
const prevBtn    = document.getElementById("prev-btn");
const nextBtn    = document.getElementById("next-btn");
const pageInfo   = document.getElementById("page-info");

const modal          = document.getElementById("pokemon-modal");
const modalClose     = document.getElementById("modal-close");
const modalLink      = document.getElementById("modal-open-link");
const modalSprite    = document.getElementById("modal-sprite");
const modalName      = document.getElementById("modal-name");
const modalHeight    = document.getElementById("modal-height");
const modalWeight    = document.getElementById("modal-weight");
const modalAbilities = document.getElementById("modal-abilities");

// ── State ──
const LIMIT = 20;
let offset  = 0;
let total   = 0;

// ── Initialise ──
fetchList();

// ── Fetch Pokemon list ──
async function fetchList() {
  showLoading(true);
  clearError();

  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
    );

    if (!res.ok) throw new Error(`Failed to load list (${res.status})`);

    const data = await res.json();
    total = data.count;

    renderGrid(data.results);
    updatePagination();

  } catch (err) {
    showError("Could not load Pokemon list. Please check your connection.");
    console.error("[fetchList]", err.message);
  } finally {
    showLoading(false);
  }
}

// ── Render the grid of cards ──
function renderGrid(pokemonList) {
  grid.innerHTML = "";

  pokemonList.forEach(pokemon => {
    // Extract ID from the URL — no second API call needed
    const id     = pokemon.url.split("/").filter(Boolean).at(-1);
    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const card = document.createElement("div");
    card.className = [
      "bg-white rounded-xl p-4 text-center shadow-sm",
      "border border-gray-100 cursor-pointer",
      "hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    ].join(" ");

    // Use textContent for the name — never innerHTML with API data
    const img = document.createElement("img");
    img.src   = sprite;
    img.alt   = pokemon.name;
    img.className = "w-20 h-20 mx-auto";

    const name = document.createElement("p");
    name.textContent = pokemon.name;
    name.className = "mt-2 text-sm font-semibold capitalize text-gray-800";

    const num = document.createElement("p");
    num.textContent = `#${id}`;
    num.className = "text-xs text-gray-400";

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(num);

    // Clicking a card opens the modal with this Pokemon's data
    card.addEventListener("click", () => openModal(pokemon.name));

    grid.appendChild(card);
  });

  grid.classList.remove("hidden");
}

// ── Pagination controls ──
function updatePagination() {
  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages  = Math.ceil(total / LIMIT);

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = offset === 0;
  nextBtn.disabled = offset + LIMIT >= total;

  pagination.classList.remove("hidden");
}

prevBtn.addEventListener("click", () => {
  offset = Math.max(0, offset - LIMIT);
  fetchList();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

nextBtn.addEventListener("click", () => {
  offset += LIMIT;
  fetchList();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── Modal: fetch detail and populate ──
async function openModal(name) {
  // Reset content while loading
  modalSprite.src      = "";
  modalSprite.alt      = "";
  modalName.textContent   = "Loading...";
  modalHeight.textContent = "—";
  modalWeight.textContent = "—";
  modalAbilities.innerHTML = "";

  // Open the dialog immediately — user sees it loading
  modal.showModal();

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!res.ok) throw new Error("Not found");

    const data = await res.json();

    modalSprite.src         = data.sprites.front_default;
    modalSprite.alt         = data.name;
    modalName.textContent   = data.name;
    modalHeight.textContent = `${data.height / 10} m`;
    modalWeight.textContent = `${data.weight / 10} kg`;

    // data.abilities = [{ ability: { name: "static" }, is_hidden: false }, ...]
    data.abilities.forEach(item => {
      const tag = document.createElement("li");
      tag.textContent = item.ability.name;
      tag.className = "bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full capitalize";
      modalAbilities.appendChild(tag);
    });

    // Set the "Open Full Page" link — passes name as a URL parameter
    modalLink.href = `pokemon.html?name=${data.name}`;

  } catch (err) {
    modalName.textContent = "Error loading data";
    console.error("[openModal]", err.message);
  }
}

// ── Modal: close ──
modalClose.addEventListener("click", () => modal.close());

// Close when clicking the backdrop (outside the dialog box)
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

// ── UI helpers ──
function showLoading(state) {
  loading.classList.toggle("hidden", !state);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
}

function clearError() {
  errorMsg.textContent = "";
  errorMsg.classList.add("hidden");
}