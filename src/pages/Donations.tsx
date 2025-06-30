import React, { useState } from 'react';
import { Heart, Plus, MapPin } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import CharityMap from '../components/Donations/CharityMap';
import DonationModal from '../components/Donations/DonationModal';
import { mockDonations, mockFoodItems } from '../data/mockData';
import { Charity, DonationItem, FoodItem } from '../types';

export default function Donations() {
  const [donations, setDonations] = useState<DonationItem[]>(mockDonations);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [availableItems] = useState<FoodItem[]>(mockFoodItems);

  const handleCharitySelect = (charity: Charity) => {
    setSelectedCharity(charity);
    setIsDonationModalOpen(true);
  };

  const handleDonationSubmit = (donation: any) => {
    // In a real app, this would create individual donation records for each item
    const newDonations = donation.items.map((item: any, index: number) => ({
      id: `${Date.now()}-${index}`,
      foodItem: item.foodItem,
      quantity: item.quantity,
      donationDate: donation.donationDate,
      charity: donation.charity,
      status: 'scheduled' as const,
      pickupScheduled: donation.requestPickup ? donation.donationDate : undefined,
      notes: donation.message,
    }));

    setDonations([...donations, ...newDonations]);
    setIsDonationModalOpen(false);
    setSelectedCharity(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'scheduled':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const totalDonationValue = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, donation) => sum + (donation.quantity * 2.5), 0); // Estimated $2.50 per unit

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Food Donations</h1>
          <p className="text-gray-600 mt-2">
            Connect with local charities and donate surplus food to help your community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{donations.length}</div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {donations.filter(d => d.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {donations.filter(d => d.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-2xl font-bold text-primary-600">
              ${totalDonationValue.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Estimated Value</div>
          </div>
        </div>

        {/* Charity Map */}
        <CharityMap onCharitySelect={handleCharitySelect} />

        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
              <button
                onClick={() => setIsDonationModalOpen(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Donation</span>
              </button>
            </div>
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
                {donations.slice().reverse().map((donation) => (
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
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {donation.charity?.address}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(donation.status)}`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(donation.donationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => {
          setIsDonationModalOpen(false);
          setSelectedCharity(null);
        }}
        charity={selectedCharity}
        availableItems={availableItems}
        onSubmit={handleDonationSubmit}
      />
    </Layout>
  );
}