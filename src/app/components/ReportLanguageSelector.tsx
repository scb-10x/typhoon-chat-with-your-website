import React from 'react';
import { useI18n, LanguageCode } from '../lib/i18n';

interface ReportLanguageSelectorProps {
    onLanguageChange?: (language: LanguageCode) => void;
}

const ReportLanguageSelector: React.FC<ReportLanguageSelectorProps> = ({ onLanguageChange }) => {
    const { language, setLanguage } = useI18n();

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = event.target.value as LanguageCode;
        setLanguage(newLang);
        if (onLanguageChange) {
            onLanguageChange(newLang);
        }
    };

    return (
        <div className="w-full max-w-md">
            <label htmlFor="report-language-select" className="mb-2 flex items-center">
                {/* Optional: Re-add a decorative element if desired */}
                {/* <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mr-2.5"></div> */}
                <span className="text-base text-gray-700 font-medium">Report Language</span>
            </label>

            <div className="relative mt-1">
                <select
                    id="report-language-select"
                    name="language"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none cursor-pointer shadow-sm bg-white"
                    value={language}
                    onChange={handleSelectChange}
                >
                    <option value="en">English (EN)</option>
                    <option value="th">Thai (TH)</option>
                </select>
                {/* Basic arrow indicator */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ReportLanguageSelector; 