import React from 'react'

const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  options = [],
  checked = false,
  required = false,
  min,
  disabled = false,
  accept = '',
  name,
  maxLength,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">
        {type === 'checkbox' ? (
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="mr-2"
            {...props}
          />
        ) : null}
        {label}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
          required={required}
          {...props}
        >
          <option value="">{name}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? null : type === 'file' ? (
        <input
          type="file"
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept={accept}
          required={required}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
          min={min}
          disabled={disabled}
          maxLength={maxLength}
          onWheel={() => document.activeElement.blur()}
          {...props}
        />
      )}
    </div>
  )
}

export default FormInput
