import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../slices/auth/usersApiSlice';
import { setCredentials } from '../../slices/auth/authSlice';
import PropagateLoader from 'react-spinners/PropagateLoader';
import emailjs from '@emailjs/browser';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const form = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Instantiate the login API method
  const [login, { isLoading }] = useLoginMutation();

  // Selects the user info from the redux store
  const { userInfo } = useSelector((state) => state.auth);

  //If the user token is still validy, it goes to the home page
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  // Handles the login form
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      if (res.token) {
        localStorage.setItem('token', res.token);
      } else {
        console.error('Login failed');
      }
      navigate('/');
      sendEmail();
    } catch (err) {
      setError(err?.data?.error);
    }
  };

  const sendEmail = () => {
    try {
      emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        form.current,
        {
          publicKey: import.meta.env.VITE_PUBLIC_KEY,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Logs the demo user in
  const demoUserLogin = async () => {
    try {
      const res = await login({
        email: import.meta.env.VITE_DEMO_USER_EMAIL,
        password: import.meta.env.VITE_DEMO_USER_PASSWORD,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      if (res.token) {
        localStorage.setItem('token', res.token);
      } else {
        console.error('Login failed');
      }
      navigate('/');
      sendEmail();
    } catch (err) {
      setError(err?.data?.error);
    }
  };

  return (
    <div className='flex-center register-container'>
      <div className='card register-card'>
        <div className='register-body-container'>
          <svg
            className='nav_icon'
            xmlns='http://www.w3.org/2000/svg'
            width='50px'
            height='50px'
            viewBox='0 0 24 24'
            id='box'
          >
            <path
              fill='var(--text-color)'
              d='M20.47,7.37s0,0,0-.08l-.06-.15a.71.71,0,0,0-.07-.09.94.94,0,0,0-.09-.12l-.09-.07L20,6.78l-7.5-4.63a1,1,0,0,0-1.06,0L4,6.78l-.09.08-.09.07a.94.94,0,0,0-.09.12.71.71,0,0,0-.07.09l-.06.15s0,0,0,.08a1.15,1.15,0,0,0,0,.26v8.74a1,1,0,0,0,.47.85l7.5,4.63h0a.47.47,0,0,0,.15.06s.05,0,.08,0a.86.86,0,0,0,.52,0s.05,0,.08,0a.47.47,0,0,0,.15-.06h0L20,17.22a1,1,0,0,0,.47-.85V7.63A1.15,1.15,0,0,0,20.47,7.37ZM11,19.21l-5.5-3.4V9.43L11,12.82Zm1-8.12L6.4,7.63,12,4.18l5.6,3.45Zm6.5,4.72L13,19.21V12.82l5.5-3.39Z'
            ></path>
          </svg>
          <p className='xs'>Investly</p>
        </div>
        <div className='register-body-container'>
          <p className='normal strong'>Login</p>
          <p className='xs light'>Input your details below</p>
        </div>
        <form
          className='register-input-container register-form-container'
          onSubmit={submitHandler}
          ref={form}
        >
          <div className='register-input-container'>
            <p className='xss light placeholder-container'>Email address</p>
            <input
              type='email'
              name='email'
              value={email}
              style={{ color: 'var(--text-color)' }}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter username'
              className='input-box-form'
            />
          </div>
          <div className='register-input-container'>
            <p className='xss light'>Password</p>
            <input
              type='password'
              value={password}
              style={{ color: 'var(--text-color)' }}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
              className='input-box-form'
            />
          </div>
          <div className='register-input-container'>
            <a onClick={demoUserLogin} className='btn-outline flex-center demo'>
              Demo User
            </a>
            {error && <p className='error-message xs'>*{error}</p>}
            {isLoading ? (
              <div className='flex-center my-2'>
                <PropagateLoader color='var(--text-color)' size={5} />
              </div>
            ) : (
              // Render regular button when isLoading is false
              <button className='btn my-1' type='submit'>
                Login
              </button>
            )}
            <p className='form-center light xss'>
              Does not have an account?{' '}
              <Link to={'/register'}>
                <span className='strong'>Register.</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
