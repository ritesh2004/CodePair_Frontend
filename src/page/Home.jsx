import React, { useEffect, useState } from 'react'
import { Input } from '../components/Input'
import { Qrcode } from '../components/Qrcode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Home = () => {
  const [data, setData] = useState();
  const [string, setString] = useState();
  useEffect(() => {
    if (data?.success) {
      setString(`https://code-pair.vercel.app/code/${data.url}`);
      document.getElementById('my_modal_3').showModal();
    }
  })
  const handleCopy = (url) => {
    try {
      navigator.clipboard.writeText(url);
      toast('Copied to clipboard','success');
    } catch (error) {
      toast(error,'error');
    }
  }
  return (
    <div className='min-h-screen w-full flex flex-col gap-5 justify-center items-center p-3'>
    <ToastContainer/>
      <h1 className='text-4xl font-extrabold dark:text-white text-center' style={{ fontFamily: "Poppins, sans-serif" }}>Connect Through Codes: Your Ultimate Code Sharing Hub!</h1>
      <Input data={data} setData={setData} />
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-[300px] flex flex-col justify-center items-center gap-3">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Scan QR code</h3>
          <Qrcode value={string ? string : 'Welcome'} target='_blank' />
          {/* <p className='overflow-x-auto w-[90%] text-sm' style={{ scrollbarWidth: 'none' }}>{string}</p> */}
          <div className='flex flex-row-reverse w-[90%] justify-between'>
            <a href={string}>
              <button className="btn btn-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                  <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
                </svg>
              </button>
            </a>
            <button className='btn' onClick={()=>handleCopy(string)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
              </svg>
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
