import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CodeEditor({ id }) {
    const [code, setCode] = useState();
    const notify = (msg,type) => toast(msg,{position:'bottom-center',type:type,theme:'light'});
    useEffect(() => {
        const fetchCode = async () => {
            try {
                const { data } = await axios({ method: 'GET', url: `https://code-pair-backend.vercel.app/api/v1/read/${id}` })
                setCode(data?.texts);
                console.log(data.texts);
            } catch (error) {
                notify('Something Went Wrong!','error');
            }
        }
        fetchCode();
    }, [])

    return (
        <>
            <div className='w-[90%] mx-auto my-5'>
                {code &&
                    <div className="mockup-code">
                        <pre>
                            <Editor
                                value={code}
                                onValueChange={code => setCode(code)}
                                highlight={code => highlight(code, languages.js)}
                                padding={10}
                                style={{
                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                    fontSize: 18,
                                }}
                            />
                        </pre>
                    </div>}
            </div>
        </>
    );
}

export default CodeEditor;