import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';

const App = () => {
  const [scannedBarcode, setScannedBarcode] = useState('');

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 640,
            height: 320,
            facingMode: 'environment',
          },
        },
        locator: {
          halfSample: true,
          patchSize: 'large',
        },
        numOfWorkers: 4,
        decoder: {
          readers: ['code_128_reader'], // Specify barcode types to detect here
        },
        locate: true,
        debug: {
          drawBoundingBox: true,
          drawScanline: true,
        },
      },
      function (err) {
        if (err) {
          console.error('Error initializing Quagga:', err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(handleBarcodeDetection);

    return () => {
      Quagga.offDetected(handleBarcodeDetection);
      Quagga.stop();
    };
  }, []);

  const handleBarcodeDetection = (result) => {
    if (result && result.codeResult && result.codeResult.code) {
      setScannedBarcode(result.codeResult.code);
    }
  };

  return (
    <div className="App">
      <h1>Barcode Scanner</h1>
      <div id="interactive" className="viewport" />
      <p>Scanned Barcode: {scannedBarcode}</p>
    </div>
  );
};

export default App;
