import React, { useEffect, useRef, useState } from 'react';
// import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-sql';
// import 'prismjs/components/prism-typescript';
// import 'prismjs/components/prism-java';
// import 'prismjs/components/prism-php';
// import 'prismjs/components/prism-rust';
// import 'prismjs/components/prism-csharp';
// import 'prismjs/themes/prism.css'; //Example style, you can use another
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CodeEditor({ id }) {
    const [code, setCode] = useState();
    const [lang,setLang] = useState('javascript');
    const editorRef = useRef(null);
    const notify = (msg,type) => toast(msg,{position:'bottom-center',type:type,theme:'light'});
    useEffect(() => {
        const fetchCode = async () => {
            try {
                const { data } = await axios({ method: 'GET', url: `${import.meta.env.VITE_API_URL}/api/v1/read/${id}` })
                setCode(data?.texts);
                setLang(data?.lang);
                console.log(data.texts);
            } catch (error) {
                notify('Something Went Wrong!','error');
            }
        }
        fetchCode();
    }, [])

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }
    return (
        <>
            <div className='w-[90%] mx-auto my-10'>
                {code &&
                    <div className="mockup-code h-[80vh]">
                        <pre style={{paddingRight:'0'}}>
                            <Editor
                                defaultValue={code}
                                height = '80vh'
                                width = '100%'
                                theme='vs-dark'
                                onMount={handleEditorDidMount}
                                language={lang}
                            />
                        </pre>
                    </div>}
            </div>
        </>
    );
}

export default CodeEditor;