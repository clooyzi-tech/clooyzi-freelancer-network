import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

interface AdminLoginProps {
  onLogin: (token: string) => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-950 px-4 min-h-screen font-sans text-gray-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 shadow-2xl border border-gray-800 p-8 rounded-2xl w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition">
          <ChevronLeft size={18} /> Back to Site
        </button>
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center bg-brand-gold/10 mx-auto mb-4 rounded-xl w-12 h-12">
            <LogOut className="text-brand-gold" />
          </div>
          <h1 className="font-bold text-2xl text-white">Admin Portal</h1>
          <p className="mt-2 text-gray-400 text-sm">Sign in to manage partner applications</p>
        </div>
        
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-red-500/10 mb-6 p-3 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-400 text-sm">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-800 px-4 py-2.5 border border-gray-700 focus:border-brand-gold rounded-lg w-full text-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition" />
          </div>
          <div>
            <label className="block mb-1 text-gray-400 text-sm">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="bg-gray-800 px-4 py-2.5 border border-gray-700 focus:border-brand-gold rounded-lg w-full text-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition" />
          </div>
          <button disabled={loading} type="submit" className="flex justify-center items-center gap-2 bg-brand-primary hover:bg-brand-dark mt-6 py-2.5 rounded-lg w-full font-medium text-white transition">
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
