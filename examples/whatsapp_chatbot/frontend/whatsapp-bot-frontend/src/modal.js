import React from 'react';
import './Modal.css';
import QRCode from 'qrcode.react';

const Modal = ({show, imageUrl }) => {{
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Escanea el código QR para conectarte</h2>
        </div>
        <div className="qr-code">
          <QRCode value={imageUrl} size={256} />
        </div>
        <div className="modal-footer">
          <p>Abre WhatsApp en tu teléfono, toca Menú o Configuración y selecciona WhatsApp Web. Escanea el código QR en la pantalla con tu teléfono.</p>
        </div>
      </div>
    </div>
  );
}};

export default Modal;