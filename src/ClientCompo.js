import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IoIosChatbubbles } from 'react-icons/io';

const socket = io('https://chat-applicationapi.onrender.com');

function ClientCompo() {
  const [name, setName] = useState('');
  const [chatName, setChatName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const joinChat = () => {
    const personName = prompt('Enter your name:');
    if (personName) {
      setName(personName);
      setChatName(personName);
      socket.emit('joinChat', personName);
    }
  };

  const sendMessage = () => {
    const newMessage = `${chatName}: ${message}`;
    socket.emit('chat message', newMessage);
    setMessage('');
  };
  

  useEffect(() => {
    return () => {
      socket.emit('user left', name);
    };
  }, [name]);

  useEffect(() => {
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('user joined', (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on('user left', (user) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u !== user));
    });
  }, []);

  return (
    <div>
      {name === '' ? (
        <div>
          <h1>Group Chat</h1>
          <button onClick={joinChat}>Join Chat</button>
        </div>
      ) : (
        <div>
          <h1 className='Heading'>
            <IoIosChatbubbles className="chat-icon" /> {chatName}
          </h1>
          <div className="chat-container">
            <div className="user-list">
              {/* <h2>Users in the chat:</h2> */}
              {users.map((user, index) => (
          <div key={index}>{user}</div>
            ))}

            </div>
            {messages.map((msg, index) => (
              <div key={index} className="message">
                {msg}
              </div>
            ))}
          </div>
          <div className='lastDiv'>
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientCompo;
