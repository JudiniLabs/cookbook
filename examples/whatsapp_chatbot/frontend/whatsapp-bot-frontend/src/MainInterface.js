import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './mainInterface.css';

const socket = io('http://localhost:3001'); // Update with your actual socket server URL

const MainInterface = ({ onShowModalChange }) => {
  const [number, setNumber] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [agent, setAgent] = useState('No tienes agente por defecto');
  const [editMode, setEditMode] = useState({ apiKey: false, agent: false });
  const [agents, setAgents] = useState([]); // New state for the list of agents

  useEffect(() => {
    // Configurar el listener para recibir el estado del socket
    socket.on('socketData', (data) => {
      console.log(data)
      setNumber(data.number);
      setApiKey(data.apiKey);
      setAgent(data.agent || 'No tienes agente por defecto');
    });

    // Nuevo listener para el evento 'qr'
    socket.on('qr', (data) => {
      console.log("data",data)
      onShowModalChange(data);
    });

    // Limpiar los listeners cuando el componente se desmonta
    return () => {
      socket.off('socketData');
      socket.off('qr');
    };
  }, [onShowModalChange]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Solo enviar el apiKey y el agente al socket si tienen un valor distinto de '' o 'No tienes agente por defecto'
    const dataToSend = {};
    if (apiKey !== '') {
      dataToSend.apiKey = apiKey;
    }
    if (agent !== '' && agent !== 'No tienes agente por defecto') {
      dataToSend.agent = agent;
    }
    if (Object.keys(dataToSend).length > 0) {
      socket.emit("enviarDatos", dataToSend);
    }
    setEditMode({ apiKey: false, agent: false });
  };

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
    if (field === 'agent') {
      // Request the list of agents from the backend when the user clicks edit
      socket.emit('requestAgents');
    }
  };

  const handleCancelClick = (field) => {
    setEditMode({ ...editMode, [field]: false });
  };

  // New useEffect to listen for the 'agents' event from the socket
  useEffect(() => {
    socket.on('agents', (data) => {
      setAgents(data);
    });

    return () => {
      socket.off('agents');
    };
  }, []);

  return (
    <div className="main-interface">
      <h1>Dashboard</h1>
      <form onSubmit={handleFormSubmit} className="data-form">
        <div className="data-field">
          <label>Número Enlazado:</label>
          <span>{number}</span> {/* El número enlazado ya no es editable */}
        </div>
        <div className="data-field">
          <label>codeGPT API Key:</label>
          {editMode.apiKey ? (
            <>
              <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <button onClick={() => handleCancelClick('apiKey')}>X</button>
            </>
          ) : (
            <span>{apiKey} <button onClick={() => handleEditClick('apiKey')}>Editar</button></span>
          )}
        </div>
        <div className="data-field">
          <label>Agente conectado actualmente:</label>
          {editMode.agent ? (
            <>
              <select value={agent} onChange={(e) => setAgent(e.target.value)}>
                {agents.map((agent) => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
              <button onClick={() => handleCancelClick('agent')}>X</button>
            </>
          ) : (
            <span>{agent} <button onClick={() => handleEditClick('agent')}>Editar</button></span>
          )}
        </div>
        <button type="submit">Actualizar Datos</button>
      </form>
    </div>
  );
};

export default MainInterface;