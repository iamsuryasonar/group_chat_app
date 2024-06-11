import { io } from 'socket.io-client'
import { useEffect, useState } from 'react';

function Home() {
    const socket = io('http://localhost:8080');
    const [messageInput, setMessageInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [name, setName] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        // if user name is already present in the local storage, then update name
        let storedName = JSON.parse(localStorage.getItem('usernameGroupChat'))
        if (storedName && storedName.trim() !== '') {
            setName(storedName)
        }

        socket.on("connect", () => {
            // console.log(socket.id);
        });

        socket.on("message", (message) => {
            setMessages((prev) => [...prev, message])
        })

        socket.on("all_messages", (messages) => {
            setMessages(messages)
        })

        return () => {
            socket.on("disconnect", () => {
                console.log(socket.id);
            });
        }
    }, [])

    function onChangeHandler(e) {
        setMessageInput(e.target.value);
    }

    function onNameChangeHandler(e) {
        setNameInput(e.target.value);
    }

    function onSaveHandler() {
        localStorage.setItem('usernameGroupChat', JSON.stringify(nameInput))
        setName(nameInput);
        setNameInput('')
    }

    function onSendHandler() {
        if (messageInput.length < 1) return;
        if (socket.connected) {
            let now = new Date();
            socket.emit('message', {
                name: name,
                message: messageInput,
                time_stamp: now,
            });
            setMessageInput('');
        } else {
            console.log('socket not connected');
        }
    }

    function formatTime(time) {
        // returns time if date is today else returns the date as a string
        let now = new Date(time);
        let time_str = now.getHours() + ':' + now.getMinutes();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (time >= today) {
            return now.getDate();
        } else {
            return time_str;
        }
    }

    return <div className='relative w-full h-full max-w-xl m-auto bg-slate-50'>
        <p className='bg-slate-100 text-center font-bold py-2' >{name}</p>
        {name ?
            <div className='p-6'>
                <div className='flex flex-col gap-2'>
                    {
                        messages.map((message, i) => {
                            return name === message.name ?
                                <div key={i} className='ml-10'>
                                    <p className='ml-10 text-end bg-slate-900 text-white rounded-lg px-4 py-1' key={i}>{message.message}</p>
                                    <p className='mr-2 text-end'>{formatTime(message.time_stamp)}</p>
                                </div>
                                :
                                <div key={i} className='mr-10'>
                                    <p className='mr-10 text-start bg-slate-100 rounded-lg px-4 py-1' key={i}>{message.message}</p>
                                    <p className='ml-2 text-start'>{formatTime(message.time_stamp)}</p>
                                </div>
                        })
                    }
                </div>

                <div className='w-full min-h-svh flex flex-col justify-center items-center'>
                    <div className='flex gap-4 fixed bottom-6'>
                        <input className='border-[1px] border-black w-full p-1' type="text" value={messageInput} onChange={onChangeHandler} />
                        <button className='bg-white text-black border-[1px] border-black px-4 py-1 hover:bg-black hover:text-white' onClick={onSendHandler}>send</button>
                    </div>
                </div>
            </div>
            :
            <div className='w-full min-h-svh flex flex-col justify-center items-center'>
                <div className='flex gap-6 w-full px-6'>
                    <input className='border-[1px] border-black w-full p-1' type="text" value={nameInput} onChange={onNameChangeHandler} />
                    <button className='bg-white text-black border-[1px] border-black px-4 py-1 hover:bg-black hover:text-white' onClick={onSaveHandler}>save</button>
                </div>
            </div>
        }

    </div>
}

export default Home;