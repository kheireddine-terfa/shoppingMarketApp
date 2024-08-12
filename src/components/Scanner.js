// Scanner.js
import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';

const Scanner = ({ onScan, onClose }) => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const handleScan = (result) => {
      if (result && result.codeResult && result.codeResult.code) {
        onScan(result.codeResult.code);
      }
    };

    const startScanner = () => {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: webcamRef.current.video,
          constraints: {
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'upc_reader', 'upc_e_reader'],
        },
      }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected(handleScan);
    };

    startScanner();

    return () => {
      Quagga.offDetected(handleScan);
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center z-50">
      <div className="relative w-full max-w-md p-4 bg-white rounded-md shadow-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600"
        >
          Close
        </button>
        <div className="webcam-container">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Scanner;
