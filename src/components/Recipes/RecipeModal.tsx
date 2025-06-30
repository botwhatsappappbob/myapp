import React from 'react';
import { X, Clock, Users, ChefHat, Check } from 'lucide-react';
import { Recipe } from '../../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onCook?: (recipe: Recipe) => void;
}

export default function RecipeModal({ recipe, isOpen, onClose, onCook }: RecipeModalProps) {
  if (!isOpen || !recipe) return null;

  const handleCook = () => {
    onCook?.(recipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h2>
              <p className="text-gray-600">{recipe.description}</p>
            </div>
            {recipe.matchPercentage && (
              <div className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                {recipe.matchPercentage}% match
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
              <div className="text-sm text-gray-600">Prep</div>
              <div className="font-semibold">{recipe.prepTime}m</div>
            </div>
            <div className="text-center">
              <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
              <div className="text-sm text-gray-600">Cook</div>
              <div className="font-semibold">{recipe.cookTime}m</div>
            </div>
            <div className="text-center">
              <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
              <div className="text-sm text-gray-600">Serves</div>
              <div className="font-semibold">{recipe.servings}</div>
            </div>
            <div className="text-center">
              <ChefHat className="h-5 w-5 text-gray-400 mx-auto mb-1" />
              <div className="text-sm text-gray-600">Level</div>
              <div className="font-semibold">{recipe.difficulty}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    {ingredient.optional && (
                      <span className="text-gray-500 ml-1">(optional)</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
            <div className="space-y-3">
              {recipe.instructions.map((step, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCook}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              <ChefHat className="h-4 w-4 mr-2" />
              Cook This Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}