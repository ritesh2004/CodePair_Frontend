import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Input = ({ data,setData }) => {
  const [code, setCode] = useState();
  const [lang, setLang] = useState();
  const [loading,setLoading] = useState(false);
  const notify = (msg,type) => toast(msg,{position:'bottom-center',type:type,theme:'light'});
  const postCode = async () => {
    try {
      setLoading(true);
      if (!code){
        notify('Empty code!','error');
        setLoading(false);
        return;
      }
      const { data } = await axios({
        method: 'POST',
        url: 'https://code-pair-backend.vercel.app/api/v1/write',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          text: code,
          lang: lang
        }
      })
      setLoading(false);
      setData(data);
      notify('Code Uploaded!','success');
      setCode('');
      setLang('js');
    } catch (error) {
      setLoading(false);
      notify('Something went wrong!','error');
    }
  }
  return (
    <div className='w-min flex flex-col justify-center items-center gap-3 md:w-[80%]'>
      <ToastContainer />
      <textarea name='code' id='code' className="textarea textarea-info dark:text-white w-[320px] h-[300px] md:w-full md:h-[450px]" placeholder="Enter code you wanna share..." value={code} onChange={(e) => setCode(e.target.value)} ></textarea>
      <div className='w-full flex flex-col gap-2'>
      <label className='dark:text-white'>Select Language</label>
      <select className="select select-info w-full dark:text-white" value={lang} onChange={(e) => setLang(e.target.value)}>
        <option disabled defaultValue="js" value="js">Select Language</option>
        <option value="js">JavaScript</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="cs">C#</option>
        <option value="py">Python</option>
        <option value="jsvs">Java</option>
        <option value="rs">Rust</option>
        <option value="php">PHP</option>
        <option value="sql">SQL</option>
        <option value="ts">TypeScript</option>
      </select>
      </div>
      <button className="btn rounded-3xl btn-info w-[320px] md:mb-5" disabled={loading} onClick={postCode}>{loading?<span className="loading loading-spinner"></span>:'Share Code'}</button>
    </div>
  )
}
