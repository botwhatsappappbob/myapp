export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  purchaseDate: Date;
  expirationDate: Date;
  storageLocation: StorageLocation;
  imageUrl?: string;
  notes?: string;
  barcode?: string;
  brand?: string;
  nutritionalInfo?: NutritionalInfo;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  category?: FoodCategory;
  imageUrl?: string;
  nutritionalInfo?: NutritionalInfo;
  commonUnits?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  cuisine: string;
  mealType: MealType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
  matchPercentage?: number;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  optional?: boolean;
}

export interface DonationItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  donationDate: Date;
  charity?: Charity;
  status: DonationStatus;
  pickupScheduled?: Date;
  notes?: string;
}

export interface Charity {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  acceptedItems: FoodCategory[];
  pickupAvailable: boolean;
  operatingHours?: OperatingHours;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distance?: number;
  website?: string;
}

export interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'individual' | 'business';
  preferences: UserPreferences;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  alertSettings: AlertSettings;
  defaultUnits: Record<FoodCategory, string>;
}

export interface AlertSettings {
  expirationDays: number;
  enableEmailAlerts: boolean;
  enablePushNotifications: boolean;
  donationReminders: boolean;
}

export type FoodCategory = 
  | 'vegetables' 
  | 'fruits' 
  | 'dairy' 
  | 'meat' 
  | 'seafood' 
  | 'grains' 
  | 'pantry' 
  | 'frozen' 
  | 'beverages' 
  | 'snacks';

export type StorageLocation = 'fridge' | 'freezer' | 'pantry' | 'counter';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';

export type DonationStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';

export interface WasteReport {
  totalItemsWasted: number;
  wasteByCategory: Record<FoodCategory, number>;
  estimatedCostWasted: number;
  wasteReductionTrend: number;
  topWastedItems: string[];
}

export interface CostSavings {
  totalSaved: number;
  savingsThisMonth: number;
  wasteReduced: number;
  recipesUsed: number;
  donationValue: number;
}

export interface ConsumptionRecord {
  id: string;
  foodItemId: string;
  quantityConsumed: number;
  consumptionDate: Date;
  method: 'recipe' | 'direct' | 'donation';
  recipeId?: string;
  donationId?: string;
}