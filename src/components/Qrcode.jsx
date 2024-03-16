import React from 'react';
import QRCode from "react-qr-code";

export const Qrcode = ({value}) => {
  return (
    <QRCode
    size={256}
    // bgColor='#f4f1de'
    // fgColor='#3d405b'
    style={{ height: "auto", maxWidth: "300px", width: "170px", border:'solid 2px #3d405b', borderRadius:'7px',padding:'5px' }}
    value={value}
    viewBox={`0 0 256 256`}
    />
  )
}
