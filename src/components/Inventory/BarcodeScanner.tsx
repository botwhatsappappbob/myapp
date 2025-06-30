import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Loader2, Search } from 'lucide-react';
import { BarcodeService } from '../../services/barcodeService';
import { BarcodeProduct } from '../../types';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound: (product: BarcodeProduct) => void;
  onManualEntry: () => void;
}

export default function BarcodeScanner({ isOpen, onClose, onProductFound, onManualEntry }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions or enter barcode manually.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleManualLookup = async () => {
    if (!manualBarcode.trim()) return;
    
    setIsLookingUp(true);
    try {
      const product = await BarcodeService.lookupProduct(manualBarcode.trim());
      if (product) {
        onProductFound(product);
        onClose();
      } else {
        setError('Product not found. Please try manual entry.');
      }
    } catch (err) {
      setError('Error looking up product. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const simulateScan = async (barcode: string) => {
    setIsLookingUp(true);
    try {
      const product = await BarcodeService.lookupProduct(barcode);
      if (product) {
        onProductFound(product);
        onClose();
      } else {
        setError('Product not found in database.');
      }
    } catch (err) {
      setError('Error looking up product.');
    } finally {
      setIsLookingUp(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Scan Barcode
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : null}

          {isScanning && !error ? (
            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-48 bg-gray-900 rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-primary-500 w-48 h-24 rounded-lg"></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Position barcode within the frame
              </p>
            </div>
          ) : null}

          {/* Demo buttons for testing */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Demo: Try these sample barcodes:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => simulateScan('0123456789012')}
                disabled={isLookingUp}
                className="bg-blue-50 text-blue-600 px-3 py-2 rounded text-xs hover:bg-blue-100 transition-colors"
              >
                Milk
              </button>
              <button
                onClick={() => simulateScan('0987654321098')}
                disabled={isLookingUp}
                className="bg-blue-50 text-blue-600 px-3 py-2 rounded text-xs hover:bg-blue-100 transition-colors"
              >
                Bananas
              </button>
              <button
                onClick={() => simulateScan('1234567890123')}
                disabled={isLookingUp}
                className="bg-blue-50 text-blue-600 px-3 py-2 rounded text-xs hover:bg-blue-100 transition-colors"
              >
                Tomatoes
              </button>
              <button
                onClick={() => simulateScan('5432109876543')}
                disabled={isLookingUp}
                className="bg-blue-50 text-blue-600 px-3 py-2 rounded text-xs hover:bg-blue-100 transition-colors"
              >
                Chicken
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter barcode manually:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Enter barcode number"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleManualLookup}
                  disabled={isLookingUp || !manualBarcode.trim()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLookingUp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onManualEntry}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Manual Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}