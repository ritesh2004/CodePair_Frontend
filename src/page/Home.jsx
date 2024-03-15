import React, { useEffect, useState } from 'react'
import { Input } from '../components/Input'
import { Qrcode } from '../components/Qrcode';

export const Home = () => {
  const [data, setData] = useState();
  const [string,setString] = useState();
  useEffect(() => {
    if (data?.success) {
      setString(`http://192.168.80.20:5173/code/${data.url}`)
      document.getElementById('my_modal_3').showModal();
    }
  })
  return (
    <div className='min-h-screen w-full flex flex-col gap-10 justify-center items-center p-3'>
      <h1 className='text-4xl font-extrabold dark:text-white text-center' style={{ fontFamily: "Poppins, sans-serif" }}>Connect Through Codes: Your Ultimate Code Sharing Hub!</h1>
      <Input data={data} setData={setData} />
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box flex flex-col justify-center items-center gap-3">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Scan QR code</h3>
          <Qrcode value={string ? string : 'Welcome'} target='_blank'/>
          <p className=''>{string}</p>
          <a href={string}>
            <button className="btn">OPEN</button>
          </a>
        </div>
      </dialog>
    </div>
  )
}
