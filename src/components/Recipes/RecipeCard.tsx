import React from 'react';
import { Clock, Users, ChefHat, Star } from 'lucide-react';
import { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(recipe)}
    >
      <div className="relative">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-48 object-cover"
        />
        
        {recipe.matchPercentage && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="h-3 w-3 mr-1" />
            {recipe.matchPercentage}% match
          </div>
        )}
        
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recipe.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {recipe.prepTime + recipe.cookTime} min
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {recipe.servings} servings
          </div>
          <div className="flex items-center">
            <ChefHat className="h-3 w-3 mr-1" />
            {recipe.cuisine}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              {ingredient.name}
            </span>
          ))}
          {recipe.ingredients.length > 3 && (
            <span className="text-gray-400 text-xs px-2 py-1">
              +{recipe.ingredients.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}