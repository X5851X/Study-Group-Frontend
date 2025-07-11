import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Users, Globe } from 'lucide-react';

// AuthLayout Component
export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Background Effects */}
      <div className="auth-bg-effects">
        <div className="auth-bg-blob auth-bg-blob-1"></div>
        <div className="auth-bg-blob auth-bg-blob-2"></div>
        <div className="auth-bg-blob auth-bg-blob-3"></div>
      </div>
      
      {/* Main Content */}
      <div className="auth-container">
        <div className="auth-grid">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <div className="auth-brand-content">
              <div className="auth-brand-header">
                <div className="auth-brand-icon">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="auth-brand-title">Study Together</h1>
              </div>
              <p className="auth-brand-subtitle">
                Belajar bersama, berkembang bersama. Platform pembelajaran kolaboratif yang menghubungkan siswa di seluruh dunia.
              </p>
            </div>
            
            <div className="auth-features">
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-purple">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="auth-feature-content">
                  <h3 className="auth-feature-title">Belajar Kolaboratif</h3>
                  <p className="auth-feature-desc">Bergabung dengan grup belajar dan diskusi</p>
                </div>
              </div>
              
              <div className="auth-feature">
                <div className="auth-feature-icon auth-feature-icon-blue">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="auth-feature-content">
                  <h3 className="auth-feature-title">Akses Global</h3>
                  <p className="auth-feature-desc">Terhubung dengan pelajar dari berbagai negara</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Auth Form */}
          <div className="auth-form-container">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// AuthForm Component
export const AuthForm = ({ isLogin, onSubmit, onToggleMode, onGoogleLogin, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    if (!isLogin && !formData.name) {
      newErrors.name = 'Nama wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="auth-form">
      {/* Header */}
      <div className="auth-form-header">
        {/* Mobile brand */}
        <div className="auth-mobile-brand">
          <div className="auth-mobile-brand-icon">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="auth-mobile-brand-text">Study Together</span>
        </div>
        
        <h2 className="auth-form-title">
          {isLogin ? 'Selamat Datang Kembali!' : 'Bergabung dengan Kami'}
        </h2>
        <p className="auth-form-subtitle">
          {isLogin ? 'Masuk untuk melanjutkan perjalanan belajar Anda' : 'Daftar untuk memulai perjalanan belajar Anda'}
        </p>
      </div>

      {/* Form Fields */}
      <div className="auth-form-fields">
        {/* Name Field (Only for Registration) */}
        {!isLogin && (
          <div className="auth-field">
            <label htmlFor="name" className="auth-field-label">
              Nama Lengkap
            </label>
            <div className="auth-field-input-container">
              <div className="auth-field-icon">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`auth-field-input ${errors.name ? 'auth-field-input-error' : ''}`}
                placeholder="Masukkan nama lengkap Anda"
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="auth-field-error">{errors.name}</p>
            )}
          </div>
        )}

        {/* Email Field */}
        <div className="auth-field">
          <label htmlFor="email" className="auth-field-label">
            Email
          </label>
          <div className="auth-field-input-container">
            <div className="auth-field-icon">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`auth-field-input ${errors.email ? 'auth-field-input-error' : ''}`}
              placeholder="Masukkan email Anda"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="auth-field-error">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="auth-field">
          <label htmlFor="password" className="auth-field-label">
            Password
          </label>
          <div className="auth-field-input-container">
            <div className="auth-field-icon">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`auth-field-input ${errors.password ? 'auth-field-input-error' : ''}`}
              placeholder="Masukkan password Anda"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="auth-field-toggle"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="auth-field-error">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="auth-submit-btn"
        >
          {loading ? (
            <div className="auth-loading">
              <div className="auth-spinner"></div>
              <span>Loading...</span>
            </div>
          ) : (
            isLogin ? 'Masuk' : 'Daftar'
          )}
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line"></div>
          <span className="auth-divider-text">atau</span>
          <div className="auth-divider-line"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={loading}
          className="auth-google-btn"
        >
          <div className="auth-google-content">
            <svg className="auth-google-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </div>
        </button>
      </div>

      {/* Toggle Mode */}
      <div className="auth-toggle">
        <p className="auth-toggle-text">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
          <button
            onClick={onToggleMode}
            className="auth-toggle-btn"
            disabled={loading}
          >
            {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Demo Component
export default function StudyTogetherAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', formData);
    alert(`${isLogin ? 'Login' : 'Register'} berhasil!`);
    setLoading(false);
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Google login berhasil!');
    setLoading(false);
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
    </AuthLayout>
  );
}
