import React from 'react'
import FormInput from './FormInput'

const AddModal = ({ onSubmit, onCancel, InputsConfig }) => {
  // Separate inputs into two columns if more than 6 inputs
  const firstColumnInputs =
    InputsConfig.length > 7 ? InputsConfig.slice(0, 7) : InputsConfig

  const secondColumnInputs =
    InputsConfig.length > 7 ? InputsConfig.slice(7) : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              {firstColumnInputs.map((inputConfig, index) => (
                <FormInput
                  key={index}
                  label={inputConfig.label}
                  type={inputConfig.type || 'text'} // Default to 'text' if type is not specified
                  value={inputConfig.value}
                  checked={inputConfig.checked}
                  onChange={inputConfig.onChange}
                  options={inputConfig.options}
                  disabled={inputConfig.disabled}
                  required={inputConfig.required}
                  min={inputConfig.min}
                  accept={inputConfig.accept}
                />
              ))}
            </div>
            {secondColumnInputs.length > 0 && (
              <div className="border-l border-gray-300 pl-6">
                {secondColumnInputs.map((inputConfig, index) => (
                  <FormInput
                    key={index}
                    label={inputConfig.label}
                    type={inputConfig.type || 'text'} // Default to 'text' if type is not specified
                    value={inputConfig.value}
                    checked={inputConfig.checked}
                    onChange={inputConfig.onChange}
                    options={inputConfig.options}
                    disabled={inputConfig.disabled}
                    required={inputConfig.required}
                    min={inputConfig.min}
                    accept={inputConfig.accept}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddModal
