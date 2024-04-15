import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  //If the user token is still validy, it goes to the home page
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password != confirmPassword) {
        setError('Password must match');
        return;
      }
      const res = await register({ email, username, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
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
            <path d='M20.47,7.37s0,0,0-.08l-.06-.15a.71.71,0,0,0-.07-.09.94.94,0,0,0-.09-.12l-.09-.07L20,6.78l-7.5-4.63a1,1,0,0,0-1.06,0L4,6.78l-.09.08-.09.07a.94.94,0,0,0-.09.12.71.71,0,0,0-.07.09l-.06.15s0,0,0,.08a1.15,1.15,0,0,0,0,.26v8.74a1,1,0,0,0,.47.85l7.5,4.63h0a.47.47,0,0,0,.15.06s.05,0,.08,0a.86.86,0,0,0,.52,0s.05,0,.08,0a.47.47,0,0,0,.15-.06h0L20,17.22a1,1,0,0,0,.47-.85V7.63A1.15,1.15,0,0,0,20.47,7.37ZM11,19.21l-5.5-3.4V9.43L11,12.82Zm1-8.12L6.4,7.63,12,4.18l5.6,3.45Zm6.5,4.72L13,19.21V12.82l5.5-3.39Z'></path>
          </svg>
          <p className='xs'>Investly</p>
        </div>
        <div className='register-body-container'>
          <p className='normal strong'>Register</p>
          <p className='xs light'>Input your details below</p>
        </div>
        <form
          className='register-input-container register-form-container'
          autoComplete='off'
          onSubmit={submitHandler}
        >
          <div className='register-input-container'>
            <p className='xss light placeholder-container'>Email address</p>
            <input
              type='email'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter username'
              className='input-box-form'
            />
          </div>
          <div className='register-input-container'>
            <p className='xss light placeholder-container'>Username</p>
            <input
              type='text'
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter username'
              className='input-box-form'
            />
          </div>
          <div className='register-input-container'>
            <p className='xss light'>Password</p>
            <input
              type='password'
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
              className='input-box-form'
            />
          </div>
          <div className='register-input-container'>
            <p className='xss light'>Confirm Password</p>
            <input
              type='password'
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Enter password'
              className='input-box-form'
            />
          </div>
          <div className='register-input-container'>
            {error && <p className='error-message xs'>*{error}</p>}
            <button className='btn my-1' type='submit' disabled={isLoading}>
              Register
            </button>
            <p className='light xss'>
              Already have an account?{' '}
              <Link to={'/login'}>
                <span className='strong'>Sign in.</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
