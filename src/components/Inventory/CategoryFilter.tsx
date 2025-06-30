import React from 'react';
import { FoodCategory } from '../../types';

interface CategoryFilterProps {
  selectedCategory: FoodCategory | 'all';
  onCategoryChange: (category: FoodCategory | 'all') => void;
}

const categories: Array<{ value: FoodCategory | 'all'; label: string; emoji: string }> = [
  { value: 'all', label: 'All Items', emoji: '🗂️' },
  { value: 'vegetables', label: 'Vegetables', emoji: '🥕' },
  { value: 'fruits', label: 'Fruits', emoji: '🍎' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'meat', label: 'Meat', emoji: '🥩' },
  { value: 'seafood', label: 'Seafood', emoji: '🐟' },
  { value: 'grains', label: 'Grains', emoji: '🌾' },
  { value: 'pantry', label: 'Pantry', emoji: '🥫' },
  { value: 'frozen', label: 'Frozen', emoji: '❄️' },
  { value: 'beverages', label: 'Beverages', emoji: '🥤' },
  { value: 'snacks', label: 'Snacks', emoji: '🍿' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.value
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1">{category.emoji}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
}