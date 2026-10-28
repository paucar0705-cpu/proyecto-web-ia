# Explorador Rick and Morty

Aplicación web que consulta en tiempo real la [Rick and Morty API](https://rickandmortyapi.com/documentation) para buscar, filtrar y guardar personajes favoritos.

- **Aplicación publicada:** https://paucar0705-cpu.github.io/proyecto-web-ia/
- **Repositorio:** https://github.com/paucar0705-cpu/proyecto-web-ia

## Integrante

| Integrante | Usuario de GitHub | Aportaciones |
|---|---|---|
| Paola Cardeña | @paucar0705-cpu | Desarrollo completo: estructura HTML, estilos, conexión con la API, buscador, filtros, favoritos, corrección del Issue #1 y modo oscuro (Pull Request) |

## Descripción

La página se conecta a la API pública de Rick and Morty con `fetch()` y muestra los personajes en tarjetas con su imagen, estado, especie, género, origen, última ubicación y número de episodios. Los datos **no están escritos a mano**: todo viene de la API cada vez que se carga o se busca.

### Funcionalidades

- Listado de 20 personajes por página con paginación (Anterior / Siguiente).
- **Buscador** por nombre.
- **Filtros** por estado (vivo, muerto, desconocido), género y especie.
- **Favoritos** que se guardan en `localStorage` y se conservan al cerrar el navegador.
- **Mensajes** cuando se está cargando, cuando no hay resultados y cuando falla la conexión (con botón "Reintentar").
- **Diseño adaptable** a celulares, tablets y computadoras.
- **Mejora extra:** modo oscuro / claro que se recuerda entre visitas.

### Tecnologías

- HTML: estructura de la página.
- CSS: diseño, colores (con variables), cuadrícula responsiva y modo oscuro.
- JavaScript: consulta a la API, buscador, filtros, favoritos y cambio de tema.

## Instrucciones de uso

1. Abre la aplicación publicada en GitHub Pages.
2. Escribe un nombre (por ejemplo "Rick") y presiona **Buscar** o Enter.
3. Usa los menús de **Estado**, **Género** y **Especie** para filtrar; los resultados se actualizan solos.
4. Presiona **Limpiar** para quitar la búsqueda y los filtros.
5. Navega entre páginas con **Anterior** y **Siguiente**.
6. Presiona **☆ Agregar a favoritos** en una tarjeta. Aparecerá en la sección **Mis favoritos** (también desde el menú superior). Para quitarlo, presiona **★ Quitar de favoritos**.
7. Presiona **🌙 Modo oscuro** para cambiar el tema.

## Proceso de desarrollo en GitHub

Todo el código se escribió y modificó desde el editor web de GitHub.

| Etapa | Evidencia |
|---|---|
| Estructura HTML, estilos y conexión con la API | Commits en `main` |
| Buscador y filtros | Commit "Add search filters and reset functionality" |
| Error del filtro de especie | Issue #1 → corregido con el commit "Corregir filtro de especie exacta (closes #1)" |
| Favoritos con `localStorage` | Commit "Agregar sección de favoritos con localStorage" |
| Mejora extra: modo oscuro | Issue #2 → Pull Request #4 desde la rama `modo-oscuro` |
| Publicación | GitHub Pages desde la rama `main`, carpeta raíz |

## Uso de inteligencia artificial

Usé **Claude** para planear el proyecto, generar el código por etapas, explicarlo y resolver problemas.

### Tres prompts importantes

1. **Planeación del proyecto**
   > "Con base a las instrucciones del pdf, me ayudarás a crear el proyecto que me están marcando [...] me darás instrucciones para poder realizarlo [...] pero me tienes que explicar lo que estás haciendo y cómo lo hiciste."

   **Resultado:** la IA leyó los requisitos, probó la API antes de programar y propuso dividir el código en etapas (una por commit), además del plan de Issues, Pull Request y GitHub Pages.

2. **Duda sobre ramas**
   > "Pero no debería de tener una rama de develop?"

   **Resultado:** me explicó que `develop` es parte de Git Flow y sirve en equipos grandes, pero que la tarea no la pide y que GitHub Pages publica desde `main`. Decidí trabajar en `main` y usar una rama de funcionalidad (`modo-oscuro`) con Pull Request para la mejora extra.

3. **Problema con favoritos**
   > "Ya recargué la página con el script.js modificado pero no me deja añadir a favs"

   **Resultado:** la IA revisó el repositorio y la página publicada, y comprobó que el código estaba bien. El problema era que mi navegador seguía usando la versión anterior de `script.js` guardada en caché. Se resolvió con una recarga forzada (**Ctrl + Shift + R**).

### Respuesta de la IA que requirió correcciones

La versión del buscador y los filtros (commit 5) solo enviaba el parámetro `species` a la API. Al probarla en la página publicada, el filtro **Humano** también mostraba personajes **Humanoides**, como Aqua Morty y Aqua Rick. Ese código no bastaba y hubo que corregirlo: lo documenté en el Issue #1 y lo arreglé en el siguiente commit.

### Errores encontrados y cómo los resolví

**1. El filtro "Humano" mostraba humanoides (Issue #1)**
- **Causa:** la API trata `species=Human` como "contiene la palabra Human", por eso también regresa "Humanoid".
- **Solución:** agregué la función `filtrarEspecieExacta()`, que después de recibir los datos se queda solo con los personajes cuya especie es exactamente la elegida:

```js
function filtrarEspecieExacta(lista) {
  const especie = filtroEspecie.value;
  if (!especie) return lista;
  return lista.filter((personaje) => personaje.species === especie);
}
```

**2. Los cambios no se veían después de hacer commit**
- **Causa:** GitHub Pages permite que el navegador guarde los archivos en caché hasta 10 minutos, así que seguía cargando el `script.js` o el `style.css` anterior.
- **Solución:** recargar con **Ctrl + Shift + R** o abrir la página en una ventana de incógnito.

**3. El primer Pull Request (#3) quedó vacío**
- **Causa:** el commit del botón de modo oscuro se guardó directo en `main` en lugar de en una rama nueva, así que el PR no tenía cambios ("Files changed 0").
- **Solución:** cerré el PR #3, agregué los estilos y la lógica en la rama `modo-oscuro` y abrí el PR #4, que sí muestra los cambios y se unió a `main`.

### Modificación al código que puedo explicar

**Modo oscuro / claro** (Issue #2 y Pull Request #4):

1. En `style.css` todos los colores usan variables (`--fondo`, `--texto`, etc.). El bloque `body.oscuro { ... }` solo cambia el valor de esas variables, y por eso no tuve que modificar cada regla.
2. En `index.html` agregué el botón `#boton-tema` en el menú.
3. En `script.js`, al dar clic se agrega o quita la clase `oscuro` del `<body>` con `classList.toggle()` y la elección se guarda en `localStorage` con la clave `temaRickMorty`. Al abrir la página se lee esa clave para aplicar el último tema elegido.

### Reflexión

La IA me ayudó sobre todo a darle orden a la elaboración de la página: a dividir el trabajo en etapas y saber qué hacer en cada paso. Aun así, tuve que revisar y probar todo yo misma. Al usar la página detecté el bug de los Humanoides, y tuve muchos problemas de caché al hacer cambios e intentar verlos en la web.

Aprendí que no basta con copiar el código, porque puede seguir teniendo errores y se necesita a alguien que le dé seguimiento, verifique que todo funcione bien y esté en orden. También influye mucho el tema de la seguridad y la privacidad; en este proyecto no tanto, pero en otros es necesario dar seguimiento con un buen sistema de seguridad.

Con los commits, Issues y Pull Requests puedo llevar un mejor seguimiento: identifico los pasos a seguir y queda un registro de las acciones y modificaciones. Siento que registrar todo ayuda a desarrollar la web con orden y estructura.

## Dificultades

- Trabajar solo desde la interfaz web de GitHub, sin editor de código: hay que tener cuidado de no borrar líneas al pegar y de elegir la rama correcta antes de hacer commit.
- Entender que la API responde con código 404 cuando una búsqueda no tiene resultados, y que eso no es un error de conexión.
- La caché del navegador, que hacía parecer que los cambios no se habían guardado.
- Crear correctamente el Pull Request: el primero quedó vacío porque el cambio se guardó en `main`.

## Créditos

Datos e imágenes: [The Rick and Morty API](https://rickandmortyapi.com).
