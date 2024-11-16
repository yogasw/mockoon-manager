// frontend/src/components/UploadConfig.jsx
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadConfig } from '../api/mockoonApi';
import { addHealthCheckEndpoint } from '../utils/configUtils';

const UploadConfig = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      resetFileInput();
      return;
    }

    setIsUploading(true);
    try {
      // Read and modify the configuration
      const fileContent = await file.text();
      const modifiedConfig = addHealthCheckEndpoint(fileContent);
      
      // Create a new file with modified content
      const modifiedFile = new Blob([JSON.stringify(modifiedConfig, null, 2)], {
        type: 'application/json'
      });
      
      const formData = new FormData();
      formData.append('config', modifiedFile, file.name);

      await uploadConfig(formData);
      toast.success('Configuration uploaded and enhanced with health check endpoint');
      onUploadSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to upload configuration';
      
      if (error.response?.status === 409) {
        toast.error('Please rename your configuration file and try again. This filename already exists.', {
          duration: 5000,
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsUploading(false);
      resetFileInput(); // Always reset the input after upload attempt
    }
  };

  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-white">Upload Configuration</h2>
      <div className="space-y-4">
        <label 
          className={`
            flex items-center gap-2 cursor-pointer inline-block px-4 py-2 
            bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !isUploading && resetFileInput()} // Reset on label click if not uploading
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload JSON Config'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            onClick={e => {
              // Reset value when clicking to ensure onChange fires even with same file
              e.currentTarget.value = '';
            }}
            disabled={isUploading}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-400">
          Note: Configuration filenames must be unique. If a file with the same name exists, please rename your file before uploading.
        </p>
      </div>
    </div>
  );
};

export default UploadConfig;