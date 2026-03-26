import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UploadCloud } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <UploadCloud className="mx-auto h-16 w-16 text-primary mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Upload Medical Report</h2>
        <p className="text-slate-600 mb-8">Upload your blood test, health checkup, or CBC report (PDF/Image) for AI analysis.</p>
        
        <form onSubmit={handleUpload}>
          <div className="flex items-center justify-center w-full mb-6">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500">PDF, JPG, or PNG (MAX. 10MB)</p>
                {file && <p className="mt-4 text-primary font-medium">Selected: {file.name}</p>}
              </div>
              <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
            </label>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <button type="submit" disabled={isUploading || !file} className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-secondary transition disabled:opacity-70">
            {isUploading ? 'Analyzing Report with AI...' : 'Analyze Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
