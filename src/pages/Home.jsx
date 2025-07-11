import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/userSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthLayout, AuthForm } from '../components/auth';
import Popup from '../components/Popup';
import '../styles/auth.css';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get('token');
  const verified = params.get('verified');

  // Helper function to show popup
  const showPopup = (type, title, message) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message
    });
  };

  // Helper function to close popup
  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  // 🔁 Tangani Google OAuth token
  useEffect(() => {
    if (token) {
      try {
        const user = jwtDecode(token);
        dispatch(loginSuccess(user));
        navigate('/dashboard');
      } catch (err) {
        console.error('Google login token invalid:', err);
        showPopup('error', 'Login Failed', 'Google login token is invalid. Please try again.');
      }
    }
  }, [token, dispatch, navigate]);

  // 🔁 Tangani alert verifikasi email (tanpa halaman /verify)
  useEffect(() => {
    if (verified === 'true') {
      showPopup('success', 'Email Verified!', 'Your email has been successfully verified. You can now login to your account.');
    } else if (verified === 'false') {
      showPopup('error', 'Verification Failed', 'Email verification failed or the link has expired. Please try again.');
    }
  }, [verified]);

  // 🔒 Login/Register manual - Updated to work with AuthForm
  const handleSubmit = async (formData) => {
    setLoading(true);
    const url = isLogin
      ? 'http://localhost:5000/auth/login'
      : 'http://localhost:5000/auth/register';

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const res = await axios.post(url, payload, {
        withCredentials: true,
      });

      if (res.data?.user) {
        dispatch(loginSuccess(res.data.user));
        navigate('/dashboard');
      } else if (res.data?.message) {
        // Handle registration success message
        if (!isLogin && res.data.message.includes('verification')) {
          showPopup('success', 'Registration Successful!', res.data.message);
        } else {
          showPopup('info', 'Notice', res.data.message);
        }
      } else {
        showPopup('error', 'Unknown Error', 'An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Auth error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Authentication failed. Please check your credentials and try again.';
      showPopup('error', isLogin ? 'Login Failed' : 'Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Google OAuth
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  // Toggle between login and register
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <AuthLayout>
      <AuthForm
        isLogin={isLogin}
        onSubmit={handleSubmit}
        onToggleMode={handleToggleMode}
        onGoogleLogin={handleGoogleLogin}
        loading={loading}
      />
      
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        autoClose={popup.type === 'success' || popup.type === 'info'}
        autoCloseDelay={popup.type === 'success' ? 5000 : 4000}
      />
    </AuthLayout>
  );
}