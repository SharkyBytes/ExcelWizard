import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      if (!file.name.endsWith('.xlsx')) {
        alert('Only .xlsx files are allowed');
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 2 * 1024 * 1024,
    multiple: false
  });

  return (
    <div className="relative group">
      {/* Animated border effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
      
      <div
        {...getRootProps()}
        className={`
          relative p-8 rounded-xl cursor-pointer
          border-2 border-dashed border-blue-500/30
          bg-black/80 backdrop-blur-xl
          transition-all duration-300
          ${isDragActive ? 'border-blue-400 bg-blue-500/10' : 'hover:border-blue-400/50 hover:bg-blue-500/5'}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Glowing circle behind icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
        
        <div className="relative">
          <Upload className={`
            mx-auto h-12 w-12
            ${isDragActive ? 'text-blue-400 animate-bounce' : 'text-blue-500/60 group-hover:text-blue-400'}
            transition-colors duration-300
          `} />
          
          <p className={`
            mt-4 text-sm
            ${isDragActive ? 'text-blue-400' : 'text-blue-400/80'}
            transition-colors duration-300
            font-light tracking-wide
          `}>
            {isDragActive
              ? 'Drop the Excel file here'
              : 'Drag & drop an Excel file here, or click to select'}
          </p>
          
          <p className="mt-2 text-xs text-blue-500/60 font-light">
            Only .xlsx files up to 2MB are allowed
          </p>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/50"></div>
      </div>
    </div>
  );
};