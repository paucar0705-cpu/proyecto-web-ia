// ===== Explorador de Rick and Morty =====
// Dirección de la API pública de donde salen los personajes
const API_URL = "https://rickandmortyapi.com/api/character";

// Traducciones para mostrar los datos de la API en español
const ESTADOS = { Alive: "Vivo", Dead: "Muerto", unknown: "Desconocido" };
const GENEROS = { Female: "Femenino", Male: "Masculino", Genderless: "Sin género", unknown: "Desconocido" };
const ESPECIES = {
  Human: "Humano", Alien: "Alienígena", Humanoid: "Humanoide", Robot: "Robot",
  Animal: "Animal", "Mythological Creature": "Criatura mitológica", Disease: "Enfermedad", unknown: "Desconocida"
};

// Referencias a los elementos del HTML
const formulario = document.getElementById("formulario-busqueda");
const inputBusqueda = document.getElementById("busqueda");
const filtroEstado = document.getElementById("filtro-estado");
const filtroGenero = document.getElementById("filtro-genero");
const filtroEspecie = document.getElementById("filtro-especie");
const botonLimpiar = document.getElementById("boton-limpiar");
const contenedor = document.getElementById("contenedor-personajes");
const mensaje = document.getElementById("mensaje");
const resumen = document.getElementById("resumen");
const paginacion = document.getElementById("paginacion");
const botonAnterior = document.getElementById("pagina-anterior");
const botonSiguiente = document.getElementById("pagina-siguiente");
const textoPagina = document.getElementById("texto-pagina");

// Estado de la aplicación
let paginaActual = 1;
let totalPaginas = 1;
let personajesActuales = [];

// Arma la URL con la página, el texto buscado y los filtros elegidos
// Ejemplo: https://rickandmortyapi.com/api/character?page=1&name=rick&status=alive
function construirUrl() {
  const parametros = new URLSearchParams();
  parametros.set("page", paginaActual);

  const nombre = inputBusqueda.value.trim();
  if (nombre) parametros.set("name", nombre);
  if (filtroEstado.value) parametros.set("status", filtroEstado.value);
  if (filtroGenero.value) parametros.set("gender", filtroGenero.value);
  if (filtroEspecie.value) parametros.set("species", filtroEspecie.value);

  return `${API_URL}?${parametros.toString()}`;
}

// Pide los personajes a la API con fetch()
async function obtenerPersonajes() {
  mostrarMensaje("Cargando personajes...", "cargando");
  contenedor.innerHTML = "";
  resumen.textContent = "";
  paginacion.hidden = true;

  try {
    const respuesta = await fetch(construirUrl());

    // La API responde 404 cuando no hay resultados para la búsqueda
    if (respuesta.status === 404) {
      mostrarMensaje("No se encontraron personajes con esos criterios. Intenta con otra búsqueda.", "vacio");
      return;
    }

    // Cualquier otro código que no sea 200-299 es un error del servidor
    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    personajesActuales = datos.results;
    totalPaginas = datos.info.pages;

    ocultarMensaje();
    mostrarPersonajes(personajesActuales);
    resumen.textContent = `Se encontraron ${datos.info.count} personajes.`;
    actualizarPaginacion();
  } catch (error) {
    // Entra aquí si no hay internet, la API está caída o hubo un error arriba
    console.error(error);
    mostrarMensaje("No se pudo consultar la API. Revisa tu conexión a internet e inténtalo de nuevo.", "error", true);
  }
}

// Convierte un valor en inglés a español (si no hay traducción, lo deja igual)
function traducir(diccionario, valor) {
  return diccionario[valor] || valor;
}

// Crea el HTML de una tarjeta con la imagen y la descripción del personaje
function crearTarjeta(personaje) {
  const origen = personaje.origin.name === "unknown" ? "Desconocido" : personaje.origin.name;
  const ubicacion = personaje.location.name === "unknown" ? "Desconocida" : personaje.location.name;

  return `
    <article class="tarjeta">
      <img src="${personaje.image}" alt="Imagen de ${personaje.name}" loading="lazy">
      <div class="tarjeta-cuerpo">
        <h3>${personaje.name}</h3>
        <p class="estado">
          <span class="punto ${personaje.status.toLowerCase()}"></span>
          ${traducir(ESTADOS, personaje.status)} · ${traducir(ESPECIES, personaje.species)}
        </p>
        <ul class="datos">
          <li><strong>Género:</strong> ${traducir(GENEROS, personaje.gender)}</li>
          <li><strong>Origen:</strong> ${origen}</li>
          <li><strong>Última ubicación:</strong> ${ubicacion}</li>
          <li><strong>Episodios:</strong> ${personaje.episode.length}</li>
        </ul>
      </div>
    </article>`;
}

// Dibuja una lista de personajes en la página
function mostrarPersonajes(lista) {
  contenedor.innerHTML = lista.map(crearTarjeta).join("");
}

// Muestra un mensaje de cargando, sin resultados o error
function mostrarMensaje(texto, tipo, conReintento = false) {
  mensaje.className = `mensaje ${tipo}`;
  mensaje.innerHTML = `<p>${texto}</p>`;

  if (conReintento) {
    const botonReintentar = document.createElement("button");
    botonReintentar.className = "boton";
    botonReintentar.textContent = "Reintentar";
    botonReintentar.addEventListener("click", obtenerPersonajes);
    mensaje.appendChild(botonReintentar);
  }

  mensaje.hidden = false;
}

function ocultarMensaje() {
  mensaje.hidden = true;
}

// Activa o desactiva los botones de Anterior / Siguiente
function actualizarPaginacion() {
  textoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  botonAnterior.disabled = paginaActual === 1;
  botonSiguiente.disabled = paginaActual === totalPaginas;
  paginacion.hidden = totalPaginas <= 1;
}

function cambiarPagina(nuevaPagina) {
  paginaActual = nuevaPagina;
  obtenerPersonajes();
  document.getElementById("personajes").scrollIntoView({ behavior: "smooth" });
}

// Cada búsqueda nueva empieza desde la página 1
function nuevaBusqueda() {
  paginaActual = 1;
  obtenerPersonajes();
}

// Buscador: se ejecuta al presionar "Buscar" o Enter
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita que el formulario recargue la página
  nuevaBusqueda();
});

// Filtros: buscan de nuevo en cuanto el usuario cambia una opción
[filtroEstado, filtroGenero, filtroEspecie].forEach((filtro) => {
  filtro.addEventListener("change", nuevaBusqueda);
});

botonLimpiar.addEventListener("click", () => {
  formulario.reset();
  nuevaBusqueda();
});

botonAnterior.addEventListener("click", () => cambiarPagina(paginaActual - 1));
botonSiguiente.addEventListener("click", () => cambiarPagina(paginaActual + 1));

// Al abrir la página se cargan los primeros 20 personajes
obtenerPersonajes();
