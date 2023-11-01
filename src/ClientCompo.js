import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IoIosChatbubbles } from 'react-icons/io';
const socket = io('http://localhost:3001');

function ClientCompo() {
  const [name, setName] = useState('');
  const [chatName, setChatName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const joinChat = () => {
    const personName = prompt('Enter the name of the chat person:');
    if (personName) {
      setName(personName);
      setChatName(personName);
      socket.emit('join', personName);
      alert('Joined the chat successfully'); 
    }
  };

  const sendMessage = () => {
    const newMessage = (
      <div className="message-container">
        <span className="chatName">{chatName}</span>
        <div className="message">
          <span className="bigFont">{message}</span>
        </div>
      </div>
    );
    
    
    
    socket.emit('chat message', newMessage);
    setMessage('');
    setMessages([...messages, newMessage]);
  };

  useEffect(() => { 
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
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
          {/* <div> */}
          <h1 className='Heading'> <IoIosChatbubbles className="chat-icon" /> {chatName}</h1>
          {/* </div> */}
          <div className="chat-container">
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
