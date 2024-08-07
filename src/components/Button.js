import React from 'react'

const Button = ({ text, onClick, className }) => {
  return (
    <div className="mt-6">
      <button onClick={onClick} className={className}>
        {text}
      </button>
    </div>
  )
}

export default Button
