import React from 'react';
import { motion } from 'framer-motion';
import { MODEL_PARAMETERS, TyphoonModel } from '../lib/const';
import { useI18n } from '../lib/i18n';

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
  const { language } = useI18n();

  const models: { id: TyphoonModel; name: string; description: string }[] = (Object.keys(MODEL_PARAMETERS) as TyphoonModel[])
    .map((id: TyphoonModel) => ({
      id: id,
      name: MODEL_PARAMETERS[id].name,
      description: language === 'th' && MODEL_PARAMETERS[id].descriptionTh
        ? MODEL_PARAMETERS[id].descriptionTh
        : MODEL_PARAMETERS[id].description
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto mb-6"
      id="model-selector-container"
    >
      <div className="text-center mb-5">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 inline-flex items-center" id="model-selector-label">
          <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mr-2.5"></span>
          {language === 'th' ? 'เลือกโมเดล Typhoon AI' : 'Select Typhoon AI Model'}
        </h3>
        <div className="mt-1.5 text-xs text-gray-500 max-w-lg mx-auto">
          {language === 'th' ? 'เลือกโมเดล AI ที่เหมาะสมกับความต้องการของคุณ' : 'Choose the AI model that best fits your needs'}
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-3 justify-center" id="model-options-container">
        {models.map((model) => (
          <motion.div
            key={model.id}
            onClick={() => !disabled && onModelChange(model.id)}
            className={`
              relative flex-grow-0 flex-shrink-0 w-[200px] p-3 rounded-xl border overflow-hidden transition-all duration-200
              ${selectedModel === model.id
                ? 'border-indigo-500 bg-gradient-to-br from-indigo-50/90 to-purple-50/90 shadow-sm'
                : 'border-gray-200/70 backdrop-blur-sm bg-white/70 hover:border-indigo-300 hover:shadow-sm'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={{ translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            id={`model-option-${model.id}`}
          >
            {selectedModel === model.id && (
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            )}

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className={`
                  w-3 h-3 rounded-full 
                  ${selectedModel === model.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md'
                    : 'bg-gray-300'
                  }
                `}></div>
              </div>
              <div className="ml-2.5 flex-1 overflow-hidden">
                <h3 className={`
                  text-sm font-medium truncate
                  ${selectedModel === model.id ? 'text-indigo-700' : 'text-gray-900'}
                `} id={`model-name-${model.id}`}>
                  {model.name}
                </h3>
                <p className={`
                  mt-1 text-xs line-clamp-2 leading-relaxed
                  ${selectedModel === model.id ? 'text-indigo-600/80' : 'text-gray-500'}
                `} id={`model-description-${model.id}`}>
                  {model.description}
                </p>
              </div>
            </div>

            {selectedModel === model.id && (
              <div className="mt-2 text-right">
                <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {language === 'th' ? 'กำลังใช้งาน' : 'Active'}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ModelSelector; 