import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '@monaco-editor/react';

export const Input = ({ data, setData }) => {
  const [code, setCode] = useState();
  const [lang, setLang] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const notify = (msg, type) => toast(msg, { position: 'bottom-center', type: type, theme: 'light' });
  useEffect(() => {
    console.log(lang);
  }, [lang])
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  }
  const getCode = (value, event) => {
    // console.log('Value',value);
    setCode(value);
  }
  const postCode = async () => {
    try {
      setLoading(true);
      if (!code) {
        notify('Empty code!', 'error');
        setLoading(false);
        return;
      }
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_URL}/api/v1/write`,
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
      setCode('');
      setLang('javascript');
    } catch (error) {
      setLoading(false);
      notify('Something went wrong!', 'error');
    }
  }
  return (
    <div className='w-full flex flex-col justify-center items-center gap-3'>
      <ToastContainer />
      <div className='h-[500px] w-full p-5 outline outline-offset-2 outline-1 outline-[#00b6ff] rounded-lg'>
        <Editor
          defaultValue='//Typewhere...'
          // defaultLanguage='javascript'
          language={lang}
          width='100%'
          height='100%'
          theme='vs-dark'
          onMount={handleEditorDidMount}
          onChange={getCode}
          value={code}
        />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <label className='dark:text-white'>Select Language</label>
        <select className="select select-info w-full dark:text-white" onChange={e => setLang(e.target.value)}>
          <option disabled defaultValue="javascript">Select Language</option>
          <option value="javascript">JavaScript</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="rust">Rust</option>
          <option value="php">PHP</option>
          <option value="sql">SQL</option>
          <option value="typescript">TypeScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
          <option value="ruby">Ruby</option>
        </select>
      </div>
      <button className="btn rounded-3xl btn-info w-[320px] md:mb-5" disabled={loading} onClick={postCode}>{loading ? <span className="loading loading-spinner"></span> : 'Share Code'}</button>
    </div>
  )
}
