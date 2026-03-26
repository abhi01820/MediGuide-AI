import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText } from 'lucide-react';

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/reports/history');
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading history...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Your Health History</h1>
      
      {reports.length === 0 ? (
        <p className="text-slate-600">No past reports found.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg"><FileText /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Analysis from {new Date(report.createdAt).toLocaleDateString()}</h3>
                  <p className="text-sm text-slate-600">BMI: {report.analysis?.bmi || 'N/A'} &bull; BP: {report.raw_data?.blood_pressure || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
