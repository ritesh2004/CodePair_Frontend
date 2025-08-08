import React from 'react';
import CodeEditor from '../components/CodeEditor';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Footer } from '../components/Footer';

export const Code = () => {
    const { id } = useParams();
    console.log(id);
    return (
        <div className='min-h-screen'>
            <h1 className='text-3xl font-extrabold text-center mt-5 dark:text-white'>Shared Code!</h1>
            <ToastContainer/>
            <CodeEditor id={id} />
            <Footer/>
        </div>
    )
}
