import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaPaperPlane, FaMicrophone, FaStop, FaRedo } from 'react-icons/fa';
import '../css/estilos.css';

const VoiceInputComponent = () => {
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    setSubmittedText(inputText);
    setInputText('');
    resetTranscript();
  };

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleReset = () => {
    setInputText('');
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser does not support speech recognition.</div>;
  }

  return (
    <div>
      <h2>RECONOCIMIENTO DE VOZ</h2>
      <p style={{ color: listening ? 'green' : 'red' }}>
        Microfono: {listening ? 'ON' : 'OFF'}
      </p>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Escribe o habla..."
      />
      <div className="voice-buttons">
        <button className="voice-button" onClick={handleSend}><FaPaperPlane /></button>
        <button className="voice-button" onClick={handleStartListening}><FaMicrophone /></button>
        <button className="voice-button" onClick={SpeechRecognition.stopListening}><FaStop /></button>
        <button className="voice-button" onClick={handleReset}><FaRedo /></button>
      </div>
      <div>
        <h3>Texto enviado:</h3>
        <p>{submittedText}</p>
      </div>
    </div>
  );
};

export default VoiceInputComponent;
