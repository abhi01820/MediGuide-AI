import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Activity, Heart, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DoctorRecommendations from '../components/DoctorRecommendations';

export default function Dashboard() {
  const { user } = useAuth();
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/reports/history');
        if (data.length > 0) {
          setLatestReport(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Hello, {user?.name}</h1>
        <p className="text-slate-600 mt-2">Here is your health overview based on your latest report.</p>
      </div>

      {loading ? (
        <p>Loading your data...</p>
      ) : latestReport ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Activity /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">BMI</p>
              <h3 className="text-2xl font-bold text-slate-900">{latestReport.analysis?.bmi || 'N/A'}</h3>
              <p className="text-sm text-slate-600 mt-1">{latestReport.analysis?.bmi_status}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Heart /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Blood Pressure</p>
              <h3 className="text-2xl font-bold text-slate-900">{latestReport.raw_data?.blood_pressure || 'N/A'}</h3>
              <p className="text-sm text-slate-600 mt-1">{latestReport.analysis?.blood_pressure_status}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><ShieldAlert /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Diabetes Risk</p>
              <h3 className="text-2xl font-bold text-slate-900">{latestReport.analysis?.diabetes_risk || 'N/A'}</h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
          <h3 className="text-xl font-medium text-slate-800 mb-2">No Health Reports Found</h3>
          <p className="text-slate-600 mb-6">Upload a medical report to get personalized insights and recommendations.</p>
          <Link to="/upload" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Upload Your First Report
          </Link>
        </div>
      )}

      {latestReport && (
        <>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Recommendations</h2>
            <p className="text-slate-700 mb-6">{latestReport.analysis?.summary}</p>
            <ul className="space-y-3">
              {latestReport.analysis?.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start">
                  <ArrowUpRight className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-slate-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <DoctorRecommendations condition={latestReport.analysis?.diabetes_risk?.includes("High") ? "Diabetologist" : null} />
        </>
      )}
    </div>
  );
}

