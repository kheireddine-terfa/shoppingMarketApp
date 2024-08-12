import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const SaledProduct = ({ product, onDelete, onQuantityChange }) => {
  const pricePerUnit = product.balanced_product ? (product.price / 1000) : product.price;
  const totalPrice = (pricePerUnit * product.quantity).toFixed(2);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src={require('./nois.jpeg')} alt={product.name} className="h-12 w-12 object-cover" />
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-500">{totalPrice} DA</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          min="1"
          className="border border-gray-300 p-1 rounded-md w-20 text-center"
          value={product.quantity}
          onChange={(e) => onQuantityChange(product.id, parseFloat(e.target.value))}
        />
        <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SaledProduct;
