import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import CharityCard from '../components/Donations/CharityCard';
import { mockCharities, mockDonations } from '../data/mockData';
import { Charity, DonationItem } from '../types';

export default function Donations() {
  const [charities] = useState<Charity[]>(mockCharities);
  const [donations] = useState<DonationItem[]>(mockDonations);

  const handleCharitySelect = (charity: Charity) => {
    // In a real app, this would open a donation form
    console.log('Selected charity:', charity.name);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Food Donations</h1>
          <p className="text-gray-600 mt-2">
            Connect with local charities and donate surplus food
          </p>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
          </div>
          <div className="p-6">
            {donations.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No donations yet</p>
                <p className="text-sm text-gray-400 mt-1">Start donating to make a difference!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={donation.foodItem.imageUrl}
                        alt={donation.foodItem.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{donation.foodItem.name}</p>
                        <p className="text-sm text-gray-600">
                          {donation.quantity} {donation.foodItem.unit} to {donation.charity?.name}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Charities */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Local Charities</h3>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Charity</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((charity) => (
              <CharityCard
                key={charity.id}
                charity={charity}
                onSelect={handleCharitySelect}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}