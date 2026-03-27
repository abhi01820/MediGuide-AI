import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const specialtySearchTerms = {
  'Diabetologist': 'Endocrinologist or Diabetes clinic near me',
  'Cardiologist': 'Cardiologist or Heart Hospital near me',
  'General Physician': 'General Physician or Primary Care Clinic near me',
};

export default function DoctorRecommendations({ condition }) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Map the condition to a more effective search string
  const searchQuery = condition 
    ? (specialtySearchTerms[condition] || `specialist doctor for ${condition} near me`) 
    : 'hospitals and medical clinics near me';
    
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-50 p-2 rounded-lg text-green-600">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Nearby Doctor Recommendations</h2>
          <p className="text-slate-500 text-sm mt-1">
            {condition ? `Searching for: ${condition}` : 'Searching for nearby clinics'}
          </p>
        </div>
      </div>
      
      <div className="w-full h-96 rounded-xl overflow-hidden shadow-inner border border-slate-200 relative bg-slate-50">
        {!isMapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100/50 backdrop-blur-sm z-10 animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
            <p className="font-medium">Locating nearby specialists...</p>
          </div>
        )}
        <iframe
          title="Doctor Recommendations Map"
          width="100%"
          height="100%"
          style={{ border: 0, opacity: isMapLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
          loading="lazy"
          allowFullScreen
          onLoad={() => setIsMapLoaded(true)}
          src={embedUrl}
        ></iframe>
      </div>
    </div>
  );
}
