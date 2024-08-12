import React, { useState } from 'react';

const QuantityModal = ({ product, onClose, onAddToSale, maxQuantity }) => {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleSubmit = () => {
    if (quantity > maxQuantity) {
      alert(`La quantité maximale pour ${product.name} est ${maxQuantity} ${product.balanced_product ? 'grammes' : 'pièces'}.`);
      return;
    }

    onAddToSale(product, quantity);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{product.name}</h2>
        <p className="text-gray-700 mb-2">
          Prix unitaire: {product.price} DA {product.balanced_product ? '/ kg' : '/ pièce'}
        </p>
        <p className="text-gray-500 mb-4">
          Quantité maximale: {maxQuantity} {product.balanced_product ? 'grammes' : 'pièces'}
        </p>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          max={maxQuantity}
          className="w-full border rounded-md p-2 mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#00ADA3] text-white font-bold rounded-md hover:bg-blue-600"
          >
            Ajouter
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;
