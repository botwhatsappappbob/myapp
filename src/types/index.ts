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
}

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'individual' | 'business';
  preferences: UserPreferences;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  alertSettings: AlertSettings;
}

export interface AlertSettings {
  expirationDays: number;
  enableEmailAlerts: boolean;
  enablePushNotifications: boolean;
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
}

export interface CostSavings {
  totalSaved: number;
  savingsThisMonth: number;
  wasteReduced: number;
  recipesUsed: number;
}