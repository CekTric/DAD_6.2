import React, { useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import '../css/estilos.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async (message) => {
    if (message.trim()) {
      const newMessage = {
        message,
        direction: 'outgoing',
        sender: 'user',
      };
      setMessages([...messages, newMessage]);

      try {
        // Lógica para enviar el mensaje al backend y obtener una respuesta
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDw9cKrN-NUZhJd4BBOJ5Vqda9iap8UMVY', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: message }]
            }]
          }),
        });

        const data = await response.json();
        const responseText = data.contents?.[0]?.parts?.[0]?.text || "Lo siento, no tengo una respuesta para eso.";

        // Filtrar respuestas relacionadas con videojuegos
        const keywords = ["videojuegos", "juegos", "consolas", "gaming", "gameplay"];
        const isRelatedToVideoGames = keywords.some(keyword => message.toLowerCase().includes(keyword));

        const responseMessage = {
          message: isRelatedToVideoGames ? responseText : "Lo siento, solo puedo responder preguntas sobre videojuegos.",
          direction: 'incoming',
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      } catch (error) {
        console.error("Error fetching response from API:", error);
        const errorMessage = {
          message: "Lo siento, hubo un error al procesar tu solicitud.",
          direction: 'incoming',
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-toggle" onClick={handleToggle}>
        {isOpen ? <FaArrowRight /> : <FaArrowLeft />}
      </div>
      {isOpen && (
        <div className="chatbot-content">
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {messages.map((msg, index) => (
                  <Message key={index} model={msg} />
                ))}
              </MessageList>
              <MessageInput placeholder="Escribe un mensaje..." onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
