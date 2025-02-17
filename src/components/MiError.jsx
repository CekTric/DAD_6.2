import React from 'react';

export const MiError = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
      <h1>Error 404</h1>
      <p>La página que buscas no se encuentra disponible.</p>
      <p>Por favor, verifica la URL o regresa a la página principal.</p>
    </div>
  );
};

export default MiError;
