import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Download, Search, X, User, Briefcase,
  CheckCircle2, Calendar, Loader2
} from 'lucide-react';
import { Partner } from '../types';

const API_URL = 'https://clooyzi-freelancer-network-backend.vercel.app/api';
const STATUSES = ['Interested', 'Not Interested', 'Rejected', 'Training Needed', 'Training Start', 'Training Done', 'Company Setup Phase', 'Client Bring Phase'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Interested': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Rejected': case 'Not Interested': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'Training Done': case 'Client Bring Phase': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }
};

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${API_URL}/partners`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, [token]);

  const updatePartner = async (id: string, updates: Partial<Partner>) => {
    try {
      const res = await fetch(`${API_URL}/partners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setPartners(prev => prev.map(p => p._id === id ? updated : p));
        if (selectedPartner?._id === id) setSelectedPartner(updated);
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const filtered = partners.filter(p => p.fullName.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Location', 'Status', 'Date'],
      ...partners.map(p => [p.fullName, p.email, p.whatsapp, p.location, p.adminStatus, new Date(p.createdAt).toLocaleDateString()])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'partners.csv'; a.click();
  };

  if (loading) return <div className="flex justify-center items-center bg-gray-950 min-h-screen"><Loader2 className="text-brand-gold animate-spin" size={32} /></div>;

  return (
    <div className="bg-gray-950 min-h-screen text-gray-200">
      <nav className="top-0 z-40 sticky bg-gray-900/80 backdrop-blur-md border-gray-800 border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-brand-primary rounded-lg w-8 h-8">
                <Briefcase className="text-white" size={18} />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">Clooyzi Admin</span>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-4 mb-8">
          {[
            { label: 'Total Applications', value: partners.length, color: 'text-white' },
            { label: 'Interested', value: partners.filter(p => p.adminStatus === 'Interested').length, color: 'text-brand-gold' },
            { label: 'In Training', value: partners.filter(p => p.adminStatus.includes('Training')).length, color: 'text-amber-400' },
            { label: 'Setup Phase', value: partners.filter(p => p.adminStatus.includes('Setup')).length, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-gray-900 p-6 border border-gray-800 rounded-2xl">
              <p className="font-medium text-gray-400 text-sm">{stat.label}</p>
              <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex sm:flex-row flex-col justify-between items-center gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2" size={18} />
            <input
              type="text" placeholder="Search partners..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-gray-900 py-2.5 pr-4 pl-10 border border-gray-800 focus:border-brand-gold rounded-xl w-full text-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition"
            />
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2.5 border border-gray-800 rounded-xl text-sm text-white transition">
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div className="bg-gray-900 shadow-xl border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Partner Name</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Experience</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <AnimatePresence>
                  {filtered.map(p => (
                    <motion.tr
                      key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setSelectedPartner(p)}
                      className="hover:bg-gray-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{p.fullName}</div>
                        <div className="text-gray-500">{p.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{p.email}</div>
                        <div className="text-gray-500">{p.whatsapp}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{p.yearsExperience}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(p.adminStatus)}`}>
                          {p.adminStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-500">No partners found.</div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedPartner && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPartner(null)} className="z-50 fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="right-0 top-0 bottom-0 z-50 fixed bg-gray-900 shadow-2xl border-l border-gray-800 w-full max-w-2xl h-full overflow-y-auto">
              <div className="top-0 sticky flex justify-between items-center bg-gray-900/95 backdrop-blur px-6 py-4 border-gray-800 border-b">
                <h2 className="font-bold text-white text-xl">Partner Details</h2>
                <button onClick={() => setSelectedPartner(null)} className="p-2 text-gray-400 hover:text-white transition"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-8">
                <div className="space-y-4 bg-gray-950 p-5 border border-gray-800 rounded-xl">
                  <h3 className="flex items-center gap-2 font-semibold text-brand-gold text-sm uppercase tracking-wider"><CheckCircle2 size={16} /> Admin Management</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block mb-2 text-gray-400 text-sm">Status</label>
                      <select
                        value={selectedPartner.adminStatus}
                        onChange={(e) => updatePartner(selectedPartner._id, { adminStatus: e.target.value })}
                        className="bg-gray-800 px-4 py-2 border border-gray-700 focus:border-brand-gold rounded-lg w-full text-white focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-400 text-sm">Internal Comment</label>
                      <textarea
                        value={selectedPartner.adminComment || ''}
                        onChange={(e) => setSelectedPartner({ ...selectedPartner, adminComment: e.target.value })}
                        onBlur={(e) => updatePartner(selectedPartner._id, { adminComment: e.target.value })}
                        placeholder="Add notes here (saves automatically on blur)..."
                        className="bg-gray-800 p-3 border border-gray-700 focus:border-brand-gold rounded-lg w-full h-24 text-white focus:outline-none focus:ring-1 focus:ring-brand-gold resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-400 text-sm uppercase tracking-wider border-gray-800 border-b pb-2"><User size={16} /> Personal Info</h3>
                    <div className="gap-4 grid grid-cols-2 text-sm">
                      <div><span className="block text-gray-500">Full Name</span><span className="font-medium text-gray-200">{selectedPartner.fullName}</span></div>
                      <div><span className="block text-gray-500">Email</span><span className="font-medium text-gray-200">{selectedPartner.email}</span></div>
                      <div><span className="block text-gray-500">WhatsApp</span><span className="font-medium text-gray-200">{selectedPartner.whatsapp}</span></div>
                      <div><span className="block text-gray-500">Age</span><span className="font-medium text-gray-200">{selectedPartner.age}</span></div>
                      <div className="col-span-2"><span className="block text-gray-500">Location</span><span className="font-medium text-gray-200">{selectedPartner.location}</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-400 text-sm uppercase tracking-wider border-gray-800 border-b pb-2"><Briefcase size={16} /> Professional</h3>
                    <div className="gap-4 grid grid-cols-2 text-sm">
                      <div><span className="block text-gray-500">Company</span><span className="font-medium text-gray-200">{selectedPartner.currentCompany}</span></div>
                      <div><span className="block text-gray-500">Role</span><span className="font-medium text-gray-200">{selectedPartner.currentRole}</span></div>
                      <div><span className="block text-gray-500">Experience</span><span className="font-medium text-gray-200">{selectedPartner.yearsExperience}</span></div>
                      <div><span className="block text-gray-500">Industry</span><span className="font-medium text-gray-200">{selectedPartner.industry}</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-400 text-sm uppercase tracking-wider border-gray-800 border-b pb-2"><Search size={16} /> Business Overview</h3>
                    <div className="gap-4 grid grid-cols-2 text-sm">
                      <div><span className="block text-gray-500">Existing Clients</span><span className="font-medium text-gray-200">{selectedPartner.existingClients}</span></div>
                      <div><span className="block text-gray-500">Client Count</span><span className="font-medium text-gray-200">{selectedPartner.clientCount}</span></div>
                      <div><span className="block text-gray-500">Annual Income</span><span className="font-medium text-gray-200">${selectedPartner.annualIncome}</span></div>
                      <div><span className="block text-gray-500">Software Interest</span><span className="font-medium text-gray-200">{selectedPartner.softwareInterest}</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-400 text-sm uppercase tracking-wider border-gray-800 border-b pb-2"><Calendar size={16} /> Market & Goals</h3>
                    <div className="gap-4 grid grid-cols-2 text-sm">
                      <div className="col-span-2"><span className="block text-gray-500">Client Problems</span><span className="font-medium text-gray-200">{selectedPartner.clientProblems}</span></div>
                      <div><span className="block text-gray-500">Lead Gen</span><span className="font-medium text-gray-200">{selectedPartner.leadGenMethod}</span></div>
                      <div><span className="block text-gray-500">Sales Comfort</span><span className="font-medium text-gray-200">{selectedPartner.comfortableSales}</span></div>
                      <div><span className="block text-gray-500">Motivation</span><span className="font-medium text-gray-200">{selectedPartner.motivation}</span></div>
                      <div><span className="block text-gray-500">Revenue Goal</span><span className="font-medium text-gray-200">${selectedPartner.revenueGoal}</span></div>
                      <div><span className="block text-gray-500">Timeline</span><span className="font-medium text-gray-200">{selectedPartner.launchTimeline}</span></div>
                      <div><span className="block text-gray-500">Budget</span><span className="font-medium text-gray-200">{selectedPartner.setupBudget}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
