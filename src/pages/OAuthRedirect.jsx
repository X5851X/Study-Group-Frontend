import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/userSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function OAuthRedirect() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        dispatch(loginSuccess(user));
        navigate('/dashboard');
      } catch (err) {
        console.error('Invalid token:', err);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, []);

  return <p style={{ textAlign: 'center' }}>Redirecting...</p>;
}
