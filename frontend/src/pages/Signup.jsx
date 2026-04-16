import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, ArrowRight, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Right Pane - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50/50 order-2 lg:order-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden p-3 bg-gradient-to-br from-primary to-blue-600 rounded-2xl inline-block mb-6 shadow-lg shadow-blue-500/30">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create your account</h2>
            <p className="text-slate-500 font-medium text-lg">
              Already have an account? <Link to="/login" className="text-primary hover:text-blue-600 font-bold transition-colors">Sign in</Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center">
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                    placeholder="John Doe" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                    placeholder="name@company.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    required 
                    className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-base font-bold rounded-2xl shadow-xl shadow-primary/30 text-white bg-slate-900 hover:bg-primary focus:outline-none transition-all disabled:opacity-70 mt-8 hover:-translate-y-1"
            >
              {isSubmitting ? 'Creating account...' : 'Get Started Free'}
              {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
            <p className="text-center text-xs text-slate-500 font-medium mt-6">By signing up, you agree to our Terms of Service and Privacy Policy.</p>
          </form>
        </motion.div>
      </div>

      {/* Left Pane (Visuals - moves to right visually via order) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 to-primary flex-col justify-between p-12 order-1 lg:order-2">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full mix-blend-color-dodge filter blur-[100px] opacity-40"></div>
        
        <div className="relative z-10 flex items-center justify-end w-full">
          <span className="font-extrabold text-3xl tracking-tight text-white mr-4">MediGuide<span className="text-blue-300">AI</span></span>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <Activity className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto text-center mt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl"
          >
             <ShieldCheck className="w-12 h-12 text-green-300" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white leading-tight mb-6"
          >
            Decade-Defining Insights. Right in your pocket.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-blue-100 font-medium leading-relaxed"
          >
            Join thousands of individuals securely extracting actionable lifestyle and medical advice directly from PDF health scans.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
