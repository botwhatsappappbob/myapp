import React, { useState } from 'react';
import { X, Heart, Calendar, Truck, MessageSquare } from 'lucide-react';
import { Charity, FoodItem } from '../../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  charity: Charity | null;
  availableItems: FoodItem[];
  onSubmit: (donation: any) => void;
}

export default function DonationModal({ 
  isOpen, 
  onClose, 
  charity, 
  availableItems, 
  onSubmit 
}: DonationModalProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [requestPickup, setRequestPickup] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !charity) return null;

  const eligibleItems = availableItems.filter(item => 
    charity.acceptedItems.includes(item.category)
  );

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedItems };
      delete newSelected[itemId];
      setSelectedItems(newSelected);
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: quantity
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const donationItems = Object.entries(selectedItems).map(([itemId, quantity]) => {
      const item = eligibleItems.find(i => i.id === itemId);
      return {
        foodItem: item,
        quantity,
      };
    });

    const donation = {
      id: Date.now().toString(),
      items: donationItems,
      charity,
      donationDate: new Date(donationDate),
      requestPickup,
      message,
      status: 'pending',
    };

    onSubmit(donation);
    onClose();
    
    // Reset form
    setSelectedItems({});
    setDonationDate(new Date().toISOString().split('T')[0]);
    setRequestPickup(false);
    setMessage('');
  };

  const selectedItemsCount = Object.keys(selectedItems).length;
  const totalQuantity = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                Donate to {charity.name}
              </h2>
              <p className="text-gray-600 mt-1">{charity.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Items to Donate
            </h3>
            
            {eligibleItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No eligible items found for this charity
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  This charity accepts: {charity.acceptedItems.join(', ')}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {eligibleItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Available: {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        step="0.1"
                        value={selectedItems[item.id] || ''}
                        onChange={(e) => handleItemQuantityChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedItemsCount > 0 && (
            <>
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  {selectedItemsCount} item{selectedItemsCount > 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-green-600">
                  Total quantity: {totalQuantity.toFixed(1)} units
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={donationDate}
                    onChange={(e) => setDonationDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {charity.pickupAvailable && (
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requestPickup}
                        onChange={(e) => setRequestPickup(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex items-center text-sm text-gray-700">
                        <Truck className="h-4 w-4 mr-1" />
                        Request pickup
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message to Charity (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Schedule Donation
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}