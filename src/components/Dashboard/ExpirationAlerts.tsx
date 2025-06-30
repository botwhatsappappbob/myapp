import React from 'react';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';
import { FoodItem } from '../../types';
import { differenceInDays, format } from 'date-fns';

interface ExpirationAlertsProps {
  items: FoodItem[];
}

export default function ExpirationAlerts({ items }: ExpirationAlertsProps) {
  const getExpirationStatus = (expirationDate: Date) => {
    const daysUntilExpiration = differenceInDays(expirationDate, new Date());
    
    if (daysUntilExpiration < 0) {
      return { status: 'expired', color: 'red', icon: AlertTriangle };
    } else if (daysUntilExpiration <= 1) {
      return { status: 'critical', color: 'red', icon: AlertTriangle };
    } else if (daysUntilExpiration <= 3) {
      return { status: 'warning', color: 'yellow', icon: Clock };
    } else {
      return { status: 'good', color: 'green', icon: Calendar };
    }
  };

  const sortedItems = [...items].sort((a, b) => 
    new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
  );

  const criticalItems = sortedItems.filter(item => {
    const daysUntilExpiration = differenceInDays(new Date(item.expirationDate), new Date());
    return daysUntilExpiration <= 3;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          Expiration Alerts
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Items expiring in the next 3 days
        </p>
      </div>
      
      <div className="p-6">
        {criticalItems.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No items expiring soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {criticalItems.slice(0, 5).map((item) => {
              const { status, color, icon: StatusIcon } = getExpirationStatus(new Date(item.expirationDate));
              const daysUntilExpiration = differenceInDays(new Date(item.expirationDate), new Date());
              
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 text-${color}-500`} />
                    <div className="text-right">
                      <p className={`text-sm font-medium text-${color}-600`}>
                        {daysUntilExpiration < 0 
                          ? 'Expired' 
                          : daysUntilExpiration === 0 
                            ? 'Expires today'
                            : `${daysUntilExpiration} day${daysUntilExpiration > 1 ? 's' : ''}`
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(item.expirationDate), 'MMM d')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}