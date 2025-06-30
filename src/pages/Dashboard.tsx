import React from 'react';
import { Package, TrendingDown, DollarSign, Heart, AlertTriangle, ChefHat } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import ExpirationAlerts from '../components/Dashboard/ExpirationAlerts';
import WasteChart from '../components/Dashboard/WasteChart';
import Layout from '../components/Layout/Layout';
import { mockFoodItems, mockWasteReport, mockCostSavings } from '../data/mockData';

export default function Dashboard() {
  const expiringItems = mockFoodItems.filter(item => {
    const daysUntilExpiration = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 3;
  });

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your food waste reduction summary.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Items"
            value={mockFoodItems.length}
            change="+3 this week"
            changeType="positive"
            icon={Package}
            color="primary"
          />
          <StatsCard
            title="Items Expiring Soon"
            value={expiringItems.length}
            change={expiringItems.length > 0 ? "Action needed" : "All good!"}
            changeType={expiringItems.length > 0 ? "negative" : "positive"}
            icon={AlertTriangle}
            color="secondary"
          />
          <StatsCard
            title="Money Saved"
            value={`$${mockCostSavings.savingsThisMonth.toFixed(2)}`}
            change="+12% vs last month"
            changeType="positive"
            icon={DollarSign}
            color="accent"
          />
          <StatsCard
            title="Items Donated"
            value={15}
            change="+5 this month"
            changeType="positive"
            icon={Heart}
            color="earth"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpirationAlerts items={mockFoodItems} />
          <WasteChart report={mockWasteReport} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-primary-50 text-primary-600 p-4 rounded-lg hover:bg-primary-100 transition-colors">
              <Package className="h-5 w-5" />
              <span>Add Food Item</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-accent-50 text-accent-600 p-4 rounded-lg hover:bg-accent-100 transition-colors">
              <ChefHat className="h-5 w-5" />
              <span>Find Recipes</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-earth-50 text-earth-600 p-4 rounded-lg hover:bg-earth-100 transition-colors">
              <Heart className="h-5 w-5" />
              <span>Donate Food</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}