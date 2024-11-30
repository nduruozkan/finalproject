// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function InputForm({ setIsOpen }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Başarı mesajı için state

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignUp ? 'api/users/register' : 'api/users/login';
    const requestData = isSignUp ? { username, password, email } : { username, password };

    try {
      const res = await axios.post(`http://localhost:3001/${endpoint}`, requestData);
      console.log("API response data:", res.data);

      if (isSignUp) {
        if (res.data && res.data.message === "User registered successfully") {
          setError('');
          setSuccess('Registration successful! Please log in.'); // Başarı mesajını ayarla
          setIsSignUp(false);
        } else {
          throw new Error("Unexpected response from the registration API.");
        }
      } else {
        const data = res.data.data;
        if (data && data.token) {
          const { token, user } = data;

          localStorage.setItem('token', token);
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }

          setError('');
          setSuccess('Login successful! Redirecting...'); // Başarı mesajını ayarla
          setTimeout(() => {
            setIsOpen(false); // Modal'ı kapat
          }, 2000); // Kullanıcıyı yönlendirmeden önce kısa bir bekleme
        } else {
          throw new Error("API response does not contain required fields for login.");
        }
      }
    } catch (err) {
      setSuccess(''); // Başarı mesajını temizle
      if (err.response) {
        setError(err.response.data.message || 'An error occurred. Please try again.');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleOnSubmit}>
        <div className="form-control">
          <label>Username</label>
          <input
            type="text"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label>Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isSignUp && (
          <div className="form-control">
            <label>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
        <br />
        {error && <h6 className="error">{error}</h6>}
        {success && <h6 className="success">{success}</h6>} {/* Başarı mesajı */}
        <br />
        <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: 'pointer', color: 'blue' }}>
          {isSignUp ? 'Already have an account?' : 'Create new account'}
        </p>
      </form>
    </>
  );
}

InputForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};
