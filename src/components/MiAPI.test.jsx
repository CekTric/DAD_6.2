import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MiAPI } from "./MiAPI";

const mockGameData = [
  {
    id: 1,
    title: "Genshin Impact",
    short_description: "Un RPG de mundo abierto.",
    thumbnail: "genshin_impact.jpg",
  }
];

// Mock fetch to better simulate the API response
const mockFetch = (success = true) => {
  if (success) {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true, // Add this to match the response.ok check
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

describe("MiAPI Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFetch(true);
  });

  it("renders without crashing", async () => {
    render(<MiAPI />);
    
    // First check for loading state
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
    
    // Then wait for the game to appear
    const gameTitle = await screen.findByText("Genshin Impact");
    expect(gameTitle).toBeInTheDocument();
  });

  it("filters games based on search input", async () => {
    render(<MiAPI />);
    
    // Wait for initial data to load
    await screen.findByText("Genshin Impact");
    
    // Perform search
    const searchInput = screen.getByPlaceholderText("Buscar juego...");
    fireEvent.change(searchInput, { target: { value: "Genshin" } });
    
    // Verify filtered results
    expect(screen.getByText("Genshin Impact")).toBeInTheDocument();
  });

  it("displays an error message if the fetch fails", async () => {
    mockFetch(false);
    render(<MiAPI />);
    
    const errorMessage = await screen.findByText(/Error al obtener los juegos/);
    expect(errorMessage).toBeInTheDocument();
  });
});