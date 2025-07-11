import { Routes, Route } from 'react-router-dom';
import OAuthRedirect from './pages/OAuthRedirect';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/oauth-redirect" element={<OAuthRedirect />} /> 
    </Routes>
  );
}
