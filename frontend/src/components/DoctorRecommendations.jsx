import React from 'react';
import { MapPin } from 'lucide-react';

export default function DoctorRecommendations({ condition }) {
  // Use a generic search query if condition is not specific, otherwise tailor the search
  const searchQuery = condition ? `specialist doctors for ${condition} near me` : 'doctors and clinics near me';
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-50 p-2 rounded-lg text-green-600">
          <MapPin />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Nearby Doctor Recommendations</h2>
      </div>
      <p className="text-slate-600 mb-6">Based on your analysis, here are some healthcare providers near you.</p>
      
      <div className="w-full h-96 rounded-xl overflow-hidden shadow-inner border border-slate-200">
        <iframe
          title="Doctor Recommendations Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={embedUrl}
        ></iframe>
      </div>
    </div>
  );
}
