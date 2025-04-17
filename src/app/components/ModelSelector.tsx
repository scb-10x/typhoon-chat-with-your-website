import React from 'react';
import { motion } from 'framer-motion';
import { MODEL_PARAMETERS, TyphoonModel } from '../lib/const';

interface ModelSelectorProps {
  selectedModel: TyphoonModel;
  onModelChange: (model: TyphoonModel) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  onModelChange,
  disabled = false
}) => {
  const models: { id: TyphoonModel; name: string; description: string }[] = (Object.keys(MODEL_PARAMETERS) as TyphoonModel[])
    .map((id: TyphoonModel) => ({
      id: id,
      name: MODEL_PARAMETERS[id].name,
      description: MODEL_PARAMETERS[id].description
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto mb-4"
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">
        Select Typhoon AI Model
      </label>
      <div className="flex flex-row flex-wrap gap-3 justify-center">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => !disabled && onModelChange(model.id)}
            className={`
              flex-grow-0 flex-shrink-0 w-[200px] p-1.5 rounded-lg border cursor-pointer transition-all
              ${selectedModel === model.id 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-700'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${selectedModel === model.id ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              </div>
              <div className="ml-2 flex-1 overflow-hidden">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{model.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{model.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ModelSelector; 