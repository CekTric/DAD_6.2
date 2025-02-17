import React, { useState } from 'react';
import '../css/estilos.css';
import juego1 from '../img/juego1.png';
import juego2 from '../img/juego2.png';
import juego3 from '../img/juego3.png';
import VoiceInputComponent from './VoiceInputComponent';

const InteractiveComponents = () => {
  const [showComponent1, setShowComponent1] = useState(false);
  const [showComponent2, setShowComponent2] = useState(false);
  const [showComponent3, setShowComponent3] = useState(false);

  const toggleComponent1 = () => setShowComponent1(!showComponent1);
  const toggleComponent2 = () => setShowComponent2(!showComponent2);
  const toggleComponent3 = () => setShowComponent3(!showComponent3);

  return (
    <div className="interactive-container-unique">
      <div className="buttons-wrapper-unique">
        <button onClick={toggleComponent1}>
          {showComponent1 ? 'Ocultar' : 'Mostrar'}
        </button>
        <button onClick={toggleComponent2}>
          {showComponent2 ? 'Ocultar' : 'Mostrar'}
        </button>
        <button onClick={toggleComponent3}>
          {showComponent3 ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      <div className="components-wrapper-unique">
        {showComponent1 && <img src={juego1} alt="Componente 1" className="component-unique" />}
        {showComponent2 && <img src={juego2} alt="Componente 2" className="component-unique" />}
        {showComponent3 && <img src={juego3} alt="Componente 3" className="component-unique" />}
      </div>
      <hr />
      <VoiceInputComponent />
    </div>
  );
};

export default InteractiveComponents;
