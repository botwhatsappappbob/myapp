import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink, Loader2 } from 'lucide-react';
import { Charity } from '../../types';
import { MapsService, MapLocation } from '../../services/mapsService';

interface CharityMapProps {
  onCharitySelect?: (charity: Charity) => void;
}

export default function CharityMap({ onCharitySelect }: CharityMapProps) {
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [nearbyCharities, setNearbyCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNearbyCharities();
  }, []);

  const loadNearbyCharities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user's current location
      const location = await MapsService.getCurrentLocation();
      if (location) {
        setUserLocation(location);
        
        // Find nearby charities
        const charities = await MapsService.findNearbyCharities(location);
        setNearbyCharities(charities);
      } else {
        // Fallback to default location (NYC) if geolocation fails
        const defaultLocation = { lat: 40.7128, lng: -74.0060 };
        setUserLocation(defaultLocation);
        const charities = await MapsService.findNearbyCharities(defaultLocation);
        setNearbyCharities(charities);
      }
    } catch (err) {
      setError('Unable to load nearby charities. Please try again.');
      console.error('Error loading charities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharityClick = (charity: Charity) => {
    setSelectedCharity(charity);
  };

  const handleDonateClick = (charity: Charity) => {
    onCharitySelect?.(charity);
  };

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mr-3" />
          <span className="text-gray-600">Finding nearby charities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Map</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadNearbyCharities}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="h-5 w-5 text-primary-600 mr-2" />
          Nearby Charities
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {nearbyCharities.length} charities found within 25 miles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Map Placeholder */}
        <div className="bg-gray-100 rounded-lg h-64 lg:h-80 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200"></div>
          <div className="relative z-10 text-center">
            <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-2" />
            <p className="text-primary-700 font-medium">Interactive Map</p>
            <p className="text-sm text-primary-600">
              {userLocation ? 
                `${nearbyCharities.length} charities near you` : 
                'Enable location for personalized results'
              }
            </p>
          </div>
          
          {/* Simulated map pins */}
          {nearbyCharities.slice(0, 3).map((charity, index) => (
            <button
              key={charity.id}
              onClick={() => handleCharityClick(charity)}
              className={`absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform ${
                selectedCharity?.id === charity.id ? 'ring-2 ring-primary-500' : ''
              }`}
              style={{
                left: `${30 + index * 25}%`,
                top: `${40 + index * 15}%`,
              }}
            >
              <span className="sr-only">{charity.name}</span>
            </button>
          ))}
        </div>

        {/* Charity List */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {nearbyCharities.map((charity) => (
            <div
              key={charity.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedCharity?.id === charity.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCharityClick(charity)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{charity.name}</h4>
                {charity.distance && (
                  <span className="text-sm text-gray-500">
                    {charity.distance.toFixed(1)} mi
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{charity.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                {charity.address}
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Phone className="h-3 w-3 mr-1" />
                {charity.phone}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {charity.acceptedItems.slice(0, 4).map((category) => (
                  <span
                    key={category}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center"
                  >
                    <span className="mr-1">{getCategoryEmoji(category)}</span>
                    {category}
                  </span>
                ))}
                {charity.acceptedItems.length > 4 && (
                  <span className="text-gray-400 text-xs px-2 py-1">
                    +{charity.acceptedItems.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDonateClick(charity);
                  }}
                  className="flex-1 bg-primary-600 text-white px-3 py-2 rounded text-sm hover:bg-primary-700 transition-colors"
                >
                  Donate Here
                </button>
                <a
                  href={MapsService.getDirectionsUrl(charity.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Charity Details */}
      {selectedCharity && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{selectedCharity.name}</h4>
              <p className="text-gray-600">{selectedCharity.description}</p>
            </div>
            {selectedCharity.website && (
              <a
                href={selectedCharity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>

          {selectedCharity.operatingHours && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Operating Hours
              </h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(selectedCharity.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize text-gray-600">{day}:</span>
                    <span className="text-gray-900">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => handleDonateClick(selectedCharity)}
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Start Donation to {selectedCharity.name}
          </button>
        </div>
      )}
    </div>
  );
}