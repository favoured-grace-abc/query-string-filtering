// ── DOM references ──
const loading         = document.getElementById("loading");
const errorMsg        = document.getElementById("error-msg");
const detailCard      = document.getElementById("detail-card");
const detailSprite    = document.getElementById("detail-sprite");
const detailName      = document.getElementById("detail-name");
const detailId        = document.getElementById("detail-id");
const detailHeight    = document.getElementById("detail-height");
const detailWeight    = document.getElementById("detail-weight");
const detailAbilities = document.getElementById("detail-abilities");
const detailStats     = document.getElementById("detail-stats");

// ── Read the name from the URL ──
// URL looks like: pokemon.html?name=pikachu
const params = new URLSearchParams(window.location.search);
const rawName = params.get("name") || "";
const name    = rawName.toLowerCase();

if (!isValidName(name)) {
  showError("No valid Pokemon name provided. Go back and click a card.");
  showLoading(false);
} else {
  fetchPokemon(name);
}

// ── Validate the URL parameter ──
function isValidName(name) {
  return (
    typeof name === "string" &&
    name.length > 0 &&
    name.length <= 50 &&
    /^[a-z0-9-]+$/.test(name)
  );
}

// ── Fetch Pokemon detail ──
async function fetchPokemon(name) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if (!res.ok) throw new Error(`Pokemon "${name}" not found (${res.status})`);

    const data = await res.json();
    renderDetail(data);

  } catch (err) {
    showError("Could not load this Pokemon. Please go back and try again.");
    console.error("[fetchPokemon]", err.message);
  } finally {
    showLoading(false);
  }
}

// ── Render the full detail view ──
function renderDetail(data) {
  // Update the page title dynamically
  document.title = `${data.name} | PokéApp`;

  detailSprite.src      = data.sprites.front_default;
  detailSprite.alt      = data.name;
  detailName.textContent = data.name;
  detailId.textContent  = `#${data.id}`;
  detailHeight.textContent = `${data.height / 10} m`;
  detailWeight.textContent = `${data.weight / 10} kg`;

  // Abilities
  // data.abilities = [{ ability: { name: "static" }, is_hidden: false }, ...]
  data.abilities.forEach(item => {
    const tag = document.createElement("li");
    tag.textContent = item.ability.name;
    tag.className = "bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full capitalize";
    detailAbilities.appendChild(tag);
  });

  // Base stats with a visual bar
  // data.stats = [{ base_stat: 45, stat: { name: "hp" } }, ...]
  data.stats.forEach(item => {
    const statName  = item.stat.name;
    const statValue = item.base_stat;
    const percent   = Math.min(100, Math.round((statValue / 255) * 100));

    const li = document.createElement("li");
    li.className = "flex items-center gap-3 text-sm";

    const label = document.createElement("span");
    label.textContent = statName;
    label.className = "w-24 text-gray-500 capitalize shrink-0";

    const value = document.createElement("span");
    value.textContent = statValue;
    value.className = "w-10 text-right font-semibold text-gray-800";

    const track = document.createElement("div");
    track.className = "flex-1 bg-gray-100 rounded-full h-2";

    const fill = document.createElement("div");
    fill.className = "bg-blue-500 h-2 rounded-full";
    fill.style.width = `${percent}%`;

    track.appendChild(fill);
    li.appendChild(label);
    li.appendChild(value);
    li.appendChild(track);
    detailStats.appendChild(li);
  });

  detailCard.classList.remove("hidden");
}

// ── UI helpers ──
function showLoading(state) {
  loading.classList.toggle("hidden", !state);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
}