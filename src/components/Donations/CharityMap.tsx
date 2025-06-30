import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink, Loader2, RefreshCw, Truck } from 'lucide-react';
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
  const [searchRadius, setSearchRadius] = useState(25);

  useEffect(() => {
    loadNearbyCharities();
  }, [searchRadius]);

  const loadNearbyCharities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user's current location
      const location = await MapsService.getCurrentLocation();
      if (location) {
        setUserLocation(location);
        
        // Find nearby charities
        const charities = await MapsService.findNearbyCharities(location, searchRadius);
        setNearbyCharities(charities);
      } else {
        // Fallback to default location (NYC) if geolocation fails
        const defaultLocation = { lat: 40.7128, lng: -74.0060 };
        setUserLocation(defaultLocation);
        const charities = await MapsService.findNearbyCharities(defaultLocation, searchRadius);
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

  const getCurrentDayHours = (charity: Charity) => {
    if (!charity.operatingHours) return 'Hours not available';
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return charity.operatingHours[today as keyof typeof charity.operatingHours] || 'Closed';
  };

  const isOpenNow = (charity: Charity) => {
    const todayHours = getCurrentDayHours(charity);
    if (todayHours === 'Closed' || todayHours === 'Hours not available') return false;
    
    // Simple check - in production, would parse actual hours
    return !todayHours.toLowerCase().includes('closed');
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
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 text-primary-600 mr-2" />
              Nearby Charities
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {nearbyCharities.length} charities found within {searchRadius} miles
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={10}>10 miles</option>
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
            </select>
            <button
              onClick={loadNearbyCharities}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Enhanced Map Visualization */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg h-64 lg:h-80 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200"></div>
          <div className="relative z-10 text-center">
            <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-2" />
            <p className="text-primary-700 font-medium">Interactive Charity Map</p>
            <p className="text-sm text-primary-600">
              {userLocation ? 
                `${nearbyCharities.length} charities near you` : 
                'Enable location for personalized results'
              }
            </p>
            {userLocation && (
              <p className="text-xs text-primary-500 mt-1">
                📍 Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            )}
          </div>
          
          {/* Enhanced simulated map pins with better positioning */}
          {nearbyCharities.slice(0, 5).map((charity, index) => (
            <button
              key={charity.id}
              onClick={() => handleCharityClick(charity)}
              className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center text-white text-xs font-bold ${
                selectedCharity?.id === charity.id 
                  ? 'bg-primary-600 ring-2 ring-primary-400 scale-110' 
                  : charity.pickupAvailable 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
              }`}
              style={{
                left: `${20 + (index * 15) + Math.sin(index) * 10}%`,
                top: `${30 + (index * 12) + Math.cos(index) * 8}%`,
              }}
              title={charity.name}
            >
              {index + 1}
            </button>
          ))}
          
          {/* User location indicator */}
          {userLocation && (
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" 
                 style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          )}
        </div>

        {/* Enhanced Charity List */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {nearbyCharities.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No charities found in this area</p>
              <p className="text-sm text-gray-400 mt-1">Try increasing the search radius</p>
            </div>
          ) : (
            nearbyCharities.map((charity) => (
              <div
                key={charity.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedCharity?.id === charity.id 
                    ? 'border-primary-500 bg-primary-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCharityClick(charity)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{charity.name}</h4>
                      {charity.pickupAvailable && (
                        <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs flex items-center">
                          <Truck className="h-3 w-3 mr-1" />
                          Pickup
                        </div>
                      )}
                      {isOpenNow(charity) && (
                        <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                          Open
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{charity.description}</p>
                  </div>
                  {charity.distance && (
                    <span className="text-sm font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                      {charity.distance.toFixed(1)} mi
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{charity.address}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                  {charity.phone}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>Today: {getCurrentDayHours(charity)}</span>
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
                    className="flex-1 bg-primary-600 text-white px-3 py-2 rounded text-sm hover:bg-primary-700 transition-colors font-medium"
                  >
                    Donate Here
                  </button>
                  <a
                    href={MapsService.getDirectionsUrl(charity.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
                    title="Get directions"
                  >
                    <Navigation className="h-3 w-3" />
                  </a>
                  {charity.website && (
                    <a
                      href={charity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
                      title="Visit website"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enhanced Selected Charity Details */}
      {selectedCharity && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{selectedCharity.name}</h4>
                {selectedCharity.pickupAvailable && (
                  <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    Pickup Available
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-3">{selectedCharity.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Contact Information</p>
                  <p className="text-gray-600">{selectedCharity.phone}</p>
                  <p className="text-gray-600">{selectedCharity.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Distance</p>
                  <p className="text-gray-600">
                    {selectedCharity.distance ? `${selectedCharity.distance.toFixed(1)} miles away` : 'Distance unknown'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {selectedCharity.website && (
                <a
                  href={selectedCharity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                  title="Visit website"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
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
                    <span className={`${day === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()] ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Accepted Donations</h5>
            <div className="flex flex-wrap gap-2">
              {selectedCharity.acceptedItems.map((category) => (
                <span
                  key={category}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span className="mr-1">{getCategoryEmoji(category)}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleDonateClick(selectedCharity)}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              Start Donation to {selectedCharity.name}
            </button>
            <a
              href={MapsService.getDirectionsUrl(selectedCharity.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}