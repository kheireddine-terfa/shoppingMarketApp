import React from 'react'

const InputField = ({
  label,
  type,
  name,
  id,
  placeholder,
  className,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default InputField
