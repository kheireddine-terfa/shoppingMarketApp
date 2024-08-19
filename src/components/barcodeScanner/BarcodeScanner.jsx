import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

const BarcodeScanner = ({ onBarcodeScanned }) => {
  const [barcode, setBarcode] = useState('');

  const processBarcode = useCallback((barcode) => {
    if (barcode) {
      onBarcodeScanned(barcode); // Pass the barcode to the parent component
      setBarcode(''); // Clear the barcode after processing
    }
  }, [onBarcodeScanned]);

  const debouncedProcessBarcode = useCallback(debounce(processBarcode, 500), [processBarcode]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const validKeys = '0123456789';
      if (event.key === 'Enter') {
        debouncedProcessBarcode(barcode);
        setBarcode('');
      } else if (validKeys.includes(event.key)) {
        setBarcode(prev => {
          const newBarcode = prev + event.key;
          debouncedProcessBarcode(newBarcode);
          return newBarcode;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [barcode, debouncedProcessBarcode]);

  return null;
};

export default BarcodeScanner;
