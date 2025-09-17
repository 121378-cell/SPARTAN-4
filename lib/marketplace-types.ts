/**
 * Types for the SPARTAN 4 Marketplace System
 */

// Product categories
export type ProductCategory = 
  | 'equipment'      // Equipment like dumbbells, barbells, etc.
  | 'clothing'       // Athletic wear, shoes, accessories
  | 'supplements'    // Protein powders, vitamins, pre-workouts
  | 'services';      // Personal training, nutrition coaching, etc.

// Product subcategories
export type EquipmentSubcategory = 
  | 'free_weights'     // Dumbbells, barbells, kettlebells
  | 'machines'         // Treadmills, rowers, cable machines
  | 'accessories'      // Belts, wraps, gloves
  | 'wearables'        // Smartwatches, fitness trackers
  | 'home_gym';        // Power racks, squat stands, benches

export type ClothingSubcategory = 
  | 'tops'             // Shirts, tanks, hoodies
  | 'bottoms'          // Shorts, pants, leggings
  | 'shoes'            // Running shoes, training shoes, lifting shoes
  | 'accessories';     // Hats, socks, bags

export type SupplementsSubcategory = 
  | 'protein'          // Whey, casein, plant-based proteins
  | 'pre_workout'      // Pre-workout supplements
  | 'post_workout'     // Recovery, BCAAs, creatine
  | 'health'           // Vitamins, minerals, probiotics
  | 'specialty';       // Fat burners, testosterone boosters, etc.

export type ServicesSubcategory = 
  | 'personal_training'    // One-on-one coaching
  | 'nutrition_coaching'   // Meal planning, macro guidance
  | 'online_programs'      // Digital workout plans
  | 'recovery'             // Massage, physiotherapy
  | 'consulting';          // Sports nutritionist, fitness consultant

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  subcategory: EquipmentSubcategory | ClothingSubcategory | SupplementsSubcategory | ServicesSubcategory;
  price: number;
  currency: string;
  images: string[];
  brand: string;
  rating: number; // 0-5
  reviewCount: number;
  tags: string[];
  specifications: Record<string, string | number | boolean>;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Equipment product interface
export interface EquipmentProduct extends Product {
  category: 'equipment';
  subcategory: EquipmentSubcategory;
  weight?: number; // in kg
  dimensions?: string; // e.g., "50x30x20 cm"
  material?: string; // e.g., "steel", "rubber", "aluminum"
  warranty?: string; // e.g., "2 years"
  compatibility?: string[]; // e.g., ["power rack", "bench"]
}

// Clothing product interface
export interface ClothingProduct extends Product {
  category: 'clothing';
  subcategory: ClothingSubcategory;
  sizeOptions: string[];
  colorOptions: string[];
  material?: string; // e.g., "cotton", "polyester", "spandex"
  fit?: string; // e.g., "slim", "regular", "loose"
  careInstructions?: string;
}

// Supplements product interface
export interface SupplementsProduct extends Product {
  category: 'supplements';
  subcategory: SupplementsSubcategory;
  servingSize: string; // e.g., "1 scoop (30g)"
  servingsPerContainer: number;
  ingredients: string[];
  allergens: string[];
  certifications: string[]; // e.g., ["Informed Sport", "GMP", "Kosher"]
  flavorOptions?: string[];
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

// Services product interface
export interface ServicesProduct extends Product {
  category: 'services';
  subcategory: ServicesSubcategory;
  duration?: string; // e.g., "60 minutes", "12 weeks"
  format?: 'online' | 'in-person' | 'hybrid';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  languageOptions: string[];
  availability?: string; // e.g., "Mon-Fri 9AM-5PM"
}

// Product review interface
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// User preferences for recommendations
export interface MarketplacePreferences {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[]; // e.g., ["muscle gain", "weight loss", "endurance"]
  trainingLocation: 'gym' | 'home' | 'outdoor';
  equipment: {
    dumbbells: boolean;
    barbell: boolean;
    kettlebells: boolean;
    resistanceBands: boolean;
    pullUpBar: boolean;
    bench: boolean;
    machine: boolean;
  };
  budgetRange?: {
    min: number;
    max: number;
  };
  preferredBrands?: string[];
  sizePreferences?: {
    clothingSize?: string;
    shoeSize?: string;
  };
  dietaryRestrictions?: string[]; // e.g., ["vegan", "gluten-free", "lactose-intolerant"]
  allergies?: string[]; // e.g., ["nuts", "dairy", "soy"]
}

// AI recommendation result
export interface RecommendationResult {
  productId: string;
  productName: string;
  product: Product;
  relevanceScore: number; // 0-100
  reasons: string[]; // Why this product was recommended
  categoryMatch: boolean;
  goalAlignment: number; // 0-100
  budgetCompatibility: boolean;
  equipmentGap: boolean; // Whether this fills a gap in user's equipment
}

// Shopping cart item
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: {
    size?: string;
    color?: string;
    flavor?: string;
  };
}

// Shopping cart
export interface ShoppingCart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

// Order status
export type OrderStatus = 
  | 'pending'      // Order placed but not processed
  | 'processing'   // Order being prepared
  | 'shipped'      // Order sent to customer
  | 'delivered'    // Order received by customer
  | 'cancelled';   // Order cancelled

// Order interface
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

// AI validation result for products
export interface AIValidationResult {
  productId: string;
  isValid: boolean;
  validationScore: number; // 0-100
  validationCriteria: {
    qualityScore: number;
    authenticityScore: number;
    safetyScore: number;
    effectivenessScore: number;
  };
  flaggedIssues: string[];
  recommendations: string[];
  lastValidated: Date;
}