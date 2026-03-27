import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Activity, Heart, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, UploadCloud, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import DoctorRecommendations from '../components/DoctorRecommendations';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
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

  const getBmiColor = (bmi) => {
    if (!bmi) return "bg-slate-200";
    if (bmi >= 18.5 && bmi <= 24.9) return "bg-green-500";
    if (bmi >= 25 && bmi <= 29.9) return "bg-amber-500";
    if (bmi >= 30) return "bg-red-500";
    return "bg-blue-400";
  };
  
  const getBmiPercentage = (bmi) => {
    if (!bmi) return 0;
    return Math.min((bmi / 40) * 100, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 min-h-[calc(100vh-64px)]">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
          Hello, {user?.name}
        </h1>
        <p className="text-slate-600 mt-2 text-lg">Your personalized AI health dashboard & clinical insights.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : latestReport ? (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* BMI Card */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Activity className="w-6 h-6" /></div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    Body Mass Index
                  </span>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1">{latestReport.analysis?.bmi || 'N/A'}</h3>
                <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">{latestReport.analysis?.bmi_status || 'Unknown'}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-1 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getBmiPercentage(latestReport.analysis?.bmi)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-2.5 rounded-full ${getBmiColor(latestReport.analysis?.bmi)}`}
                  ></motion.div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-medium"><span>Underweight</span><span>Obese</span></div>
              </div>
            </motion.div>

            {/* Blood Pressure Card */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><Heart className="w-6 h-6" /></div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    Vitals
                  </span>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1">{latestReport.raw_data?.blood_pressure || 'N/A'}</h3>
                <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider line-clamp-1" title={latestReport.analysis?.blood_pressure_status}>
                  {latestReport.analysis?.blood_pressure_status || 'Unknown'}
                </p>
                <div className="w-full bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center">
                  <Stethoscope className="w-4 h-4 text-slate-400 mr-2" />
                  <span className="text-xs text-slate-500 font-medium">Derived from your latest report</span>
                </div>
              </div>
            </motion.div>

            {/* Diabetes Risk Card */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><ShieldAlert className="w-6 h-6" /></div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    Glucose Auth
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight line-clamp-2 min-h-[60px]">
                  {latestReport.analysis?.diabetes_risk || 'N/A'}
                </h3>
                <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Risk Level</p>
                <div className="flex space-x-1">
                   <div className={`h-2 w-full rounded-sm ${latestReport.analysis?.diabetes_risk?.includes("Low") ? "bg-green-500" : "bg-slate-200"}`}></div>
                   <div className={`h-2 w-full rounded-sm ${latestReport.analysis?.diabetes_risk?.includes("Prediabetes") ? "bg-amber-400" : "bg-slate-200"}`}></div>
                   <div className={`h-2 w-full rounded-sm ${latestReport.analysis?.diabetes_risk?.includes("High") ? "bg-red-500" : "bg-slate-200"}`}></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Comprehensive Recommendations */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 mb-10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-primary to-purple-500"></div>
            <div className="flex items-center mb-6 mt-2">
              <div className="bg-indigo-100 p-2 rounded-xl mr-4 text-indigo-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">AI Clinical Plan</h2>
                <p className="text-slate-500 mt-1 font-medium">{latestReport.analysis?.summary}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
              {latestReport.analysis?.recommendations?.map((rec, i) => {
                let icon = '💡';
                let bgColor = 'bg-slate-50';
                let borderColor = 'border-slate-100';
                
                if (rec.includes('Diet')) {
                  bgColor = 'bg-green-50'; borderColor = 'border-green-100';
                } else if (rec.includes('Exercise')) {
                  bgColor = 'bg-blue-50'; borderColor = 'border-blue-100';
                } else if (rec.includes('Medical')) {
                  bgColor = 'bg-red-50'; borderColor = 'border-red-100';
                } else if (rec.includes('Lifestyle')) {
                  bgColor = 'bg-purple-50'; borderColor = 'border-purple-100';
                }

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={i} 
                    className={`${bgColor} border ${borderColor} p-5 rounded-2xl flex items-start space-x-4 hover:shadow-md transition-shadow`}
                  >
                    <span className="text-2xl mt-1">{rec.substring(0, 2)}</span>
                    <span className="text-slate-800 font-medium leading-relaxed">{rec.substring(2).trim()}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          {/* Doctor Recommendations Map */}
          <motion.div variants={itemVariants}>
            <DoctorRecommendations condition={latestReport.analysis?.diabetes_risk?.includes("High") ? "Diabetologist" : null} />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[32px] shadow-sm text-center border border-slate-100 max-w-3xl mx-auto mt-20"
        >
          <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-4">No Health Reports Analyzed Yet</h3>
          <p className="text-slate-500 mb-8 text-lg max-w-xl mx-auto">
            Upload your first medical report or PDF scan to instantly generate your personalized clinical dashboard, complete with lifestyle advice and risk metrics.
          </p>
          <Link to="/upload" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl shadow-lg text-white bg-primary hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Upload Your First Report <ArrowRight className="ml-3 w-6 h-6" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
