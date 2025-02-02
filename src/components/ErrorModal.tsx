import React from 'react';
import { X } from 'lucide-react';
import { ValidationError } from '../types';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationError[];
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, errors }) => {
  if (!isOpen) return null;

  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.sheet]) {
      acc[error.sheet] = [];
    }
    acc[error.sheet].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>
        <div className="inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-[0_0_50px_rgba(0,0,255,0.3)] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Animated border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-25 animate-pulse"></div>
          
          <div className="relative bg-black/90 backdrop-blur-xl border border-blue-500/20">
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  Validation Errors
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-md text-blue-400 hover:text-blue-300 focus:outline-none transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4">
                {Object.entries(groupedErrors).map(([sheet, sheetErrors]) => (
                  <div key={sheet} className="mb-4">
                    <h4 className="font-medium text-blue-400/90 mb-2">Sheet: {sheet}</h4>
                    <ul className="space-y-2">
                      {sheetErrors.map((error, index) => (
                        <li key={index} className="text-sm text-red-400 bg-red-900/20 p-2 rounded-lg border border-red-500/20">
                          Row {error.row}: {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-lg border border-blue-500/50 px-4 py-2 bg-blue-500/20 text-base font-medium text-blue-400 hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,0,255,0.2)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};