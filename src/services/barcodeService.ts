import { BarcodeProduct, FoodCategory } from '../types';

// Enhanced mock barcode database with more realistic data
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
    commonUnits: ['liter', 'gallon', 'cup', 'ml'],
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
    commonUnits: ['pieces', 'bunch', 'lbs', 'kg'],
  },
  '1234567890123': {
    barcode: '1234567890123',
    name: 'Organic Roma Tomatoes',
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
    commonUnits: ['pieces', 'lbs', 'kg', 'oz'],
  },
  '5432109876543': {
    barcode: '5432109876543',
    name: 'Boneless Chicken Breast',
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
    commonUnits: ['lbs', 'kg', 'pieces', 'oz'],
  },
  '1111222233334': {
    barcode: '1111222233334',
    name: 'Whole Wheat Bread',
    brand: 'Dave\'s Killer Bread',
    category: 'grains',
    imageUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=300',
    nutritionalInfo: {
      calories: 110,
      protein: 5,
      carbs: 22,
      fat: 2,
      fiber: 5,
      sugar: 5,
    },
    commonUnits: ['loaf', 'slices', 'pieces'],
  },
  '2222333344445': {
    barcode: '2222333344445',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    category: 'dairy',
    imageUrl: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=300',
    nutritionalInfo: {
      calories: 100,
      protein: 15,
      carbs: 6,
      fat: 0,
      fiber: 0,
      sugar: 4,
    },
    commonUnits: ['container', 'cup', 'oz', 'ml'],
  },
  '3333444455556': {
    barcode: '3333444455556',
    name: 'Atlantic Salmon Fillet',
    brand: 'Wild Planet',
    category: 'seafood',
    imageUrl: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=300',
    nutritionalInfo: {
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
    },
    commonUnits: ['fillet', 'lbs', 'kg', 'oz'],
  },
  '4444555566667': {
    barcode: '4444555566667',
    name: 'Organic Baby Spinach',
    brand: 'Earthbound Farm',
    category: 'vegetables',
    imageUrl: 'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&cs=tinysrgb&w=300',
    nutritionalInfo: {
      calories: 7,
      protein: 1,
      carbs: 1,
      fat: 0,
      fiber: 1,
      sugar: 0,
    },
    commonUnits: ['bag', 'oz', 'cups', 'handful'],
  },
};

export class BarcodeService {
  private static readonly OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

  static async lookupProduct(barcode: string): Promise<BarcodeProduct | null> {
    try {
      // Validate barcode format
      if (!this.isValidBarcode(barcode)) {
        throw new Error('Invalid barcode format');
      }

      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check mock database first for demo purposes
      if (mockBarcodeDatabase[barcode]) {
        return mockBarcodeDatabase[barcode];
      }

      // In production, this would call Open Food Facts API
      try {
        const response = await fetch(`${this.OPEN_FOOD_FACTS_API}/${barcode}.json`);
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
          return this.parseOpenFoodFactsProduct(data.product, barcode);
        }
      } catch (apiError) {
        console.warn('Open Food Facts API unavailable, using fallback');
      }
      
      // Return null if not found in any source
      return null;
    } catch (error) {
      console.error('Error looking up barcode:', error);
      throw new Error('Failed to lookup product information');
    }
  }

  private static parseOpenFoodFactsProduct(product: any, barcode: string): BarcodeProduct {
    return {
      barcode,
      name: product.product_name || 'Unknown Product',
      brand: product.brands?.split(',')[0]?.trim() || undefined,
      category: this.getCategoryFromProduct(product.product_name || '', product.categories || ''),
      imageUrl: product.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
      nutritionalInfo: product.nutriments ? {
        calories: product.nutriments['energy-kcal_100g'],
        protein: product.nutriments.proteins_100g,
        carbs: product.nutriments.carbohydrates_100g,
        fat: product.nutriments.fat_100g,
        fiber: product.nutriments.fiber_100g,
        sugar: product.nutriments.sugars_100g,
      } : undefined,
      commonUnits: this.getCommonUnitsForCategory(this.getCategoryFromProduct(product.product_name || '', product.categories || '')),
    };
  }

  static async searchProducts(query: string): Promise<BarcodeProduct[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

  static getCategoryFromProduct(productName: string, categories: string = ''): FoodCategory {
    const name = productName.toLowerCase();
    const cats = categories.toLowerCase();
    
    // Check categories first if available
    if (cats.includes('dairy') || cats.includes('milk') || cats.includes('cheese') || cats.includes('yogurt')) {
      return 'dairy';
    }
    if (cats.includes('meat') || cats.includes('poultry') || cats.includes('beef') || cats.includes('chicken')) {
      return 'meat';
    }
    if (cats.includes('fish') || cats.includes('seafood') || cats.includes('salmon')) {
      return 'seafood';
    }
    if (cats.includes('fruit') || cats.includes('apple') || cats.includes('banana')) {
      return 'fruits';
    }
    if (cats.includes('vegetable') || cats.includes('tomato') || cats.includes('spinach')) {
      return 'vegetables';
    }
    if (cats.includes('bread') || cats.includes('cereal') || cats.includes('grain')) {
      return 'grains';
    }
    if (cats.includes('beverage') || cats.includes('drink') || cats.includes('juice')) {
      return 'beverages';
    }
    if (cats.includes('snack') || cats.includes('chip') || cats.includes('cookie')) {
      return 'snacks';
    }
    if (cats.includes('frozen')) {
      return 'frozen';
    }

    // Fallback to product name analysis
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

  private static getCommonUnitsForCategory(category: FoodCategory): string[] {
    const unitMap: Record<FoodCategory, string[]> = {
      vegetables: ['pieces', 'lbs', 'kg', 'oz', 'cups', 'bag'],
      fruits: ['pieces', 'lbs', 'kg', 'oz', 'cups', 'bag'],
      dairy: ['liter', 'gallon', 'cup', 'ml', 'oz', 'container'],
      meat: ['lbs', 'kg', 'oz', 'pieces', 'fillet'],
      seafood: ['lbs', 'kg', 'oz', 'pieces', 'fillet'],
      grains: ['lbs', 'kg', 'cups', 'oz', 'loaf', 'bag'],
      pantry: ['pieces', 'cans', 'jars', 'boxes', 'bags'],
      frozen: ['lbs', 'kg', 'oz', 'pieces', 'bags'],
      beverages: ['liter', 'ml', 'oz', 'cups', 'bottles'],
      snacks: ['pieces', 'bags', 'oz', 'boxes'],
    };
    
    return unitMap[category] || ['pieces', 'lbs', 'oz'];
  }

  private static isValidBarcode(barcode: string): boolean {
    // Check if barcode is a valid format (8-13 digits)
    const cleanBarcode = barcode.replace(/\D/g, '');
    return cleanBarcode.length >= 8 && cleanBarcode.length <= 13;
  }

  static generateMockBarcode(): string {
    // Generate a random 12-digit barcode for testing
    return Math.random().toString().slice(2, 14);
  }
}