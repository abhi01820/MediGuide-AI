import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Calendar, Activity, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-500 font-medium">Retrieving patient records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Health History</h1>
          <p className="text-lg text-slate-500 font-medium">Your historical medical reports and chronological AI insights.</p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl border border-blue-100">
           <FileText className="w-8 h-8 text-primary" />
        </div>
      </motion.div>
      
      {reports.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[2rem] shadow-sm text-center border border-slate-100">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No historical data available</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">Upload medical reports to start building your long-term health timeline.</p>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {reports.map((report, index) => {
            const dateObj = new Date(report.createdAt);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const timeAgo = Math.floor((new Date() - dateObj) / (1000 * 60 * 60 * 24));
            
            return (
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                key={report._id} 
                className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-start sm:items-center space-x-6 w-full">
                  <div className="hidden sm:flex p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Activity className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                       <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">Comprehensive Analysis</h3>
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                         {report.analysis?.diabetes_risk?.includes("Low") ? "Optimal" : "Attention"}
                       </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-sm font-medium text-slate-500 gap-y-2 gap-x-4">
                      <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {formattedDate}</div>
                      <div className="hidden sm:block">•</div>
                      <div>{timeAgo === 0 ? 'Today' : `${timeAgo} days ago`}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                       <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-semibold shadow-sm">
                         BMI: <span className="text-primary">{report.analysis?.bmi || 'N/A'}</span>
                       </span>
                       <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-semibold shadow-sm">
                         BP: <span className="text-red-500">{report.raw_data?.blood_pressure || 'N/A'}</span>
                       </span>
                    </div>
                  </div>
                  
                  <div className="self-center mt-4 sm:mt-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 hidden sm:block">
                     <ChevronRight className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
