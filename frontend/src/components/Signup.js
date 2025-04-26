import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength('');
      return;
    }

    // Define password strength criteria
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLongEnough = password.length >= 8;

    const criteria = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar, isLongEnough];
    const metCriteria = criteria.filter(Boolean).length;

    if (metCriteria <= 2) {
      setPasswordStrength('weak');
    } else if (metCriteria <= 4) {
      setPasswordStrength('good');
    } else {
      setPasswordStrength('strong');
    }
  }, [password]);

  // Check if passwords match
  useEffect(() => {
    if (!confirmPassword) {
      setPasswordsMatch(null);
      return;
    }
    
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  // Validate email domain
  useEffect(() => {
    if (!email) {
      setEmailValid(null);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValid(false);
      return;
    }

    // Check for common email domains
    const domain = email.split('@')[1];
    const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'protonmail.com', 'mail.com'];
    
    if (validDomains.includes(domain)) {
      setEmailValid(true);
    } else {
      // Allow other domains but mark as potentially valid
      setEmailValid('unknown');
    }
  }, [email]);

  const onSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailValid) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength === 'weak') {
      setError('Please use a stronger password');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
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

  // Get color for password strength indicator
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#FF3333';
      case 'good': return '#FFCC00';
      case 'strong': return '#33CC33';
      default: return '#CCCCCC';
    }
  };

  return (
    <div className="signup-container" style={{
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 0.5s ease'
    }}>
      <div className="signup-card" style={{
        transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
        transition: 'transform 0.5s ease, box-shadow 0.3s ease, opacity 0.5s ease'
      }}>
        <div className="signup-header" style={{
          animation: 'fadeIn 0.8s ease'
        }}>
          <h1 className="app-title">Translingua</h1>
          <p className="app-subtitle">Create your account</p>
        </div>
        
        {error && (
          <p className="error-message" style={{
            animation: 'shakeError 0.5s ease'
          }}>
            {error}
          </p>
        )}
        
        <div className="signup-form">
          <form onSubmit={onSignup} style={{
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
              {emailValid !== null && (
                <div className="validation-message" style={{
                  color: emailValid === true ? '#33CC33' : emailValid === 'unknown' ? '#FFCC00' : '#FF3333',
                  fontSize: '12px',
                  marginTop: '4px',
                  transition: 'all 0.3s ease'
                }}>
                  {emailValid === true ? 'Valid email' : 
                   emailValid === 'unknown' ? 'Email domain not recognized but format is valid' : 
                   'Invalid email format'}
                </div>
              )}
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
              {passwordStrength && (
                <div className="password-strength" style={{ marginTop: '8px' }}>
                  <div className="strength-bars" style={{ display: 'flex', marginBottom: '4px' }}>
                    <div style={{
                      height: '4px',
                      flex: 1,
                      backgroundColor: passwordStrength !== '' ? getStrengthColor() : '#CCCCCC',
                      borderRadius: '2px',
                      marginRight: '4px',
                      transition: 'background-color 0.3s ease'
                    }}></div>
                    <div style={{
                      height: '4px',
                      flex: 1,
                      backgroundColor: (passwordStrength === 'good' || passwordStrength === 'strong') ? getStrengthColor() : '#CCCCCC',
                      borderRadius: '2px',
                      marginRight: '4px',
                      transition: 'background-color 0.3s ease'
                    }}></div>
                    <div style={{
                      height: '4px',
                      flex: 1,
                      backgroundColor: passwordStrength === 'strong' ? getStrengthColor() : '#CCCCCC',
                      borderRadius: '2px',
                      transition: 'background-color 0.3s ease'
                    }}></div>
                  </div>
                  <div className="strength-text" style={{
                    color: getStrengthColor(),
                    fontSize: '12px',
                    textTransform: 'capitalize',
                    transition: 'color 0.3s ease'
                  }}>
                    {passwordStrength} password
                  </div>
                </div>
              )}
            </div>
            <div className="input-container">
              <FiLock className="input-icon" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="input-field"
              />
              {passwordsMatch !== null && (
                <div className="passwords-match" style={{
                  color: passwordsMatch ? '#33CC33' : '#FF3333',
                  fontSize: '12px',
                  marginTop: '4px',
                  transition: 'color 0.3s ease'
                }}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="signup-button"
              onClick={createRipple}
            >
              Sign Up <FiArrowRight style={{ marginLeft: '8px' }} />
            </button>
          </form>
        </div>
        
        <p className="login-link">
          Already have an account?{' '}
          <a 
            href="/login" 
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
            Login
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
        
        .signup-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .signup-card {
          width: 380px;
          padding: 35px;
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }
        
        .signup-card:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
        }
        
        .signup-header {
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
        
        .signup-button {
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
        
        .signup-button:hover {
          background-color: #3367d6;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(66, 133, 244, 0.4);
        }
        
        .signup-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);
        }
        
        .signup-button::after {
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
        
        .signup-button:focus:not(:active)::after {
          animation: ripple 1s ease-out;
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
        }
        
        .login-link {
          text-align: center;
          margin-top: 25px;
          color: #666;
          font-size: 15px;
        }
        
        .login-link a {
          color: #4285f4;
          text-decoration: none;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Signup;
