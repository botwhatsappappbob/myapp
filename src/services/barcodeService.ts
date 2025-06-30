import { BarcodeProduct, FoodCategory } from '../types';

// Mock barcode database - In production, this would integrate with Open Food Facts API or similar
const mockBarcodeDatabase: Record<string, BarcodeProduct> = {
  '0123456789012': {
    barcode: '0123456789012',
    name: 'Organic Whole Milk',
    brand: 'Organic Valley',
    category: 'dairy',
    imageUrl: 'https://images.pexels.com/photos/416488/pexels-photo-416488.jpeg?auto=compress&cs=tinysrgb&w=300',
    nutritionalInfo: {
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
      fiber: 0,
      sugar: 12,
    },
    commonUnits: ['liter', 'gallon', 'cup'],
  },
  '0987654321098': {
    barcode: '0987654321098',
    name: 'Fresh Bananas',
    brand: 'Dole',
    category: 'fruits',
    imageUrl: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300',
    nutritionalInfo: {
      calories: 105,
      protein: 1,
      carbs: 27,
      fat: 0,
      fiber: 3,
      sugar: 14,
    },
    commonUnits: ['pieces', 'bunch', 'lbs'],
  },
  '1234567890123': {
    barcode: '1234567890123',
    name: 'Organic Tomatoes',
    brand: 'Nature\'s Best',
    category: 'vegetables',
    imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=300',
    nutritionalInfo: {
      calories: 22,
      protein: 1,
      carbs: 5,
      fat: 0,
      fiber: 1,
      sugar: 3,
    },
    commonUnits: ['pieces', 'lbs', 'kg'],
  },
  '5432109876543': {
    barcode: '5432109876543',
    name: 'Chicken Breast',
    brand: 'Fresh Farm',
    category: 'meat',
    imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300',
    nutritionalInfo: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 4,
      fiber: 0,
      sugar: 0,
    },
    commonUnits: ['lbs', 'kg', 'pieces'],
  },
};

export class BarcodeService {
  static async lookupProduct(barcode: string): Promise<BarcodeProduct | null> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check mock database first
      if (mockBarcodeDatabase[barcode]) {
        return mockBarcodeDatabase[barcode];
      }

      // In production, this would call Open Food Facts API or similar
      // const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      // const data = await response.json();
      
      // For now, return null if not found in mock data
      return null;
    } catch (error) {
      console.error('Error looking up barcode:', error);
      return null;
    }
  }

  static async searchProducts(query: string): Promise<BarcodeProduct[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Search mock database
      const results = Object.values(mockBarcodeDatabase).filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.toLowerCase().includes(query.toLowerCase())
      );
      
      return results;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  static getCategoryFromProduct(productName: string): FoodCategory {
    const name = productName.toLowerCase();
    
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || name.includes('butter')) {
      return 'dairy';
    }
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || name.includes('meat')) {
      return 'meat';
    }
    if (name.includes('fish') || name.includes('salmon') || name.includes('tuna') || name.includes('seafood')) {
      return 'seafood';
    }
    if (name.includes('apple') || name.includes('banana') || name.includes('orange') || name.includes('berry')) {
      return 'fruits';
    }
    if (name.includes('tomato') || name.includes('lettuce') || name.includes('carrot') || name.includes('spinach')) {
      return 'vegetables';
    }
    if (name.includes('rice') || name.includes('bread') || name.includes('pasta') || name.includes('cereal')) {
      return 'grains';
    }
    if (name.includes('juice') || name.includes('soda') || name.includes('water') || name.includes('coffee')) {
      return 'beverages';
    }
    if (name.includes('chips') || name.includes('cookies') || name.includes('candy') || name.includes('snack')) {
      return 'snacks';
    }
    if (name.includes('frozen')) {
      return 'frozen';
    }
    
    return 'pantry';
  }
}