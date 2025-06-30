import React, { useState, useEffect } from 'react';
import { X, Plus, Camera, Package } from 'lucide-react';
import { FoodCategory, StorageLocation, BarcodeProduct } from '../../types';
import BarcodeScanner from './BarcodeScanner';

interface EnhancedAddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
  prefilledProduct?: BarcodeProduct | null;
}

export default function EnhancedAddItemModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  prefilledProduct 
}: EnhancedAddItemModalProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables' as FoodCategory,
    quantity: '',
    unit: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    storageLocation: 'fridge' as StorageLocation,
    notes: '',
    barcode: '',
    brand: '',
  });

  useEffect(() => {
    if (prefilledProduct) {
      setFormData(prev => ({
        ...prev,
        name: prefilledProduct.name,
        category: prefilledProduct.category || 'pantry',
        unit: prefilledProduct.commonUnits?.[0] || '',
        barcode: prefilledProduct.barcode,
        brand: prefilledProduct.brand || '',
      }));
    }
  }, [prefilledProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      purchaseDate: new Date(formData.purchaseDate),
      expirationDate: new Date(formData.expirationDate),
      storageLocation: formData.storageLocation,
      notes: formData.notes,
      barcode: formData.barcode,
      brand: formData.brand,
      imageUrl: prefilledProduct?.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
      nutritionalInfo: prefilledProduct?.nutritionalInfo,
    };
    
    onAdd(newItem);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'vegetables',
      quantity: '',
      unit: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      expirationDate: '',
      storageLocation: 'fridge',
      notes: '',
      barcode: '',
      brand: '',
    });
  };

  const handleProductFound = (product: BarcodeProduct) => {
    setFormData(prev => ({
      ...prev,
      name: product.name,
      category: product.category || 'pantry',
      unit: product.commonUnits?.[0] || '',
      barcode: product.barcode,
      brand: product.brand || '',
    }));
    setShowScanner(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
    setShowScanner(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Food Item</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!formData.barcode && (
            <div className="mb-6 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-700 mb-3">
                Speed up entry by scanning a barcode first!
              </p>
              <button
                onClick={() => setShowScanner(true)}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Scan Barcode</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {formData.barcode && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center text-sm text-green-700">
                  <Package className="h-4 w-4 mr-2" />
                  <span>Product found: {formData.brand} {formData.name}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Barcode: {formData.barcode}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Organic Apples"
              />
            </div>

            {formData.brand && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="seafood">Seafood</option>
                  <option value="grains">Grains</option>
                  <option value="pantry">Pantry</option>
                  <option value="frozen">Frozen</option>
                  <option value="beverages">Beverages</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage
                </label>
                <select
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value as StorageLocation })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="fridge">Fridge</option>
                  <option value="freezer">Freezer</option>
                  <option value="pantry">Pantry</option>
                  <option value="counter">Counter</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <input
                  type="text"
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., lbs, pieces, cups"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>

      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onProductFound={handleProductFound}
        onManualEntry={() => {
          setShowScanner(false);
        }}
      />
    </>
  );
}