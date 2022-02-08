/** @format */

import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './RegisterScreen.css'

const RegisterScreen = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const registerHandler = async (e) => {
    e.preventDefault()

    const config = {
      header: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const { data } = await axios.post(
        '/api/auth/register',
        {
          email,
          password
        },
        config
      )

      localStorage.setItem('authToken', data.token)

      history.push('/')
    } catch (error) {
      setError(error.response.data.error)
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }

  return (
    <div className='register-screen'>
      <form onSubmit={registerHandler} className='register-screen__form'>
        <h3 className='register-screen__title'>Register</h3>
        {error && <span className='error-message'>{error}</span>}

        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            required
            id='email'
            placeholder='Email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            required
            id='password'
            autoComplete='true'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type='submit' className='btn btn-primary'>
          Register
        </button>

        <span className='register-screen__subtext'>
          Already have an account? <Link to='/login'>Login</Link>
        </span>
      </form>
    </div>
  )
}

export default RegisterScreen
