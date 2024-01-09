import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import DataField from './datafield';
import ErrorModal from './ErrorModal';
import './mainInterface.css';

const socket = io('http://localhost:3001');

const MainInterface = ({ onShowModalChange }) => {
  const [number, setNumber] = useState(0);

  const [apiKey, setApiKey] = useState('');
  const [agent, setAgent] = useState('No tienes agente por defecto');
  const [editMode, setEditMode] = useState({ apiKey: false, agent: false });
  const [agents, setAgents] = useState([]);
  const [apiKeyReceived, setApiKeyReceived] = useState(false); 
  const [error, setError] = useState(null); 
  
  useEffect(() => {
    socket.on('socketData', (data) => {
      console.log(data);
      setNumber(data.number);
      if (data.apiKey) {
        if (typeof data.apiKey === 'string' && data.apiKey.toLowerCase().includes('error')) {
          setError(data.apiKey);
        } else {
          setApiKey(data.apiKey);
          setApiKeyReceived(true); 
        }
      }
      if (data.agent && typeof data.agent === 'string' && data.agent.toLowerCase().includes('error')) {
        setError(data.agent);
      }
      setAgent(data.agent || 'No tienes agente por defecto');
    });

    socket.on('qr', (data) => {
      console.log("data",data);
      onShowModalChange(data);
      if (typeof data === 'string' && data.toLowerCase().includes('error')) {
        setError(data);
      }
    });

    return () => {
      socket.off('socketData');
      socket.off('qr');
    };
  }, [onShowModalChange]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
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

  const handleCloseError = () => {
    setError(null);
  };

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
    if (field === 'agent') {
      socket.emit('requestAgents');
    }
  };

  const handleCancelClick = (field) => {
    setEditMode({ ...editMode, [field]: false });
  };

  useEffect(() => {
    socket.on('agents', (data) => {
      if (Array.isArray(data)) {
        setAgents(data);
      } else if (typeof data === 'string' && data.toLowerCase().includes('error')) {
        setError(data);
      }
    });

    return () => {
      socket.off('agents');
    };
  }, []);

  return (
    <div className="main-interface">
      <h1>Dashboard</h1>
      <ErrorModal error={error} onClose={handleCloseError} />
      <form onSubmit={handleFormSubmit} className="data-form">
        <DataField label="Número Enlazado" value={number} />
        <DataField
          label="codeGPT API Key"
          value={apiKey}
          editMode={editMode.apiKey}
          onEditClick={() => handleEditClick('apiKey')}
          onCancelClick={() => handleCancelClick('apiKey')}
        >
          <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </DataField>
        {apiKeyReceived && (
          <DataField
            label="Agente conectado actualmente"
            value={agent}
            editMode={editMode.agent}
            onEditClick={() => handleEditClick('agent')}
            onCancelClick={() => handleCancelClick('agent')}
          >
            <select value={agent} onChange={(e) => setAgent(e.target.value)}>
              {agents.map((agent) => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </DataField>
        )}
        <button type="submit">Actualizar Datos</button>
      </form>
    </div>
  );
};

export default MainInterface;