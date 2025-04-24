let todosLosPokemones = [];
let paginaActual = 1;
const pokemonesPorPagina = 50;

const tiposTraducidos = {
  normal: "Normal", fighting: "Lucha", flying: "Volador", poison: "Veneno",
  ground: "Tierra", rock: "Roca", bug: "Bicho", ghost: "Fantasma",
  steel: "Acero", fire: "Fuego", water: "Agua", grass: "Planta",
  electric: "Eléctrico", psychic: "Psíquico", ice: "Hielo",
  dragon: "Dragón", dark: "Siniestro", fairy: "Hada"
};

document.addEventListener('mousemove', parallaxEffect);
function parallaxEffect(event) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  const moveX = (mouseX - width / 2) / width * 20;
  const moveY = (mouseY - height / 2) / height * 20;
  document.body.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTodosLosPokemones();
  ["pokemonInput", "tipoFiltro", "alturaMin", "alturaMax", "pesoMin", "pesoMax"].forEach(id =>
    document.getElementById(id).addEventListener("input", () => {
      paginaActual = 1;
      filtrarYMostrar();
    })
  );
});

async function cargarTodosLosPokemones() {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`;
  const res = await fetch(url);
  const data = await res.json();

  const detalles = await Promise.all(
    data.results.map(poke => fetch(poke.url).then(r => r.json()))
  );

  todosLosPokemones = detalles;
  filtrarYMostrar();
}

function filtrarYMostrar() {
  const nombre = document.getElementById("pokemonInput").value.toLowerCase();
  const tipo = document.getElementById("tipoFiltro").value;
  const alturaMin = parseFloat(document.getElementById("alturaMin").value) || 0;
  const alturaMax = parseFloat(document.getElementById("alturaMax").value) || Infinity;
  const pesoMin = parseFloat(document.getElementById("pesoMin").value) || 0;
  const pesoMax = parseFloat(document.getElementById("pesoMax").value) || Infinity;

  const filtrados = todosLosPokemones.filter(pokemon => {
    const nombreOk = pokemon.name.includes(nombre);
    const tipoOk = tipo === "" || pokemon.types.some(t => t.type.name === tipo);
    const alturaOk = (pokemon.height / 10) >= alturaMin && (pokemon.height / 10) <= alturaMax;
    const pesoOk = (pokemon.weight / 10) >= pesoMin && (pokemon.weight / 10) <= pesoMax;
    return nombreOk && tipoOk && alturaOk && pesoOk;
  });

  mostrarPokemones(filtrados);
  crearPaginacion(filtrados.length);
}

function mostrarPokemones(lista) {
  const container = document.getElementById("pokemonInfo");
  container.innerHTML = "";

  const inicio = (paginaActual - 1) * pokemonesPorPagina;
  const fin = inicio + pokemonesPorPagina;
  const pokemonesPagina = lista.slice(inicio, fin);

  pokemonesPagina.forEach(pokemon => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const tipoPrincipal = pokemon.types[0].type.name;
    card.classList.add(`tipo-${tipoPrincipal}`);

    const tiposEspañol = pokemon.types.map(t => tiposTraducidos[t.type.name] || t.type.name).join(', ');
    const habilidades = pokemon.abilities.map(h => h.ability.name).join(', ');

    card.innerHTML = `
      <h3>${pokemon.name.toUpperCase()}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="pokemon-details">
        <p><strong>Tipo:</strong> ${tiposEspañol}</p>
        <p><strong>Altura:</strong> ${(pokemon.height / 10).toFixed(1)} m</p>
        <p><strong>Peso:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</p>
        <p><strong>Experiencia Base:</strong> ${pokemon.base_experience}</p>
        <p><strong>Habilidades:</strong> ${habilidades}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll('.pokemon-card.expandido').forEach(el => {
        if (el !== card) el.classList.remove("expandido");
      });
      card.classList.toggle("expandido");
    });

    container.appendChild(card);
  });
}

function crearPaginacion(totalFiltrados) {
  let paginacionContainer = document.getElementById("paginacion");
  if (!paginacionContainer) {
    paginacionContainer = document.createElement("div");
    paginacionContainer.id = "paginacion";
    paginacionContainer.style.marginTop = "20px";
    document.body.appendChild(paginacionContainer);
  }

  const totalPaginas = Math.ceil(totalFiltrados / pokemonesPorPagina);
  paginacionContainer.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === paginaActual) ? "activo" : "";
    btn.style.margin = "5px";
    btn.addEventListener("click", () => {
      paginaActual = i;
      filtrarYMostrar();
    });
    paginacionContainer.appendChild(btn);
  }
}

// Botón de música
const playBtn = document.getElementById('playMusicBtn');
const music = document.getElementById('bg-music');
playBtn.addEventListener('click', () => {
  music.play();
  playBtn.style.display = 'none';
});
