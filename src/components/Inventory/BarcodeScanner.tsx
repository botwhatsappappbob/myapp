import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Loader2, Search, Zap } from 'lucide-react';
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

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
      setHasPermission(null);
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported on this device. Please use manual entry.');
        setHasPermission(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setHasPermission(true);
      }
    } catch (err: any) {
      setHasPermission(false);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and try again, or use manual entry.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device. Please use manual entry.');
      } else if (err.name === 'NotSupportedError') {
        setError('Camera not supported on this device. Please use manual entry.');
      } else {
        setError('Unable to access camera. Please try manual entry.');
      }
      console.warn('Camera error:', err);
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
        setError('Product not found in database. Please try manual entry.');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualLookup();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-primary-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-primary-600" />
            Scan Product Barcode
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {hasPermission === null && !error && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-600 text-sm">Requesting camera access...</p>
            </div>
          )}

          {isScanning && hasPermission && !error ? (
            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-48 bg-gray-900 rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-primary-500 w-48 h-24 rounded-lg bg-transparent"></div>
              </div>
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Position barcode in frame
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Align the barcode within the highlighted area
              </p>
            </div>
          ) : null}

          {/* Demo buttons for testing */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Quick Demo:</p>
              <div className="flex items-center text-xs text-gray-500">
                <Zap className="h-3 w-3 mr-1" />
                Try sample products
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => simulateScan('0123456789012')}
                disabled={isLookingUp}
                className="bg-blue-50 text-blue-600 px-3 py-2 rounded text-xs hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                🥛 Organic Milk
              </button>
              <button
                onClick={() => simulateScan('0987654321098')}
                disabled={isLookingUp}
                className="bg-yellow-50 text-yellow-600 px-3 py-2 rounded text-xs hover:bg-yellow-100 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                🍌 Fresh Bananas
              </button>
              <button
                onClick={() => simulateScan('1234567890123')}
                disabled={isLookingUp}
                className="bg-red-50 text-red-600 px-3 py-2 rounded text-xs hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                🍅 Organic Tomatoes
              </button>
              <button
                onClick={() => simulateScan('5432109876543')}
                disabled={isLookingUp}
                className="bg-orange-50 text-orange-600 px-3 py-2 rounded text-xs hover:bg-orange-100 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                🍗 Chicken Breast
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
                  onKeyPress={handleKeyPress}
                  placeholder="Enter barcode number (e.g., 1234567890123)"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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
              <p className="text-xs text-gray-500 mt-1">
                Barcode should be 8-13 digits long
              </p>
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

          {isLookingUp && (
            <div className="mt-4 flex items-center justify-center text-primary-600">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm">Looking up product...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}