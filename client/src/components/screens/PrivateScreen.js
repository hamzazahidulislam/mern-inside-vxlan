/** @format */

import axios from 'axios'
import { useEffect, useState } from 'react'
import './PrivateScreen.css'

const PrivateScreen = ({ history }) => {
  const [error, setError] = useState('')
  const [privateData, setPrivateData] = useState('')

  const logout = () => {
    localStorage.removeItem('authToken')
    history.push('/login')
  }

  useEffect(() => {
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      }

      try {
        const { data } = await axios.get('/api/private', config)
        setPrivateData(data.data)
      } catch (error) {
        localStorage.removeItem('authToken')
        setError('You are not authorized please login')
      }
    }

    fetchPrivateDate()
  }, [])
  return error ? (
    <span className='error-message'>{error}</span>
  ) : (
    <>
      <div>{privateData}</div>
      <button className='button' onClick={logout}>
        Logout
      </button>
    </>
  )
}

export default PrivateScreen
