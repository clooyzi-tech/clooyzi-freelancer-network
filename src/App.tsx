import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle2, Loader2
} from 'lucide-react';
import { FormData } from './types';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import logo from './public/logo.png';

const API_URL = 'https://clooyzi-freelancer-network-backend.onrender.com/api';

const initialFormData: FormData = {
  fullName: '', email: '', whatsapp: '', location: '', age: '',
  currentCompany: '', currentRole: '', yearsExperience: '', industry: '',
  existingClients: '', clientCount: '', annualIncome: '', softwareInterest: '',
  clientProblems: '', potentialClients: '', leadGenMethod: '', comfortableSales: '',
  motivation: '', revenueGoal: '', launchTimeline: '', setupBudget: '',
};

interface InputProps {
  label: string; value: string; onChange: (value: string) => void;
  type?: string; placeholder?: string; error?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type = 'text', placeholder = '', error }) => (
  <div className="flex flex-col gap-2">
    <label className="font-medium text-gray-700 text-sm">{label}</label>
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className={`px-4 py-2.5 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-light0'} focus:border-transparent rounded-lg focus:outline-none focus:ring-2 transition`}
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

interface SelectProps {
  label: string; value: string; onChange: (value: string) => void;
  options: string[]; error?: string;
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options, error }) => (
  <div className="flex flex-col gap-2">
    <label className="font-medium text-gray-700 text-sm">{label}</label>
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      className={`px-4 py-2.5 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-light0'} focus:border-transparent rounded-lg focus:outline-none focus:ring-2 transition`}
    >
      <option value="">Select an option</option>
      {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

interface StepProps {
  data: FormData; onChange: (data: Partial<FormData>) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

const Step1: React.FC<StepProps> = ({ data, onChange, errors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h2 className="font-bold text-gray-900 text-2xl">Personal Information</h2>
      <p className="mt-1 text-gray-600 text-sm">Tell us about yourself</p>
    </div>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      <Input label="Full Name" value={data.fullName} onChange={(v) => onChange({ fullName: v })} placeholder="John Doe" error={errors.fullName} />
      <Input label="Email" type="email" value={data.email} onChange={(v) => onChange({ email: v })} placeholder="john@example.com" error={errors.email} />
      <Input label="Age" type="number" value={data.age} onChange={(v) => onChange({ age: v })} placeholder="28" error={errors.age} />
      <Input label="WhatsApp" type="number" value={data.whatsapp} onChange={(v) => onChange({ whatsapp: v })} placeholder="9999999999" error={errors.whatsapp} />
      <Input label="Location" value={data.location} onChange={(v) => onChange({ location: v })} placeholder="City, Country" error={errors.location} />
    </div>
  </motion.div>
);

const Step2: React.FC<StepProps> = ({ data, onChange, errors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h2 className="font-bold text-gray-900 text-2xl">Professional Background</h2>
      <p className="mt-1 text-gray-600 text-sm">Share your work experience</p>
    </div>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      <Input label="Current Company" value={data.currentCompany} onChange={(v) => onChange({ currentCompany: v })} placeholder="Company Name" error={errors.currentCompany} />
      <Input label="Current Role" value={data.currentRole} onChange={(v) => onChange({ currentRole: v })} placeholder="e.g., Manager" error={errors.currentRole} />
      <Select label="Years of Experience" value={data.yearsExperience} onChange={(v) => onChange({ yearsExperience: v })} options={['<1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years']} error={errors.yearsExperience} />
      <Select label="Industry" value={data.industry} onChange={(v) => onChange({ industry: v })} options={['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Other']} error={errors.industry} />
    </div>
  </motion.div>
);

const Step3: React.FC<StepProps> = ({ data, onChange, errors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h2 className="font-bold text-gray-900 text-2xl">Business Overview</h2>
      <p className="mt-1 text-gray-600 text-sm">Tell us about your current business</p>
    </div>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      <Select label="Do you have existing clients?" value={data.existingClients} onChange={(v) => onChange({ existingClients: v })} options={['Yes', 'No', 'In Progress']} error={errors.existingClients} />
      <Input label="Number of Clients" type="number" value={data.clientCount} onChange={(v) => onChange({ clientCount: v })} placeholder="10" error={errors.clientCount} />
      <Input label="Annual Income (USD)" type="number" value={data.annualIncome} onChange={(v) => onChange({ annualIncome: v })} placeholder="100000" error={errors.annualIncome} />
      <Select label="Interest in Software" value={data.softwareInterest} onChange={(v) => onChange({ softwareInterest: v })} options={['Very High', 'High', 'Medium', 'Low', 'Exploring']} error={errors.softwareInterest} />
    </div>
  </motion.div>
);

const Step4: React.FC<StepProps> = ({ data, onChange, errors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h2 className="font-bold text-gray-900 text-2xl">Market & Sales</h2>
      <p className="mt-1 text-gray-600 text-sm">Tell us about market opportunities</p>
    </div>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      <Input label="Client Problems" value={data.clientProblems} onChange={(v) => onChange({ clientProblems: v })} placeholder="Describe pain points" error={errors.clientProblems} />
      <Input label="Potential Clients for Software" type="number" value={data.potentialClients} onChange={(v) => onChange({ potentialClients: v })} placeholder="50" error={errors.potentialClients} />
      <Select label="Lead Generation Method" value={data.leadGenMethod} onChange={(v) => onChange({ leadGenMethod: v })} options={['Direct Sales', 'Referrals', 'Online Marketing', 'Partnerships', 'Events']} error={errors.leadGenMethod} />
      <Select label="Comfortable with Sales?" value={data.comfortableSales} onChange={(v) => onChange({ comfortableSales: v })} options={['Very Comfortable', 'Somewhat', 'Learning', 'Need Support']} error={errors.comfortableSales} />
    </div>
  </motion.div>
);

const Step5: React.FC<StepProps> = ({ data, onChange, errors }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div>
      <h2 className="font-bold text-gray-900 text-2xl">Goals & Investment</h2>
      <p className="mt-1 text-gray-600 text-sm">Share your aspirations</p>
    </div>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      <Select label="What motivates you?" value={data.motivation} onChange={(v) => onChange({ motivation: v })} options={['Revenue Growth', 'Client Retention', 'Market Expansion', 'Innovation', 'Efficiency']} error={errors.motivation} />
      <Input label="Revenue Goal (Year 1) (USD)" type="number" value={data.revenueGoal} onChange={(v) => onChange({ revenueGoal: v })} placeholder="500000" error={errors.revenueGoal} />
      <Select label="Launch Timeline" value={data.launchTimeline} onChange={(v) => onChange({ launchTimeline: v })} options={['Immediate', '1-3 months', '3-6 months', '6-12 months', '1+ year']} error={errors.launchTimeline} />
      <Select label="Setup Budget" value={data.setupBudget} onChange={(v) => onChange({ setupBudget: v })} options={['<$10K', '$10K-$50K', '$50K-$100K', '$100K+', 'Flexible']} error={errors.setupBudget} />
    </div>
  </motion.div>
);


export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<'form' | 'admin-login' | 'admin-dashboard'>(() => {
    if (window.location.pathname.startsWith('/admin')) {
      return localStorage.getItem('clooyzi_admin_token') ? 'admin-dashboard' : 'admin-login';
    }
    return 'form';
  });
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('clooyzi_admin_token'));

  useEffect(() => {
    if (adminToken && view === 'admin-login') setView('admin-dashboard');
  }, [adminToken, view]);

  const steps = ['Personal', 'Professional', 'Business', 'Market', 'Goals'];

  const handleChange = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    const changedKeys = Object.keys(updates) as Array<keyof FormData>;
    if (changedKeys.length > 0 && errors[changedKeys[0]]) {
      setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[changedKeys[0]]; return newErrors; });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.age.trim()) newErrors.age = 'Age is required';
      else if (!/^\d+$/.test(formData.age)) newErrors.age = 'Age must be a number';
      else if (parseInt(formData.age, 10) <= 16) newErrors.age = 'Age must be greater than 16';
      if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
      else if (!/^\d{10}$/.test(formData.whatsapp.trim())) newErrors.whatsapp = 'Must be exactly 10 digits';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      else if (formData.location.trim().length < 3 || !/[a-zA-Z]/.test(formData.location)) newErrors.location = 'Please enter a valid location';
    } else if (step === 1) {
      if (!formData.currentCompany.trim()) newErrors.currentCompany = 'Company is required';
      if (!formData.currentRole.trim()) newErrors.currentRole = 'Role is required';
      if (!formData.yearsExperience) newErrors.yearsExperience = 'Please select experience';
      if (!formData.industry) newErrors.industry = 'Please select an industry';
    } else if (step === 2) {
      if (!formData.existingClients) newErrors.existingClients = 'Please select an option';
      if (!formData.clientCount.trim()) newErrors.clientCount = 'Client count is required';
      else if (!/^\d+$/.test(formData.clientCount)) newErrors.clientCount = 'Must be a valid number';
      if (!formData.annualIncome.trim()) newErrors.annualIncome = 'Annual income is required';
      else if (!/^\d+$/.test(formData.annualIncome)) newErrors.annualIncome = 'Must be a valid number';
      if (!formData.softwareInterest) newErrors.softwareInterest = 'Please select interest level';
    } else if (step === 3) {
      if (!formData.clientProblems.trim()) newErrors.clientProblems = 'Client problems are required';
      if (!formData.potentialClients.trim()) newErrors.potentialClients = 'Potential clients required';
      else if (!/^\d+$/.test(formData.potentialClients)) newErrors.potentialClients = 'Must be a valid number';
      if (!formData.leadGenMethod) newErrors.leadGenMethod = 'Please select a method';
      if (!formData.comfortableSales) newErrors.comfortableSales = 'Please select an option';
    } else if (step === 4) {
      if (!formData.motivation) newErrors.motivation = 'Please select motivation';
      if (!formData.revenueGoal.trim()) newErrors.revenueGoal = 'Revenue goal is required';
      else if (!/^\d+$/.test(formData.revenueGoal)) newErrors.revenueGoal = 'Must be a valid number';
      if (!formData.launchTimeline) newErrors.launchTimeline = 'Please select timeline';
      if (!formData.setupBudget) newErrors.setupBudget = 'Please select budget';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1); setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setSubmitting(true);
      try {
        const res = await fetch(`${API_URL}/partners`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) setIsSubmitted(true);
      } catch (err) {
        alert("Failed to submit. Check backend connection.");
      }
      setSubmitting(false);
    }
  };

  if (view === 'admin-login') {
    return <AdminLogin onLogin={(token) => { localStorage.setItem('clooyzi_admin_token', token); setAdminToken(token); setView('admin-dashboard'); }} onBack={() => { window.history.pushState({}, '', '/'); setView('form'); }} />;
  }

  if (view === 'admin-dashboard' && adminToken) {
    return <AdminDashboard token={adminToken} onLogout={() => { localStorage.removeItem('clooyzi_admin_token'); setAdminToken(null); window.history.pushState({}, '', '/'); setView('form'); }} />;
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col justify-center items-center bg-gray-50 px-4 min-h-screen">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 w-full max-w-md text-center">
          <div className="flex justify-center"><div className="flex justify-center items-center bg-green-100 rounded-full w-20 h-20"><CheckCircle2 className="w-12 h-12 text-green-600" /></div></div>
          <div><h1 className="mb-2 font-bold text-gray-900 text-3xl">Thank You!</h1><p className="text-gray-600">Your application has been submitted successfully</p></div>
          <button onClick={() => { setFormData(initialFormData); setCurrentStep(0); setIsSubmitted(false); }} className="bg-brand-primary hover:bg-brand-dark px-6 py-3 rounded-lg w-full font-semibold text-white transition">Submit Another</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="top-0 z-40 sticky bg-white shadow-sm border-gray-200 border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Clooyzi Logo" className="w-auto h-10 object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="font-black text-gray-900 text-2xl tracking-tight">
                Clooyzi
              </h1>

              <p className="text-gray-500 text-xs uppercase tracking-[0.25em]">
                Tech
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          <aside className="space-y-6 lg:col-span-1">
            <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-2xl">
              <h3 className="mb-4 font-semibold text-gray-900 text-sm">Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Step {currentStep + 1} of {steps.length}</span><span className="font-medium text-brand-primary">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span></div>
                <div className="bg-gray-100 rounded-full w-full h-2 overflow-hidden"><div className="bg-brand-primary h-full transition-all duration-500 ease-out" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} /></div>
              </div>
            </div>
            <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-2xl">
              <h3 className="mb-4 font-semibold text-gray-900 text-sm">Steps</h3>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-xl transition ${index === currentStep ? 'bg-brand-light border border-brand-gold/30' : index < currentStep ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${index < currentStep ? 'bg-green-500 text-white' : index === currentStep ? 'bg-brand-primary text-white' : 'bg-gray-300 text-white'}`}>{index < currentStep ? '✓' : index + 1}</div>
                    <span className={`text-sm font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm p-8 border border-gray-200 rounded-2xl">
              <div className="mb-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  {currentStep === 0 && <Step1 key="s1" data={formData} onChange={handleChange} errors={errors} />}
                  {currentStep === 1 && <Step2 key="s2" data={formData} onChange={handleChange} errors={errors} />}
                  {currentStep === 2 && <Step3 key="s3" data={formData} onChange={handleChange} errors={errors} />}
                  {currentStep === 3 && <Step4 key="s4" data={formData} onChange={handleChange} errors={errors} />}
                  {currentStep === 4 && <Step5 key="s5" data={formData} onChange={handleChange} errors={errors} />}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center gap-4 pt-8 border-gray-200 border-t">
                <button onClick={handlePrev} disabled={currentStep === 0} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${currentStep === 0 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}>
                  <ChevronLeft size={18} /> Previous
                </button>
                {currentStep === steps.length - 1 ? (
                  <button disabled={submitting} onClick={handleSubmit} className="flex justify-center items-center gap-2 bg-brand-primary hover:bg-brand-dark px-8 py-2.5 rounded-xl font-medium text-white transition">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <>Submit <ChevronRight size={18} /></>}
                  </button>
                ) : (
                  <button onClick={handleNext} className="flex justify-center items-center gap-2 bg-brand-primary hover:bg-brand-dark px-8 py-2.5 rounded-xl font-medium text-white transition">
                    Next <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}