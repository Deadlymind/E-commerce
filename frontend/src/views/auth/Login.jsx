// src/views/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { login } from '../../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

function Login() {
  // ===================== STATE MANAGEMENT =====================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ===================== HOOKS =====================

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => !!state.allUserData);

  // ===================== EFFECTS =====================

  useEffect(() => {
    console.log('useEffect triggered. isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // ===================== HANDLERS =====================

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    console.log('handleLogin called with:', email, password);

    try {
      const { error } = await login(email, password);
      console.log('login response:', { error });

      if (error) {
        setErrorMessage(error);
      } else {
        console.log('Login successful. Navigating to home.');
        navigate('/');
        resetForm();
      }
    } catch (err) {
      console.error('Login failed:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('handleLogin finished. isLoading:', isLoading);
    }
  };

  // ===================== RENDER =====================
  return (
    <div className="login-container">
      <h1>Welcome Back!</h1>
      <p>Please log in to continue shopping.</p>

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="login-form">
        {/* Email Input Field */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email" // Changed to 'email' for better validation
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Makes the field mandatory
            aria-required="true" // Improves accessibility
          />
        </div>

        {/* Password Input Field */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading} // Disables the button while loading
          className="submit-button"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Link to Registration Page */}
      <p className="signup-link">
        Don`t have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
