import React from 'react';
import { MapPin, Phone, Mail, Truck } from 'lucide-react';
import { Charity } from '../../types';

interface CharityCardProps {
  charity: Charity;
  onSelect?: (charity: Charity) => void;
}

export default function CharityCard({ charity, onSelect }: CharityCardProps) {
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      vegetables: '🥕',
      fruits: '🍎',
      dairy: '🥛',
      meat: '🥩',
      seafood: '🐟',
      grains: '🌾',
      pantry: '🥫',
      frozen: '❄️',
      beverages: '🥤',
      snacks: '🍿',
    };
    return emojiMap[category] || '🥫';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{charity.name}</h3>
          <p className="text-sm text-gray-600">{charity.description}</p>
        </div>
        {charity.pickupAvailable && (
          <div className="bg-green-100 text-green-600 p-2 rounded-lg">
            <Truck className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {charity.address}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          {charity.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          {charity.email}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Accepted Items:</p>
        <div className="flex flex-wrap gap-1">
          {charity.acceptedItems.map((category) => (
            <span
              key={category}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center"
            >
              <span className="mr-1">{getCategoryEmoji(category)}</span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {charity.pickupAvailable && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center text-sm text-green-700">
            <Truck className="h-4 w-4 mr-2" />
            <span className="font-medium">Pickup available</span>
          </div>
        </div>
      )}

      <button
        onClick={() => onSelect?.(charity)}
        className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
      >
        Donate to {charity.name}
      </button>
    </div>
  );
}