export interface FormData {
  fullName: string;
  email: string;
  whatsapp: string;
  location: string;
  age: string;
  currentCompany: string;
  currentRole: string;
  yearsExperience: string;
  industry: string;
  existingClients: string;
  clientCount: string;
  annualIncome: string;
  softwareInterest: string;
  clientProblems: string;
  potentialClients: string;
  leadGenMethod: string;
  comfortableSales: string;
  motivation: string;
  revenueGoal: string;
  launchTimeline: string;
  setupBudget: string;
}

export interface Partner extends FormData {
  _id: string;
  adminStatus: string;
  adminComment: string;
  createdAt: string;
}
