import React, { useState } from 'react';
import '../css/estilos.css';

export const SuAPI = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    if (query.length > 0) {
      // Realiza una búsqueda en una API (puedes usar tu API aquí)
      const response = await fetch(`https://fakestoreapi.com/products`);
      const data = await response.json();

      // Filtra los resultados basados en el query
      const filteredResults = data.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar producto..."
        onChange={handleSearch}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)} // Ocultar con retraso para permitir clics
        className="search-input"
      />
      {showResults && (
        <div className="search-popup">
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>
                <img src={result.image} alt={result.title} className="result-image" />
                <span>{result.title}</span>
                <p>{result.price}$</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
