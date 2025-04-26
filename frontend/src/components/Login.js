import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const onLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Add animation before navigation
      setFadeIn(false);
      setTimeout(() => {
        navigate('/translate');
      }, 300);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Add animation before navigation
      setFadeIn(false);
      setTimeout(() => {
        navigate('/translate');
      }, 300);
    } catch (error) {
      setError(error.message);
    }
  };

  // Create ripple effect function
  const createRipple = (event) => {
    const button = event.currentTarget;
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.querySelector('.ripple');
    if (ripple) {
      ripple.remove();
    }
    
    button.appendChild(circle);
  };

  return (
    <div className="login-container" style={{
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 0.5s ease'
    }}>
      <div className="login-card" style={{
        transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
        transition: 'transform 0.5s ease, box-shadow 0.3s ease, opacity 0.5s ease'
      }}>
        <div className="login-header" style={{
          animation: 'fadeIn 0.8s ease'
        }}>
          <h1 className="app-title">Translingua</h1>
          <p className="app-subtitle">Your translation companion</p>
        </div>
        
        {error && (
          <p className="error-message" style={{
            animation: 'shakeError 0.5s ease'
          }}>
            {error}
          </p>
        )}
        
        <div className="login-form">
          <form onSubmit={onLogin} style={{
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
          }}>
            <div className="input-container">
              <FiMail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="input-field"
              />
            </div>
            <div className="input-container">
              <FiLock className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="input-field"
              />
            </div>
            <button 
              type="submit" 
              className="login-button"
              onClick={createRipple}
            >
              Login <FiArrowRight style={{ marginLeft: '8px' }} />
            </button>
          </form>
        </div>
        
        <div className="divider">
          <div className="divider-line"></div>
          <p className="divider-text">OR</p>
          <div className="divider-line"></div>
        </div>
        
        <button 
          onClick={(e) => {
            createRipple(e);
            handleGoogleSignIn();
          }}
          className="google-button"
          style={{
            transition: 'all 0.3s ease',
            transform: 'scale(1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FcGoogle className="google-icon" />
          <span>Login with Google</span>
        </button>
        
        <p className="signup-link">
          Don't have an account?{' '}
          <a 
            href="/" 
            style={{
              position: 'relative',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              const underline = document.createElement('div');
              underline.style.position = 'absolute';
              underline.style.bottom = '0';
              underline.style.left = '0';
              underline.style.width = '0';
              underline.style.height = '1px';
              underline.style.backgroundColor = '#4285f4';
              underline.style.transition = 'width 0.3s ease';
              underline.className = 'link-underline';
              e.currentTarget.appendChild(underline);
              setTimeout(() => {
                underline.style.width = '100%';
              }, 10);
            }}
            onMouseOut={(e) => {
              const underline = e.currentTarget.querySelector('.link-underline');
              if (underline) {
                underline.style.width = '0';
                setTimeout(() => {
                  underline.remove();
                }, 300);
              }
            }}
          >
            Sign up
          </a>
        </p>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shakeError {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
          100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          20% {
            transform: scale(25, 25);
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: scale(40, 40);
          }
        }
        
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .login-card {
          width: 380px;
          padding: 35px;
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }
        
        .login-card:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .app-title {
          color: #333;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 28px;
        }
        
        .app-subtitle {
          color: #666;
          font-size: 16px;
          margin-top: 0;
        }
        
        .error-message {
          color: #e53935;
          text-align: center;
          margin-bottom: 15px;
          font-size: 14px;
        }
        
        .input-container {
          position: relative;
          margin-bottom: 20px;
        }
        
        .input-icon {
          position: absolute;
          left: 12px;
          top: 12px;
          color: #757575;
          font-size: 18px;
          transition: color 0.3s ease;
        }
        
        .input-field {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        .input-field:focus {
          border-color: #4285f4;
          outline: none;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
        }
        
        .input-field:focus + .input-icon {
          color: #4285f4;
        }
        
        .login-button {
          width: 100%;
          padding: 14px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(66, 133, 244, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .login-button:hover {
          background-color: #3367d6;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(66, 133, 244, 0.4);
        }
        
        .login-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);
        }
        
        .login-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }
        
        .login-button:focus:not(:active)::after {
          animation: ripple 1s ease-out;
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
        }
        
        .divider {
          display: flex;
          align-items: center;
          margin: 25px 0;
        }
        
        .divider-line {
          flex: 1;
          height: 1px;
          background-color: #eee;
          transition: background-color 0.3s ease;
        }
        
        .divider-text {
          margin: 0 15px;
          color: #757575;
          font-size: 14px;
        }
        
        .google-button {
          width: 100%;
          padding: 12px;
          background-color: white;
          color: #757575;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }
        
        .google-button:hover {
          background-color: #f8f8f8;
          border-color: #ccc;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .google-icon {
          font-size: 20px;
          margin-right: 10px;
        }
        
        .signup-link {
          text-align: center;
          margin-top: 25px;
          color: #666;
          font-size: 15px;
        }
        
        .signup-link a {
          color: #4285f4;
          text-decoration: none;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Login;
