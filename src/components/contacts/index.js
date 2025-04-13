"use client"; // Директива для клиентского компонента

import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../store/provider';

const Contacts = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/contacts', {
        name,
        email,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Message sent successfully');
      setError(null);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default Contacts;
