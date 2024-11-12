import React from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadConfig } from '../api/mockoonApi';

const UploadConfig = ({ onUploadSuccess }) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    const formData = new FormData();
    formData.append('config', file);

    try {
      await uploadConfig(formData);
      toast.success('Configuration uploaded successfully');
      onUploadSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload configuration');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Upload Configuration</h2>
      <label className="flex items-center gap-2 cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        <Upload className="w-4 h-4" />
        Upload JSON Config
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default UploadConfig;