import React, { useState } from 'react';

export const MiContador = () => {
  const [contador, setContador] = useState(0);

  const incrementar = () => {
    setContador(contador + 1);
  };

  const decrementar = () => {
    setContador(contador - 1);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Contador: {contador}</h2>
      <div>
        <button 
          onClick={decrementar} 
          style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', margin: '5px', border: 'none', borderRadius: '5px' }}
        >
          -1
        </button>
        <button 
          onClick={incrementar} 
          style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', margin: '5px', border: 'none', borderRadius: '5px' }}
        >
          +1
        </button>
      </div>
    </div>
  );
};

export default MiContador;
