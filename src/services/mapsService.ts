import { Charity } from '../types';

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

export class MapsService {
  private static readonly GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  static async getCurrentLocation(): Promise<MapLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
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
          console.warn('Error getting location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  static async geocodeAddress(address: string): Promise<MapLocation | null> {
    try {
      // In production, use Google Geocoding API
      if (this.GOOGLE_MAPS_API_KEY && this.GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return {
            lat: location.lat,
            lng: location.lng,
            address: data.results[0].formatted_address,
          };
        }
      }
      
      // Mock geocoding for demo when API key is not available
      const mockCoordinates: Record<string, MapLocation> = {
        '123 Community St, Downtown': { lat: 40.7128, lng: -74.0060, address: '123 Community St, Downtown' },
        '456 Hope Ave, Midtown': { lat: 40.7589, lng: -73.9851, address: '456 Hope Ave, Midtown' },
        '789 Elder Way, Uptown': { lat: 40.7831, lng: -73.9712, address: '789 Elder Way, Uptown' },
        '321 Charity Lane, Westside': { lat: 40.7505, lng: -73.9934, address: '321 Charity Lane, Westside' },
        '654 Helping Hand Blvd, Eastside': { lat: 40.7282, lng: -73.7949, address: '654 Helping Hand Blvd, Eastside' },
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
      if (this.GOOGLE_MAPS_API_KEY && this.GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
        // Uncomment and implement when Google Places API is available
        /*
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius * 1609}&type=food&keyword=food+bank+charity&key=${this.GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'OK') {
          return data.results.map(place => this.parseGooglePlaceToCharity(place));
        }
        */
      }
      
      // Enhanced mock nearby charities for demo
      const mockCharities: Charity[] = [
        {
          id: '1',
          name: 'City Food Bank',
          address: '123 Community St, Downtown',
          phone: '(555) 123-4567',
          email: 'info@cityfoodbank.org',
          description: 'Serving families in need for over 20 years. We accept fresh produce, canned goods, and non-perishable items.',
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
          description: 'Providing meals and shelter to the homeless community. We especially need protein sources and fresh vegetables.',
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
          description: 'Daily meals for senior citizens in our community. We prepare fresh, nutritious meals and welcome all food donations.',
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
        {
          id: '4',
          name: 'Community Pantry Network',
          address: '321 Charity Lane, Westside',
          phone: '(555) 234-5678',
          email: 'donations@communitypantry.org',
          description: 'A network of local pantries serving low-income families. We distribute food packages weekly to over 200 families.',
          acceptedItems: ['pantry', 'grains', 'vegetables', 'fruits', 'beverages'],
          pickupAvailable: true,
          coordinates: { lat: 40.7505, lng: -73.9934 },
          operatingHours: {
            monday: '10:00 AM - 4:00 PM',
            tuesday: '10:00 AM - 4:00 PM',
            wednesday: '10:00 AM - 4:00 PM',
            thursday: '10:00 AM - 4:00 PM',
            friday: '10:00 AM - 4:00 PM',
            saturday: '9:00 AM - 1:00 PM',
            sunday: 'Closed',
          },
          website: 'https://communitypantry.org',
        },
        {
          id: '5',
          name: 'Youth Outreach Center',
          address: '654 Helping Hand Blvd, Eastside',
          phone: '(555) 345-6789',
          email: 'meals@youthoutreach.org',
          description: 'Supporting at-risk youth with meals, education, and life skills. We serve breakfast and dinner daily to 50+ young people.',
          acceptedItems: ['snacks', 'beverages', 'fruits', 'dairy', 'frozen'],
          pickupAvailable: false,
          coordinates: { lat: 40.7282, lng: -73.7949 },
          operatingHours: {
            monday: '6:00 AM - 8:00 PM',
            tuesday: '6:00 AM - 8:00 PM',
            wednesday: '6:00 AM - 8:00 PM',
            thursday: '6:00 AM - 8:00 PM',
            friday: '6:00 AM - 8:00 PM',
            saturday: '8:00 AM - 6:00 PM',
            sunday: '8:00 AM - 6:00 PM',
          },
          website: 'https://youthoutreach.org',
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
    if (this.GOOGLE_MAPS_API_KEY && this.GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
      return `https://www.google.com/maps/embed/v1/view?key=${this.GOOGLE_MAPS_API_KEY}&center=${location.lat},${location.lng}&zoom=${zoom}`;
    }
    
    // Fallback to regular Google Maps link
    return `https://www.google.com/maps/@${location.lat},${location.lng},${zoom}z`;
  }

  static getStaticMapUrl(location: MapLocation, markers: MapLocation[] = [], zoom: number = 13): string {
    if (this.GOOGLE_MAPS_API_KEY && this.GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
      let url = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=${zoom}&size=600x400&key=${this.GOOGLE_MAPS_API_KEY}`;
      
      // Add markers
      markers.forEach((marker, index) => {
        url += `&markers=color:red%7Clabel:${index + 1}%7C${marker.lat},${marker.lng}`;
      });
      
      return url;
    }
    
    return '';
  }

  private static parseGooglePlaceToCharity(place: any): Charity {
    // This would be used when integrating with actual Google Places API
    return {
      id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address,
      phone: place.formatted_phone_number || 'Contact for phone',
      email: 'contact@charity.org', // Would need to be obtained separately
      description: place.editorial_summary?.overview || 'Local charity organization',
      acceptedItems: ['vegetables', 'fruits', 'pantry'], // Default, would need separate data source
      pickupAvailable: false, // Would need to be determined separately
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      website: place.website,
    };
  }
}