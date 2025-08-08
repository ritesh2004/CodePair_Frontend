import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Editor } from '@monaco-editor/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Footer } from '../components/Footer';
import { UserTable } from '../components/UserTable';
import { Navbar } from '../components/Navbar';
// import firebaseui from 'firebaseui';
// import { app } from '../firebase';

const socket = io(import.meta.env.VITE_API_URL);

export const Liveshare = () => {
    const [key, setKey] = useState();
    const [code, setCode] = useState();
    const [roomsize, setRoomSize] = useState(null);
    const [lang, setLang] = useState('javascript');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const editorRef = useRef(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isLeft, setIsLeft] = useState(true);

    // For delta-based code sharing
    const [lastSentCode, setLastSentCode] = useState('');
    const [pendingChanges, setPendingChanges] = useState(null);
    const [isReceivingChanges, setIsReceivingChanges] = useState(false);

    const handleDidMount = (editor) => {
        editorRef.current = editor;
    }

    // Utility function to calculate differences between two strings
    const calculateDelta = (oldText, newText) => {
        if (oldText === newText) return null;

        // Find common prefix
        let prefixEnd = 0;
        const minLength = Math.min(oldText.length, newText.length);
        while (prefixEnd < minLength && oldText[prefixEnd] === newText[prefixEnd]) {
            prefixEnd++;
        }

        // Find common suffix
        let suffixStart = 0;
        let oldIndex = oldText.length - 1;
        let newIndex = newText.length - 1;

        while (suffixStart < minLength - prefixEnd &&
            oldText[oldIndex - suffixStart] === newText[newIndex - suffixStart]) {
            suffixStart++;
        }

        const oldSuffixStart = oldText.length - suffixStart;
        const newSuffixStart = newText.length - suffixStart;

        return {
            start: prefixEnd,
            deleteCount: oldSuffixStart - prefixEnd,
            insertText: newText.substring(prefixEnd, newSuffixStart),
            timestamp: Date.now()
        };
    };

    // Apply delta changes to text
    const applyDelta = (text, delta) => {
        if (!delta) return text;
        return text.substring(0, delta.start) +
            delta.insertText +
            text.substring(delta.start + delta.deleteCount);
    };

    const handleRunCode = async () => {
        if (!code || !lang) {
            toast('Please enter code and select a language', 'error');
            return;
        }
        if (lang !== 'javascript' && lang !== 'python' && lang !== 'c' && lang !== 'cpp' && lang !== 'java') {
            toast('Unsupported language', 'error');
            return;
        }
        try {
            setIsRunning(true);
            setOutput('');
            setError('');
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/compiler/compile`, {
                code,
                language: lang
            });
            console.log(data);
            setOutput(data.output);
            setError(data.error);
        } catch (error) {
            setError(error?.response?.data?.details || 'Error occurred while running code');
            toast('Error occurred while running code', 'error');
        } finally {
            setIsRunning(false);
            // jump to output
            document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Listen for code updates from socket
    useEffect(() => {
        socket.on('receiveCode', (data) => {
            console.log('Received code:', data);
            setCode(data.code);
            setLang(data.language);
        });

        // Listen for delta changes
        socket.on('receiveDelta', (data) => {
            console.log('Received delta:', data);
            setIsReceivingChanges(true);

            setCode(prevCode => {
                const newCode = applyDelta(prevCode || '', data.delta);
                setLastSentCode(newCode); // Update last sent to avoid echoing
                return newCode;
            });

            if (data.language && data.language !== lang) {
                setLang(data.language);
            }

            // Reset receiving flag after a short delay
            setTimeout(() => setIsReceivingChanges(false), 100);
        });

        socket.on('roomJoined', (data) => {
            console.log('Room joined:', data);
            setRoomSize(data.roomSize);
            setIsLeft(false);
            toast('Room joined successfully', 'success');
        });

        return () => {
            socket.off('receiveCode');
            socket.off('receiveDelta');
            socket.off('roomJoined');
        };
    }, [lang]);

    // Function to create a room with a random room id
    const handleCreateRoom = () => {
        // Generate a random 8-character alphanumeric room id
        const randomRoomId = Math.random().toString(36).substring(2, 10);
        setKey(randomRoomId);
        // Emit joinRoom event with the new room id and user id
        socket.emit('joinRoom', randomRoomId);
        socket.on('roomJoined', (data) => {
            console.log('Room created:', data);
            setRoomSize(data.roomSize);
            setIsLeft(false);
            toast('Room created successfully', 'success');

            // Initialize last sent code when creating room
            if (code) {
                setLastSentCode(code);
            }
        });
        document.getElementById('share-modal').showModal();
    };

    const handleJoinRoom = () => {
        socket.emit('joinRoom', key);
        socket.on('roomJoined', (data) => {
            console.log('Room joined:', data);
            setRoomSize(data.roomSize);
            setIsLeft(false);
            toast('Room joined successfully', 'success');

            // Send current code to new room member (if we have code)
            if (code) {
                socket.emit('shareCode', { code, roomId: key, language: lang });
                setLastSentCode(code);
            }
        });
    };

    const handleLeaveRoom = () => {
        socket.emit('leaveRoom', key);
        socket.on('roomLeft', (data) => {
            console.log('Room left:', data);
            setRoomSize(data.roomSize);
            setIsLeft(true);
            toast('Room left successfully', 'success');
        });
    };

    // Delta-based code sharing effect
    useEffect(() => {
        if (!roomsize || !key || isReceivingChanges) return;

        // Calculate delta only if code has changed
        const delta = calculateDelta(lastSentCode, code || '');

        if (delta) {
            console.log('Sending delta:', delta);
            setPendingChanges(delta);
        }
    }, [code, lastSentCode, roomsize, key, isReceivingChanges]);

    // Send pending changes every second (instead of sending all code every 500ms)
    useEffect(() => {
        if (!roomsize || !key) return;

        const interval = setInterval(() => {
            if (pendingChanges) {
                socket.emit('shareDelta', {
                    delta: pendingChanges,
                    roomId: key,
                    language: lang
                });

                // Update last sent code and clear pending changes
                setLastSentCode(prevLastSent => {
                    const newCode = applyDelta(prevLastSent, pendingChanges);
                    return newCode;
                });
                setPendingChanges(null);
            }
        }, 1000); // Send every 1 second instead of 500ms

        return () => clearInterval(interval);
    }, [pendingChanges, roomsize, key, lang]);

    return (
        <><Navbar />
            <div className='min-h-screen flex flex-col justify-center items-center gap-5'>
                <ToastContainer />
                {/* <Signup /> */}
                <div className='w-[90%] flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2 md:gap-5'>
                        {!isLeft && <button className='btn btn-border btn-error' onClick={handleLeaveRoom}>LEAVE</button>}
                        {isLeft && <div className='flex flex-row gap-2 md:gap-5'><button className='btn btn-border btn-info' onClick={handleCreateRoom}>CREATE ROOM</button>
                            <button className='btn btn-outline' onClick={() => document.getElementById('join-modal').showModal()}>JOIN</button></div>}
                    </div>
                    <div className='w-auto flex flex-col'>
                        <span className='text-lg dark:text-white font-bold'>Contributors</span>
                        <span className='text-sm dark:text-gray-300 text-center'>{roomsize == null ? 0 : roomsize}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {/* <label className='dark:text-white'>Select Language</label> */}
                        <select className="select select-info w-full dark:text-white" onChange={e => setLang(e.target.value)} value={lang}>
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
                </div>
                <div className='h-[500px] w-[90%] p-5 outline outline-offset-2 outline-1 outline-[#00b6ff] rounded-lg'>
                    <Editor
                        defaultValue='//Typewhere...'
                        // defaultLanguage='javascript'
                        language={lang}
                        width='100%'
                        height='100%'
                        theme='vs-dark'
                        onMount={handleDidMount}
                        onChange={(value, event) => {
                            // Only update if we're not receiving changes from other users
                            if (!isReceivingChanges) {
                                setCode(value);
                            }
                        }}
                        value={code}
                    />
                </div>
                {/* Share Modal  */}
                <dialog id="share-modal" className="modal modal-bottom md:modal-middle">
                    <div className="modal-box">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Share this code</h3>
                        {key && <p className='text-sm dark:text-gray-300'>Room ID: <span className='dark:text-white font-bold'>{key}</span></p>}
                    </div>
                </dialog>

                {/* Join Modal  */}
                <dialog id="join-modal" className="modal modal-bottom md:modal-middle">
                    <div className="modal-box">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="font-bold text-lg">Enter the joining code</h3>
                        <input type="text" className='input input-border input-info' placeholder='Enter the joining code' value={key} onChange={e => setKey(e.target.value)} />
                        <button className='btn btn-border btn-info m-5' onClick={handleJoinRoom}>JOIN</button>
                    </div>
                </dialog>
                <div className='w-[90%] flex flex-row justify-end justify-items-end items-center'>
                    {!isRunning ? <button className='btn btn-border btn-success' onClick={handleRunCode}>Run Code</button> : <button className='btn btn-border btn-disabled animate-pulse'>Running...</button>}
                </div>

                {/* DEBUG: Show delta information (remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className='w-[90%] p-3 bg-gray-800 rounded text-white text-xs'>
                        <h3 className='font-bold mb-2'>Debug Info:</h3>
                        <div>Last Sent Length: {lastSentCode.length}</div>
                        <div>Current Length: {(code || '').length}</div>
                        <div>Has Pending Changes: {pendingChanges ? 'Yes' : 'No'}</div>
                        <div>Is Receiving: {isReceivingChanges ? 'Yes' : 'No'}</div>
                        {pendingChanges && (
                            <div className='mt-2'>
                                <div>Next Delta: start={pendingChanges.start}, delete={pendingChanges.deleteCount}, insert="{pendingChanges.insertText}"</div>
                            </div>
                        )}
                    </div>
                )}

                {/* OUTPUT  */}
                <div id='output' className='w-[90%] h-[300px] p-5 outline outline-offset-2 outline-1 outline-[#00b6ff] rounded-lg'>
                    <h2 className='text-lg dark:text-white font-bold'>Output</h2>
                    <div className='h-full w-full overflow-y-auto'>
                        {output && <pre className='text-white'>{output}</pre>}
                        {error && <pre className='text-red-500'>{error}</pre>}
                    </div>
                </div>
                <div className='w-[90%]'>
                    <Footer />
                </div>
            </div>
        </>
    )
}