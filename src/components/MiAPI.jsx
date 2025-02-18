import React, { useState, useEffect } from 'react';

export const MiAPI = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = 'https://www.freetogame.com/api/games';
        const response = await fetch(proxyUrl + apiUrl, {
          headers: {
            'Origin': 'https://www.freetogame.com'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setGames(data);
      } catch (error) {
        setError('Error al obtener los juegos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAPI();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="containerMiApi">
      <h1 className="tituloApi">Busca info de juegos F2P (Gratis)</h1>
      
      <input
        type="text"
        placeholder="Buscar juego..."
        value={searchTerm}
        onChange={handleSearch}
        className="buscaJuego"
      />

      {loading && <p>Cargando...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Si el error persiste, es posible que necesites activar el proxy CORS visitando:
            <a 
              href="https://cors-anywhere.herokuapp.com/corsdemo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 ml-1"
            >
              https://cors-anywhere.herokuapp.com/corsdemo
            </a>
          </p>
        </div>
      )}

      <div className="vistaJuegos">
        {filteredGames.length === 0 && !loading && !error && (
          <p>No se han encontrado juegos.</p>
        )}
        {filteredGames.map((game) => (
          <div key={game.id} className="datosJuego">
            {/* Mostramos la imagen de la portada del juego */}
            {game.thumbnail && (
              <img 
                src={game.thumbnail} 
                alt={game.title} 
                className="portadaJuego"
              />
            )}
            <h3 className="tituloJuego">{game.title}</h3>
            <p className="descripcionJuego">{game.short_description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
