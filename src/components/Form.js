import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import InputField from './InputField'
import Button from './Button'

const Form = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  // State to manage response message and status code
  const [response, setResponse] = useState({
    message: '',
    statusCode: null,
  })
  // Create a navigate function
  const navigate = useNavigate()

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (result.token) {
        // Store the token in localStorage
        sessionStorage.setItem('token', result.token)
      }
      if (result.roleId) {
        sessionStorage.setItem('roleId', result.roleId)
      }
      // Update the response state with message and status code
      setResponse({
        message: result.message,
        statusCode: response.status,
      })
      if (response.status >= 200 && response.status < 300) {
        // Redirect after a short delay if successful
        setTimeout(() => {
          navigate('/home') // Change this to your home page route
        }, 2000) // Adjust delay as needed (2000ms = 2 seconds)
      }
    } catch (error) {
      setResponse({
        message: 'An error occurred. Please try again.',
        statusCode: 500,
      })
    }
  }

  // Determine background color based on status code
  const getBackgroundColor = () => {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return 'bg-green-500' // Success color
    } else if (response.statusCode >= 400 && response.statusCode < 500) {
      return 'bg-red-500' // Error color
    }
    return 'bg-gray-500' // Default color
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputField
          label="User Name"
          type="text"
          name="username"
          id="username"
          placeholder="@abdellatifzidane2024"
          className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-[#b0b300cd] focus:ring-[#b0b300cd] focus:outline-none focus:ring focus:ring-opacity-40"
          value={formData.username}
          onChange={handleChange}
        />
        <InputField
          label="password"
          type="password"
          name="password"
          id="password"
          placeholder="Your password"
          className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-[#b0b300cd] focus:ring-[#b0b300cd] focus:outline-none focus:ring focus:ring-opacity-40"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          text="Sign in"
          className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#AFB300] rounded-md hover:bg-[#b0b300cd] focus:outline-none focus:bg-[#b0b300cd] focus:ring focus:ring-opacity-50"
        />
      </form>
      {response.message && (
        <div
          className={`mt-4 p-4 text-center text-white rounded-md ${getBackgroundColor()}`}
        >
          {response.message}
        </div>
      )}
    </div>
  )
}

export default Form
