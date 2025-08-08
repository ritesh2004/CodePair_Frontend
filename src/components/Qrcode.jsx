import React from 'react';
import QRCode from "react-qr-code";

export const Qrcode = ({value}) => {
  // Handle empty or invalid values
  const qrValue = value && typeof value === 'string' && value.trim() !== '' ? value : 'Welcome';
  
  return (
    <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={qrValue}
        viewBox={`0 0 256 256`}
      />
    </div>
  )
}
