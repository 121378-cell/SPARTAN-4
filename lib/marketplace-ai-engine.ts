/**
 * AI Recommendation Engine for SPARTAN 4 Marketplace
 * Provides personalized product recommendations based on user preferences and fitness goals
 */

import type { 
  Product, 
  EquipmentProduct, 
  ClothingProduct, 
  SupplementsProduct, 
  ServicesProduct,
  MarketplacePreferences, 
  RecommendationResult,
  AIValidationResult
} from './marketplace-types';
import type { UserData } from './types';

export class MarketplaceAIEngine {
  private products: Product[] = [];
  private aiValidations: Map<string, AIValidationResult> = new Map();

  constructor() {
    // Initialize with sample products
    this.initializeSampleProducts();
  }

  /**
   * Initialize the marketplace with sample products
   */
  private initializeSampleProducts(): void {
    // Sample equipment products
    const equipmentProducts: EquipmentProduct[] = [
      {
        id: 'equip-001',
        name: 'Barra Olímpica Profesional',
        description: 'Barra olímpica de acero con recubrimiento cromo, capacidad de 300kg',
        category: 'equipment',
        subcategory: 'free_weights',
        price: 299.99,
        currency: 'USD',
        images: ['/images/barbell.jpg'],
        brand: 'SPARTAN PRO',
        rating: 4.8,
        reviewCount: 124,
        tags: ['olympic', 'powerlifting', 'strength'],
        specifications: {
          material: 'Acero cromo',
          weight: 20,
          length: 220,
          loadCapacity: 300
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        weight: 20,
        material: 'Acero cromo',
        warranty: '2 años'
      },
      {
        id: 'equip-002',
        name: 'Mancuernas Ajustables SPARTAN X1',
        description: 'Mancuernas ajustables de 5-25kg con sistema de bloqueo rápido',
        category: 'equipment',
        subcategory: 'free_weights',
        price: 349.99,
        currency: 'USD',
        images: ['/images/dumbbells.jpg'],
        brand: 'SPARTAN FITNESS',
        rating: 4.7,
        reviewCount: 89,
        tags: ['adjustable', 'home gym', 'strength'],
        specifications: {
          material: 'Acero y plástico',
          weightRange: '5-25kg',
          adjustmentMechanism: 'Quick-lock'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        weight: 25,
        material: 'Acero y plástico',
        warranty: '1 año'
      }
    ];

    // Sample clothing products
    const clothingProducts: ClothingProduct[] = [
      {
        id: 'cloth-001',
        name: 'Camiseta Técnica SPARTAN Elite',
        description: 'Camiseta de compresión de alto rendimiento con tecnología de secado rápido',
        category: 'clothing',
        subcategory: 'tops',
        price: 49.99,
        currency: 'USD',
        images: ['/images/tshirt.jpg'],
        brand: 'SPARTAN SPORTSWEAR',
        rating: 4.6,
        reviewCount: 203,
        tags: ['compression', 'moisture-wicking', 'performance'],
        specifications: {
          material: '90% Poliéster, 10% Elastano',
          fit: 'Slim',
          care: 'Lavar a máquina'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        sizeOptions: ['S', 'M', 'L', 'XL'],
        colorOptions: ['Negro', 'Gris', 'Azul'],
        material: '90% Poliéster, 10% Elastano',
        fit: 'Slim'
      }
    ];

    // Sample supplement products
    const supplementProducts: SupplementsProduct[] = [
      {
        id: 'supp-001',
        name: 'Whey Protein SPARTAN ISO',
        description: 'Proteína de suero aislada con 25g de proteína por porción, sin lactosa',
        category: 'supplements',
        subcategory: 'protein',
        price: 39.99,
        currency: 'USD',
        images: ['/images/whey.jpg'],
        brand: 'SPARTAN NUTRITION',
        rating: 4.9,
        reviewCount: 342,
        tags: ['whey', 'isolate', 'lactose-free'],
        specifications: {
          proteinPerServing: '25g',
          caloriesPerServing: 120,
          flavors: '5 opciones'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        servingSize: '30g',
        servingsPerContainer: 30,
        ingredients: ['Whey Protein Isolate', 'Cocoa Powder', 'Natural Flavors'],
        allergens: ['Leche'],
        certifications: ['Informed Sport', 'GMP'],
        flavorOptions: ['Chocolate', 'Vainilla', 'Fresa'],
        isVegan: false,
        isGlutenFree: true
      }
    ];

    // Sample service products
    const serviceProducts: ServicesProduct[] = [
      {
        id: 'serv-001',
        name: 'Programa Personalizado de 12 Semanas',
        description: 'Programa de entrenamiento personalizado basado en tus objetivos y nivel',
        category: 'services',
        subcategory: 'online_programs',
        price: 99.99,
        currency: 'USD',
        images: ['/images/program.jpg'],
        brand: 'SPARTAN COACHING',
        rating: 4.8,
        reviewCount: 76,
        tags: ['personalized', '12-week', 'strength'],
        specifications: {
          duration: '12 semanas',
          format: 'online',
          experienceLevel: 'all'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        duration: '12 semanas',
        format: 'online',
        languageOptions: ['es', 'en']
      }
    ];

    // Combine all products
    this.products = [
      ...equipmentProducts,
      ...clothingProducts,
      ...supplementProducts,
      ...serviceProducts
    ];

    // Initialize AI validations
    this.initializeAIValidations();
  }

  /**
   * Initialize AI validation results for products
   */
  private initializeAIValidations(): void {
    this.products.forEach(product => {
      const validationResult: AIValidationResult = {
        productId: product.id,
        isValid: true,
        validationScore: Math.floor(Math.random() * 20) + 80, // 80-100
        validationCriteria: {
          qualityScore: Math.floor(Math.random() * 20) + 80,
          authenticityScore: Math.floor(Math.random() * 20) + 80,
          safetyScore: Math.floor(Math.random() * 20) + 80,
          effectivenessScore: Math.floor(Math.random() * 20) + 80
        },
        flaggedIssues: [],
        recommendations: [],
        lastValidated: new Date()
      };
      this.aiValidations.set(product.id, validationResult);
    });
  }

  /**
   * Get AI validation result for a product
   */
  public getAIValidation(productId: string): AIValidationResult | undefined {
    return this.aiValidations.get(productId);
  }

  /**
   * Generate personalized recommendations for a user
   */
  public generateRecommendations(
    userPreferences: MarketplacePreferences,
    userData: UserData
  ): RecommendationResult[] {
    console.log('🤖 Generating AI recommendations for user', userData.name);
    
    // Filter active products
    const activeProducts = this.products.filter(product => product.isActive);
    
    // Score each product based on user preferences
    const scoredProducts = activeProducts.map(product => {
      const score = this.calculateProductScore(product, userPreferences, userData);
      const reasons = this.generateRecommendationReasons(product, userPreferences, userData);
      
      return {
        productId: product.id,
        productName: product.name,
        product,
        relevanceScore: score.totalScore,
        reasons,
        categoryMatch: score.categoryMatch,
        goalAlignment: score.goalAlignment,
        budgetCompatibility: score.budgetCompatibility,
        equipmentGap: score.equipmentGap
      };
    });
    
    // Sort by relevance score (descending)
    scoredProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Return top 10 recommendations
    return scoredProducts.slice(0, 10);
  }

  /**
   * Calculate product score based on user preferences
   */
  private calculateProductScore(
    product: Product,
    preferences: MarketplacePreferences,
    userData: UserData
  ): {
    totalScore: number;
    categoryMatch: boolean;
    goalAlignment: number;
    budgetCompatibility: boolean;
    equipmentGap: boolean;
  } {
    let totalScore = 0;
    let categoryMatch = false;
    let goalAlignment = 0;
    let budgetCompatibility = true;
    let equipmentGap = false;
    
    // Category matching (+30 points)
    if (this.isCategoryRelevant(product.category, preferences)) {
      totalScore += 30;
      categoryMatch = true;
    }
    
    // Goal alignment (+25 points)
    goalAlignment = this.calculateGoalAlignment(product, preferences.goals);
    totalScore += Math.round(goalAlignment * 0.25);
    
    // Budget compatibility (+20 points)
    if (this.isBudgetCompatible(product.price, preferences.budgetRange)) {
      totalScore += 20;
      budgetCompatibility = true;
    }
    
    // Equipment gap analysis (+15 points)
    if (this.fillsEquipmentGap(product, preferences.equipment)) {
      totalScore += 15;
      equipmentGap = true;
    }
    
    // Brand preference (+10 points)
    if (preferences.preferredBrands?.includes(product.brand)) {
      totalScore += 10;
    }
    
    // AI validation score (+10 points)
    const aiValidation = this.aiValidations.get(product.id);
    if (aiValidation && aiValidation.isValid) {
      totalScore += Math.round(aiValidation.validationScore * 0.1);
    }
    
    // Cap at 100
    totalScore = Math.min(totalScore, 100);
    
    return {
      totalScore,
      categoryMatch,
      goalAlignment,
      budgetCompatibility,
      equipmentGap
    };
  }

  /**
   * Check if product category is relevant to user preferences
   */
  private isCategoryRelevant(
    category: string,
    preferences: MarketplacePreferences
  ): boolean {
    // For home training users, prioritize home gym equipment
    if (preferences.trainingLocation === 'home' && category === 'equipment') {
      return true;
    }
    
    // For gym users, all categories are relevant
    if (preferences.trainingLocation === 'gym') {
      return true;
    }
    
    // For outdoor training, prioritize clothing and accessories
    if (preferences.trainingLocation === 'outdoor' && 
        (category === 'clothing' || category === 'equipment')) {
      return true;
    }
    
    return false;
  }

  /**
   * Calculate goal alignment score
   */
  private calculateGoalAlignment(product: Product, goals: string[]): number {
    let alignmentScore = 0;
    
    // Define goal-to-category mappings
    const goalMappings: Record<string, string[]> = {
      'muscle gain': ['equipment', 'supplements'],
      'Muscle Gain': ['equipment', 'supplements'],
      'weight loss': ['clothing', 'supplements'],
      'Weight Loss': ['clothing', 'supplements'],
      'endurance': ['clothing', 'supplements'],
      'Endurance': ['clothing', 'supplements'],
      'strength': ['equipment', 'supplements'],
      'Strength': ['equipment', 'supplements'],
      'flexibility': ['clothing'],
      'Flexibility': ['clothing'],
      'recovery': ['supplements'],
      'Recovery': ['supplements']
    };
    
    goals.forEach(goal => {
      const relevantCategories = goalMappings[goal] || [];
      if (relevantCategories.includes(product.category)) {
        alignmentScore += 25; // Increased from 20 to 25 to ensure better alignment
      }
    });
    
    return Math.min(alignmentScore, 100);
  }

  /**
   * Check if product is within user's budget
   */
  private isBudgetCompatible(
    price: number,
    budgetRange?: { min: number; max: number }
  ): boolean {
    if (!budgetRange) return true;
    return price >= budgetRange.min && price <= budgetRange.max;
  }

  /**
   * Check if product fills a gap in user's equipment
   */
  private fillsEquipmentGap(
    product: Product,
    equipment: any
  ): boolean {
    if (product.category !== 'equipment') return false;
    
    // For equipment products, check if user already has similar items
    switch (product.subcategory) {
      case 'free_weights':
        // If user doesn't have dumbbells or barbell, recommend
        return !equipment.dumbbells || !equipment.barbell;
      case 'machines':
        return !equipment.machine;
      case 'accessories':
        // Always relevant as accessories complement other equipment
        return true;
      default:
        return false;
    }
  }

  /**
   * Generate reasons for product recommendations
   */
  private generateRecommendationReasons(
    product: Product,
    preferences: MarketplacePreferences,
    userData: UserData
  ): string[] {
    const reasons: string[] = [];
    
    // Category relevance
    if (this.isCategoryRelevant(product.category, preferences)) {
      reasons.push(`Relevante para entrenamiento ${preferences.trainingLocation}`);
    }
    
    // Goal alignment
    const goalAlignment = this.calculateGoalAlignment(product, preferences.goals);
    if (goalAlignment > 50) {
      reasons.push(`Alineado con tus objetivos: ${preferences.goals.join(', ')}`);
    }
    
    // Budget compatibility
    if (this.isBudgetCompatible(product.price, preferences.budgetRange)) {
      reasons.push('Dentro de tu rango presupuestario');
    }
    
    // Equipment gap
    if (this.fillsEquipmentGap(product, preferences.equipment)) {
      reasons.push('Completa tu equipamiento actual');
    }
    
    // Brand preference
    if (preferences.preferredBrands?.includes(product.brand)) {
      reasons.push(`Marca preferida: ${product.brand}`);
    }
    
    // High rating
    if (product.rating >= 4.5) {
      reasons.push(`Excelente calificación: ${product.rating}/5`);
    }
    
    // AI validation
    const aiValidation = this.aiValidations.get(product.id);
    if (aiValidation && aiValidation.isValid && aiValidation.validationScore >= 90) {
      reasons.push('Validado por IA como producto de alta calidad');
    }
    
    // For beginners
    if (userData.fitnessLevel === 'beginner') {
      reasons.push('Adecuado para principiantes');
    }
    
    return reasons;
  }

  /**
   * Search products by query
   */
  public searchProducts(query: string): Product[] {
    if (!query) return this.products;
    
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.subcategory.toString().toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter products by category
   */
  public filterByCategory(category: string): Product[] {
    return this.products.filter(product => product.category === category);
  }

  /**
   * Filter products by price range
   */
  public filterByPriceRange(min: number, max: number): Product[] {
    return this.products.filter(product => 
      product.price >= min && product.price <= max
    );
  }

  /**
   * Sort products by different criteria
   */
  public sortProducts(
    products: Product[], 
    sortBy: 'price' | 'rating' | 'name' | 'newest'
  ): Product[] {
    switch (sortBy) {
      case 'price':
        return [...products].sort((a, b) => a.price - b.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return [...products].sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
      default:
        return products;
    }
  }

  /**
   * Get featured products
   */
  public getFeaturedProducts(): Product[] {
    // Return top-rated products
    return this.sortProducts(this.products, 'rating').slice(0, 6);
  }

  /**
   * Get products by brand
   */
  public getProductsByBrand(brand: string): Product[] {
    return this.products.filter(product => product.brand === brand);
  }
}

// Export singleton instance
export const marketplaceAIEngine = new MarketplaceAIEngine();