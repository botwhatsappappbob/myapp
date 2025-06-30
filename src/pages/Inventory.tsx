import React, { useState } from 'react';
import { Plus, Search, Camera } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import CategoryFilter from '../components/Inventory/CategoryFilter';
import FoodItemCard from '../components/Inventory/FoodItemCard';
import EnhancedAddItemModal from '../components/Inventory/EnhancedAddItemModal';
import BarcodeScanner from '../components/Inventory/BarcodeScanner';
import { mockFoodItems } from '../data/mockData';
import { FoodItem, FoodCategory, BarcodeProduct } from '../types';

export default function Inventory() {
  const [items, setItems] = useState<FoodItem[]>(mockFoodItems);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<BarcodeProduct | null>(null);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = (newItem: FoodItem) => {
    setItems([...items, newItem]);
    setScannedProduct(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleProductScanned = (product: BarcodeProduct) => {
    setScannedProduct(product);
    setIsScannerOpen(false);
    setIsAddModalOpen(true);
  };

  const handleQuickScan = () => {
    setScannedProduct(null);
    setIsScannerOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Inventory</h1>
            <p className="text-gray-600 mt-2">
              Manage your food items and track expiration dates
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleQuickScan}
              className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>Quick Scan</span>
            </button>
            <button
              onClick={() => {
                setScannedProduct(null);
                setIsAddModalOpen(true);
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{items.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">
              {items.filter(item => {
                const daysUntilExpiration = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiration <= 3 && daysUntilExpiration >= 0;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Expiring Soon</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {items.filter(item => {
                const daysUntilExpiration = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiration < 0;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Expired</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {items.filter(item => item.barcode).length}
            </div>
            <div className="text-sm text-gray-600">Scanned Items</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search food items, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodItemCard
              key={item.id}
              item={item}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Try adjusting your search or filters"
                : "Start by scanning or adding your first food item"
              }
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleQuickScan}
                className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Scan Barcode</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Manually</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <EnhancedAddItemModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setScannedProduct(null);
        }}
        onAdd={handleAddItem}
        prefilledProduct={scannedProduct}
      />

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductFound={handleProductScanned}
        onManualEntry={() => {
          setIsScannerOpen(false);
          setIsAddModalOpen(true);
        }}
      />
    </Layout>
  );
}