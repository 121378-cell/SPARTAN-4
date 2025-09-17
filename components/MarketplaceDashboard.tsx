/**
 * Marketplace Dashboard for SPARTAN 4
 * Personalized recommendations for equipment, clothing, supplements, and services
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge, Progress } from './ui';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  Zap, 
  Heart, 
  Package, 
  Shirt, 
  Coffee, 
  Users,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Award,
  Tag,
  DollarSign
} from 'lucide-react';
import { marketplaceAIEngine } from '../lib/marketplace-ai-engine';
import type { 
  Product, 
  MarketplacePreferences, 
  RecommendationResult,
  ShoppingCart as ShoppingCartType,
  CartItem
} from '../lib/marketplace-types';
import type { UserData } from '../lib/types';

interface MarketplaceDashboardProps {
  userData: UserData;
  onBack: () => void;
  onNavigateToCart?: () => void;
}

export default function MarketplaceDashboard({ 
  userData, 
  onBack,
  onNavigateToCart 
}: MarketplaceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'browse' | 'cart'>('recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<ShoppingCartType>({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: 'USD'
  });
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<MarketplacePreferences>({
    fitnessLevel: userData.fitnessLevel,
    goals: userData.goals,
    trainingLocation: 'gym',
    equipment: {
      dumbbells: false,
      barbell: false,
      kettlebells: false,
      resistanceBands: false,
      pullUpBar: false,
      bench: false,
      machine: false
    },
    budgetRange: { min: 0, max: 500 }
  });

  // Generate recommendations when component mounts or preferences change
  useEffect(() => {
    generateRecommendations();
  }, [preferences, userData]);

  const generateRecommendations = () => {
    setLoading(true);
    try {
      const recs = marketplaceAIEngine.generateRecommendations(preferences, userData);
      setRecommendations(recs);
      
      // Also filter products for browse tab
      const products = marketplaceAIEngine.searchProducts(searchQuery);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = prevCart.items.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        newItems = [
          ...prevCart.items,
          {
            productId: product.id,
            product,
            quantity
          }
        ];
      }
      
      // Recalculate totals
      const subtotal = newItems.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      );
      
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
      const total = subtotal + tax + shipping;
      
      return {
        items: newItems,
        subtotal,
        tax,
        shipping,
        total,
        currency: 'USD'
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.productId !== productId);
      
      // Recalculate totals
      const subtotal = newItems.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      );
      
      const tax = subtotal * 0.08;
      const shipping = subtotal > 100 ? 0 : 9.99;
      const total = subtotal + tax + shipping;
      
      return {
        items: newItems,
        subtotal,
        tax,
        shipping,
        total,
        currency: 'USD'
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newItems = prevCart.items.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      );
      
      // Recalculate totals
      const subtotal = newItems.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      );
      
      const tax = subtotal * 0.08;
      const shipping = subtotal > 100 ? 0 : 9.99;
      const total = subtotal + tax + shipping;
      
      return {
        items: newItems,
        subtotal,
        tax,
        shipping,
        total,
        currency: 'USD'
      };
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'equipment': return <Package className="h-5 w-5" />;
      case 'clothing': return <Shirt className="h-5 w-5" />;
      case 'supplements': return <Coffee className="h-5 w-5" />;
      case 'services': return <Users className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'equipment': return 'bg-blue-100 text-blue-800';
      case 'clothing': return 'bg-green-100 text-green-800';
      case 'supplements': return 'bg-purple-100 text-purple-800';
      case 'services': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRecommendations = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (recommendations.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recomendaciones</h3>
          <p className="text-gray-500">Ajusta tus preferencias para obtener mejores recomendaciones</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <Card key={rec.productId} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-2">{rec.product.name}</CardTitle>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{rec.product.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">({rec.product.reviewCount})</span>
                  </div>
                </div>
                <Badge className={getCategoryColor(rec.product.category)}>
                  {getCategoryIcon(rec.product.category)}
                  <span className="ml-1 capitalize">{rec.product.category}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                {rec.product.images && rec.product.images.length > 0 ? (
                  <img 
                    src={rec.product.images[0]} 
                    alt={rec.product.name} 
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-12 w-12 text-gray-300" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{rec.product.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold">${rec.product.price.toFixed(2)}</span>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">Validado por IA</span>
                </div>
              </div>
              
              {rec.reasons.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center text-sm text-blue-600 mb-1">
                    <Zap className="h-4 w-4 mr-1" />
                    <span>Recomendado porque:</span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {rec.reasons.slice(0, 2).map((reason, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => addToCart(rec.product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
                <Button size="sm">
                  Ver detalles
                </Button>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Relevancia</span>
                  <span>{rec.relevanceScore}%</span>
                </div>
                <Progress value={rec.relevanceScore} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderBrowseProducts = () => {
    return (
      <div>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {['equipment', 'clothing', 'supplements', 'services'].map((category) => (
            <Button
              key={category}
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => {
                const products = marketplaceAIEngine.filterByCategory(category);
                setFilteredProducts(products);
              }}
            >
              {getCategoryIcon(category)}
              <span className="ml-2 capitalize">{category}</span>
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <Badge className={getCategoryColor(product.category)}>
                    {getCategoryIcon(product.category)}
                  </Badge>
                </div>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  <span className="text-sm text-gray-400 ml-1">({product.reviewCount})</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="h-12 w-12 text-gray-300" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">Validado por IA</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                  <Button size="sm">
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCart = () => {
    if (cart.items.length === 0) {
      return (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-500 mb-6">Agrega productos para comenzar tu compra</p>
          <Button onClick={() => setActiveTab('recommendations')}>
            Ver recomendaciones
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="object-cover rounded-lg w-full h-full"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-300" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.brand}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Eliminar
                        </Button>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center border rounded-lg">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="px-2">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <span className="ml-4 font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{cart.shipping === 0 ? 'Gratis' : `$${cart.shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full" size="lg">
                Proceder al pago
              </Button>
              
              <div className="pt-4 border-t">
                <div className="flex items-center text-sm text-green-600 mb-2">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Compra segura garantizada</span>
                </div>
                <div className="flex items-center text-sm text-blue-600">
                  <Award className="h-4 w-4 mr-1" />
                  <span>Productos validados por IA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Marketplace SPARTAN
              </h1>
              <p className="text-sm text-gray-600">
                Recomendaciones personalizadas validadas por IA
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setActiveTab('cart')}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.items.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {cart.items.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex border-b border-gray-200 mb-6">
          <Button
            variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
            size="default"
            onClick={() => setActiveTab('recommendations')}
            className={`rounded-md px-6 py-3 font-semibold transition-all ${
              activeTab === 'recommendations' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Recomendaciones
          </Button>
          <Button
            variant={activeTab === 'browse' ? 'default' : 'ghost'}
            size="default"
            onClick={() => setActiveTab('browse')}
            className={`rounded-md px-6 py-3 font-semibold transition-all ${
              activeTab === 'browse' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Search className="h-5 w-5 mr-2" />
            Explorar
          </Button>
          <Button
            variant={activeTab === 'cart' ? 'default' : 'ghost'}
            size="default"
            onClick={() => setActiveTab('cart')}
            className={`rounded-md px-6 py-3 font-semibold transition-all ${
              activeTab === 'cart' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Carrito
            {cart.items.length > 0 && (
              <Badge className="ml-2 bg-white text-blue-600">
                {cart.items.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'recommendations' && renderRecommendations()}
        {activeTab === 'browse' && renderBrowseProducts()}
        {activeTab === 'cart' && renderCart()}
      </main>
    </div>
  );
}