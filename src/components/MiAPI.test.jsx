/*Importaciones de funciones de vitest, herramientas de testing de library 
y del componente de la API.*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MiAPI } from "./MiAPI";

/*Defino un mock, que es un conjunto de datos simulado que se usará como 
respuesta para las llamadas fetch durante las pruebas.*/
const mockGameData = [
  {
    id: 1,
    title: "Genshin Impact",
    short_description: "Un RPG de mundo abierto.",
    thumbnail: "genshin_impact.jpg",
  }
];

/*mockFetch simula la función fetch en caso de que sea true o no el success
un parametro booleano que indica si ha recibido los datos.*/
const mockFetch = (success = true) => {
  if (success) {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGameData)
      })
    );
  } else {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: "Not Found"
      })
    );
  }
};

/*describe se usa para agrupar las pruebas. Y uso un resetAllMocks para
asegurarme de que no ocurren interferencias entre las pruebas.*/
describe("MiAPI Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFetch(true);
  });

  /*Primera prueba: Renderizar los datos recibidos, una vez encontrado
  los carga y luego de renderizar los muestra. En este caso busca por nombre
  del titulo, filtra y lo enseña. */
  it("renders without crashing and shows game data", async () => {
    render(<MiAPI />);

    // Espera a que se carguen los datos del juego.
    const loadingElement = screen.getByText("Cargando...");
    console.log("Estado de carga:", loadingElement.textContent);
    expect(loadingElement).toBeInTheDocument();
    
    // Comprueba que el título y la descripción se muestren en la pantalla.
    const gameTitle = await screen.findByText("Genshin Impact");
    console.log("Título del juego encontrado:", gameTitle.textContent);
    expect(gameTitle).toBeInTheDocument();
    
    const description = screen.getByText("Un RPG de mundo abierto.");
    console.log("Descripción del juego:", description.textContent);
    expect(description).toBeInTheDocument();
    
    /* Espera a que se complete la carga y verifica que el contenido 
     completo del documento esté presente.*/
    console.log("Contenido completo del documento:");
  });

  /*Segunda prueba: Filtra el juego por busqueda y lo imprime por pantalla. */
  it("filters games based on search input", async () => {
    render(<MiAPI />);
    
    const gameTitle = await screen.findByText("Genshin Impact");
    console.log("Título inicial:", gameTitle.textContent);
    
    // Busca un juego por su título.
    const searchInput = screen.getByPlaceholderText("Buscar juego...");
    fireEvent.change(searchInput, { target: { value: "Genshin" } });
    console.log("Término de búsqueda:", searchInput.value);
    
    // Comprueba que el juego filtrado se muestre en la pantalla.
    const filteredTitle = screen.getByText("Genshin Impact");
    console.log("Resultado filtrado:", filteredTitle.textContent);
  });

  /*Tercera prueba: Muestra un mensaje de error si la llamada fetch falla. */
  it("displays an error message if the fetch fails", async () => {
    mockFetch(false);
    render(<MiAPI />);
    
    const errorMessage = await screen.findByText(/Error al obtener los juegos/);
    console.log("Mensaje de error:", errorMessage.textContent);
    
    const errorDetails = screen.getByText(/Si el error persiste/);
    console.log("Detalles del error:", errorDetails.textContent);
  });
});