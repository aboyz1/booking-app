import React, { useState } from 'react';
import { LuggageType, Luggage } from '../../types';
import { Package, Plus, Trash2, Camera } from 'lucide-react';
import Button from '../common/Button';

interface LuggageSelectorProps {
  luggageTypes: LuggageType[];
  selectedLuggage: Luggage[];
  onAddLuggage: (luggage: Luggage) => void;
  onRemoveLuggage: (index: number) => void;
  onUploadImage: (imageUrl: string) => void;
  className?: string;
}

const LuggageSelector: React.FC<LuggageSelectorProps> = ({
  luggageTypes,
  selectedLuggage,
  onAddLuggage,
  onRemoveLuggage,
  onUploadImage,
  className = '',
}) => {
  const [newLuggage, setNewLuggage] = useState<Partial<Luggage>>({
    quantity: 1,
  });
  
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  const handleAddLuggage = () => {
    if (!newLuggage.type) return;
    
    onAddLuggage({
      type: newLuggage.type,
      quantity: newLuggage.quantity || 1,
      weight: newLuggage.weight,
      description: newLuggage.description,
    });
    
    // Reset form
    setNewLuggage({ quantity: 1 });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUploadImage(result);
    };
    reader.readAsDataURL(file);
    
    setShowImageUpload(false);
  };
  const handleTakePhoto = () => {
    const mockPhotoUrl = 'https://images.pexels.com/photos/2348005/pexels-photo-2348005.jpeg';
    onUploadImage(mockPhotoUrl);
    setShowImageUpload(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900">Luggage Details</h3>
      
      {/* Luggage selection form */}
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Luggage Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newLuggage.type?.id || ''}
                onChange={(e) => {
                  const typeId = e.target.value;
                  const luggageType = luggageTypes.find(type => type.id === typeId);
                  setNewLuggage({ ...newLuggage, type: luggageType });
                }}
              >
                <option value="">Select Luggage Type</option>
                {luggageTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} (max {type.maxWeight}kg, {type.maxSize})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max="10"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newLuggage.quantity || 1}
              onChange={(e) => setNewLuggage({ ...newLuggage, quantity: parseInt(e.target.value) })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newLuggage.weight || ''}
              onChange={(e) => setNewLuggage({ ...newLuggage, weight: parseFloat(e.target.value) })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Blue suitcase"
              value={newLuggage.description || ''}
              onChange={(e) => setNewLuggage({ ...newLuggage, description: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleAddLuggage}
            disabled={!newLuggage.type}
            variant="secondary"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Luggage
          </Button>
        </div>
      </div>
      
      {/* Selected luggage list */}
      {selectedLuggage.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">Added Luggage</h4>
          <ul className="space-y-2">
            {selectedLuggage.map((luggage, index) => (
              <li key={index} className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                <div>
                  <span className="font-medium">{luggage.type.name}</span> x {luggage.quantity}
                  {luggage.weight && <span className="ml-2 text-gray-600">({luggage.weight}kg)</span>}
                  {luggage.description && <span className="ml-2 text-gray-600">- {luggage.description}</span>}
                </div>
                <button
                  onClick={() => onRemoveLuggage(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Image upload section */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h4 className="text-md font-medium text-blue-800 mb-2">Not sure about your luggage?</h4>
        <p className="text-sm text-blue-700 mb-3">
          Take a photo of your luggage and our system will help categorize it correctly.
        </p>
        
        {showImageUpload ? (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="luggage-photo"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="luggage-photo"
                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Choose File
              </label>
              <Button
                onClick={handleTakePhoto}
                variant="primary"
                size="sm"
              >
                <Camera className="h-4 w-4 mr-1" /> Simulate Taking Photo
              </Button>
            </div>
            <Button
              onClick={() => setShowImageUpload(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowImageUpload(true)}
            variant="secondary"
            size="sm"
          >
            <Camera className="h-4 w-4 mr-1" /> Upload Luggage Photo
          </Button>
        )}
      </div>
    </div>
  );
};

export default LuggageSelector;