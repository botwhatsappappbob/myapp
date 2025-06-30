import { Charity } from '../types';

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

export class MapsService {
  private static readonly GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // In production, use environment variable

  static async getCurrentLocation(): Promise<MapLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  static async geocodeAddress(address: string): Promise<MapLocation | null> {
    try {
      // In production, use Google Geocoding API
      // const response = await fetch(
      //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.GOOGLE_MAPS_API_KEY}`
      // );
      // const data = await response.json();
      
      // Mock geocoding for demo
      const mockCoordinates: Record<string, MapLocation> = {
        '123 Community St, Downtown': { lat: 40.7128, lng: -74.0060, address: '123 Community St, Downtown' },
        '456 Hope Ave, Midtown': { lat: 40.7589, lng: -73.9851, address: '456 Hope Ave, Midtown' },
        '789 Elder Way, Uptown': { lat: 40.7831, lng: -73.9712, address: '789 Elder Way, Uptown' },
      };

      return mockCoordinates[address] || null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  static calculateDistance(point1: MapLocation, point2: MapLocation): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static async findNearbyCharities(location: MapLocation, radius: number = 25): Promise<Charity[]> {
    try {
      // In production, this would use Google Places API to find food banks and charities
      // const response = await fetch(
      //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius * 1609}&type=food&keyword=food+bank+charity&key=${this.GOOGLE_MAPS_API_KEY}`
      // );
      
      // Mock nearby charities for demo
      const mockCharities: Charity[] = [
        {
          id: '1',
          name: 'City Food Bank',
          address: '123 Community St, Downtown',
          phone: '(555) 123-4567',
          email: 'info@cityfoodbank.org',
          description: 'Serving families in need for over 20 years',
          acceptedItems: ['vegetables', 'fruits', 'grains', 'pantry'],
          pickupAvailable: true,
          coordinates: { lat: 40.7128, lng: -74.0060 },
          operatingHours: {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM',
            saturday: '10:00 AM - 2:00 PM',
            sunday: 'Closed',
          },
          website: 'https://cityfoodbank.org',
        },
        {
          id: '2',
          name: 'Helping Hands Shelter',
          address: '456 Hope Ave, Midtown',
          phone: '(555) 987-6543',
          email: 'contact@helpinghands.org',
          description: 'Providing meals and shelter to the homeless community',
          acceptedItems: ['meat', 'vegetables', 'fruits', 'dairy'],
          pickupAvailable: false,
          coordinates: { lat: 40.7589, lng: -73.9851 },
          operatingHours: {
            monday: '8:00 AM - 6:00 PM',
            tuesday: '8:00 AM - 6:00 PM',
            wednesday: '8:00 AM - 6:00 PM',
            thursday: '8:00 AM - 6:00 PM',
            friday: '8:00 AM - 6:00 PM',
            saturday: '9:00 AM - 4:00 PM',
            sunday: '9:00 AM - 4:00 PM',
          },
          website: 'https://helpinghands.org',
        },
        {
          id: '3',
          name: 'Senior Center Kitchen',
          address: '789 Elder Way, Uptown',
          phone: '(555) 456-7890',
          email: 'kitchen@seniorcenter.org',
          description: 'Daily meals for senior citizens in our community',
          acceptedItems: ['vegetables', 'fruits', 'meat', 'dairy', 'grains'],
          pickupAvailable: true,
          coordinates: { lat: 40.7831, lng: -73.9712 },
          operatingHours: {
            monday: '7:00 AM - 3:00 PM',
            tuesday: '7:00 AM - 3:00 PM',
            wednesday: '7:00 AM - 3:00 PM',
            thursday: '7:00 AM - 3:00 PM',
            friday: '7:00 AM - 3:00 PM',
            saturday: 'Closed',
            sunday: 'Closed',
          },
          website: 'https://seniorcenter.org',
        },
      ];

      // Calculate distances and sort by proximity
      const charitiesWithDistance = mockCharities.map(charity => ({
        ...charity,
        distance: charity.coordinates 
          ? this.calculateDistance(location, charity.coordinates)
          : Infinity,
      })).sort((a, b) => a.distance - b.distance);

      return charitiesWithDistance.filter(charity => charity.distance <= radius);
    } catch (error) {
      console.error('Error finding nearby charities:', error);
      return [];
    }
  }

  static getDirectionsUrl(destination: string): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }

  static getMapEmbedUrl(location: MapLocation, zoom: number = 15): string {
    return `https://www.google.com/maps/embed/v1/view?key=${this.GOOGLE_MAPS_API_KEY}&center=${location.lat},${location.lng}&zoom=${zoom}`;
  }
}