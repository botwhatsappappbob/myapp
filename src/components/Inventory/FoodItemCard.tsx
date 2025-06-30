import React from 'react';
import { Calendar, MapPin, Edit2, Trash2 } from 'lucide-react';
import { FoodItem } from '../../types';
import { differenceInDays, format } from 'date-fns';

interface FoodItemCardProps {
  item: FoodItem;
  onEdit?: (item: FoodItem) => void;
  onDelete?: (id: string) => void;
}

export default function FoodItemCard({ item, onEdit, onDelete }: FoodItemCardProps) {
  const daysUntilExpiration = differenceInDays(new Date(item.expirationDate), new Date());
  
  const getExpirationColor = () => {
    if (daysUntilExpiration < 0) return 'text-red-600 bg-red-50';
    if (daysUntilExpiration <= 1) return 'text-red-600 bg-red-50';
    if (daysUntilExpiration <= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStorageIcon = () => {
    const icons = {
      fridge: '🧊',
      freezer: '❄️',
      pantry: '🏠',
      counter: '🏢',
    };
    return icons[item.storageLocation];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-32 object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          <div className="flex space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          {item.quantity} {item.unit}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="mr-1">{getStorageIcon()}</span>
            {item.storageLocation.charAt(0).toUpperCase() + item.storageLocation.slice(1)}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              Expires {format(new Date(item.expirationDate), 'MMM d')}
            </div>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExpirationColor()}`}>
              {daysUntilExpiration < 0 
                ? 'Expired' 
                : daysUntilExpiration === 0 
                  ? 'Today'
                  : `${daysUntilExpiration}d`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}