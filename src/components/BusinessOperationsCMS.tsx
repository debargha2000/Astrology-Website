import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, FileText, Users, DollarSign, CheckSquare, Sparkles, Plus, 
  Trash2, Filter, Download, ArrowRight, CheckCircle2, AlertTriangle, 
  Clock, TrendingUp, Compass, Award, ExternalLink, Printer, Search, 
  RefreshCw, ShieldCheck, Tag, Box, ArrowLeft, Send, X, LogOut
} from 'lucide-react';
import CodebaseRatingDashboard from './CodebaseRatingDashboard';

// Firebase Integrations
import { 
  db as firestoreDb, 
  auth as firebaseAuth, 
  googleSignIn, 
  logout as firebaseLogout, 
  initAuth, 
  getAccessToken, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, collection, updateDoc } from 'firebase/firestore';

// Initial Mock Data to bootstrap immediate high-fidelity usage
const INITIAL_INVOICES = [
  { id: 'INV-2026-601', client: 'Aarav Mehta', date: '2026-05-24', item: 'Astral Prosperity Bracelet Combo', amount: 8400, status: 'Paid', alignment: 'Money Magnet (Citrine + Pyrite)' },
  { id: 'INV-2026-602', client: 'Priya Sharma', date: '2026-05-25', item: 'Evil Eye Armour Ring Set', amount: 5900, status: 'Sent', alignment: 'Protection (Black Tourmaline)' },
  { id: 'INV-2026-603', client: 'Devas Astrographics', date: '2026-05-21', item: 'Mass Calibration (12 Sacred Geodes)', amount: 48000, status: 'Paid', alignment: 'Vedic Grid Alignment' },
  { id: 'INV-2026-604', client: 'Rohit Khandelwal', date: '2026-05-18', item: 'Crown Clarity Amethyst Special', amount: 9500, status: 'Overdue', alignment: 'Saturn Node Alignment' },
  { id: 'INV-2026-605', client: 'Kiran Desai', date: '2026-05-26', item: 'Chakra Awakening Gilded Bead Set', amount: 12500, status: 'Draft', alignment: 'Full Alignment' }
];

const INITIAL_VENDORS = [
  { id: 'VND-301', name: 'Himalayan Fine Quartz Co.', contact: 'Harish Rawat', origin: 'Uttarakhand, India', rating: 5, category: 'Raw Geodes', leadTime: '3 Days', leadGems: 'Clear Quartz & Citrine', status: 'Approved' },
  { id: 'VND-302', name: 'Uruguayan Amethyst Miner\'s Guild', contact: 'Lucas Silveira', origin: 'Artigas, Uruguay', rating: 5, category: 'Crystalline Clusters', leadTime: '14 Days', leadGems: 'Deep Amethyst', status: 'Approved' },
  { id: 'VND-303', name: 'Gilded Silver & Thread Artisans', contact: 'Kavita Jewellers', origin: 'Jaipur, India', rating: 4, category: 'Mountings & Elastic Conductors', leadTime: '5 Days', leadGems: '925 Silver Links', status: 'Under Review' },
  { id: 'VND-304', name: 'Ganges Water Sanctify Source', contact: 'Pandit Shastri Ji', origin: 'Rishikesh, India', rating: 5, category: 'Sanctifying Liquids', leadTime: '2 Days', leadGems: 'Panchamrut & Ganga Jal', status: 'Approved' }
];

const INITIAL_EXPENSES = [
  { id: 'EXP-101', title: 'Lunar Cleansing Sandalwood Paste', category: 'Ritual Consecration', amount: 4200, date: '2026-05-20', notes: 'Grown on organic farms in Mysore' },
  { id: 'EXP-102', title: 'Custom Velvet Protection Pouches', category: 'Packaging', amount: 8500, date: '2026-05-22', notes: 'Saffron-dyed lining for energetic insulation' },
  { id: 'EXP-103', title: 'Laboratory Geological Verification Fees', category: 'Quality Inspection', amount: 12000, date: '2026-05-24', notes: 'Refractive Index and Mohs Hardness certification batch #411' },
  { id: 'EXP-104', title: 'Temple Astro-Scholars Commision', category: 'Ritual Consecration', amount: 25000, date: '2026-05-25', notes: 'Bathing chant leaders over moon cycles' },
  { id: 'EXP-105', title: 'Ganga Jal Sacred Liquid Logistic Refills', category: 'Sourcing & Shipping', amount: 6200, date: '2026-05-18', notes: 'Pure glass canisters from Himalayan descent coordinates' }
];

const INITIAL_TASKS = [
  { id: 'TSK-501', title: 'Wash Batch #409 Clear Quartz in Panchamrut', status: 'Water Cleanse', priority: 'High', assignee: 'Pandit Sharma', daysLeft: 1 },
  { id: 'TSK-502', title: 'Calibrate Amethyst beads with 432Hz Saturn frequencies', status: 'Moon Bath Bathing', priority: 'High', assignee: 'Shastry Ji', daysLeft: 2 },
  { id: 'TSK-503', title: 'Review laboratory hardness scores for Green Aventirine arrival', status: 'Backlog', priority: 'Medium', assignee: 'Dr. Vivek Soni', daysLeft: 5 },
  { id: 'TSK-504', title: 'Seal and pack Aarav Mehta Certified Prosperity Combo', status: 'Sealed / Composed', priority: 'Low', assignee: 'Meera Patel', daysLeft: 0 },
  { id: 'TSK-505', title: 'Program Solar Warmth on Carnelian material locks', status: 'Moon Bath Bathing', priority: 'Medium', assignee: 'Shastry Ji', daysLeft: 1 },
  { id: 'TSK-506', title: 'Verify signature holographic seals of Vedic certificate series 900', status: 'Backlog', priority: 'High', assignee: 'Meera Patel', daysLeft: 3 }
];

type CmsSubTab = 'dashboard' | 'invoices' | 'vendors' | 'expenses' | 'tasks' | 'gmail' | 'audit' | 'products' | 'site';

interface BusinessOperationsCMSProps {
  onDataChange?: () => void;
  currentProducts?: any[];
  currentWebsiteContent?: any;
}

export default function BusinessOperationsCMS({ onDataChange, currentProducts, currentWebsiteContent }: BusinessOperationsCMSProps = {}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('signtific_admin_token');
  });
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<CmsSubTab>('dashboard');

  // Core Dynamic States retrieved asynchronously
  const [invoices, setInvoices] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [terminalLog, setTerminalLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // NEW: CMS content and rollback states
  const [productsList, setProductsList] = useState<any[]>([]);
  const [checkpointsList, setCheckpointsList] = useState<any[]>([]);
  const [siteForm, setSiteForm] = useState<any>({
    brandName: '',
    brandSubtitle: '',
    heroHeadline: '',
    heroHighlight: '',
    heroParagraph: '',
    founderQuote: '',
    founderQuoteSubtitle: '',
    historyHeadline: '',
    historyParagraph1: '',
    historyParagraph2: '',
    bannerImage: ''
  });

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState<any>({
    id: '',
    name: '',
    originalPrice: 1999,
    salePrice: 1499,
    rating: 5,
    reviewsCount: 1,
    description: '',
    shortDescription: '',
    benefits: '',
    crystalsUsed: '',
    imageUrl: '',
    videoUrl: '',
    category: 'bracelet',
    stockStatus: 'in-stock',
    isBestSeller: false,
    zodiacConnection: '',
    specifications: {
      beadSize: '8mm Grade A Spheres',
      beadCount: 24,
      threadMaterial: 'Vedic Elastic Chord',
      origin: 'Finely Sourced',
      chargeTime: '3 Nights'
    }
  });

  // Filter conditions
  const [invoiceFilter, setInvoiceFilter] = useState<string>('All');
  const [expenseFilter, setExpenseFilter] = useState<string>('All');
  
  // Search state query
  const [searchQuery, setSearchQuery] = useState('');

  // Form Submission States (Slide-overs & Modals)
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Firebase + Gmail Authorization State hooks
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [useFirestoreSource, setUseFirestoreSource] = useState(false);
  const [firestoreSyncLoading, setFirestoreSyncLoading] = useState(false);
  const [firestoreSyncSuccess, setFirestoreSyncSuccess] = useState<string | null>(null);

  // Gmail administrative composer states
  const [mailRecipient, setMailRecipient] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blessing');
  const [isMailSending, setIsMailSending] = useState(false);
  const [mailStatus, setMailStatus] = useState<string | null>(null);
  const [mailHistory, setMailHistory] = useState<any[]>([
    { clientName: 'Aarav Mehta', email: 'aarav.mehta@hotmail.com', subject: 'Astral Prosperity Consecration Certificate Complete', dateStr: 'May 24, 2026' },
    { clientName: 'Priya Sharma', email: 'priya.sharma2@gmail.com', subject: 'Your Evil Eye Armour Rings Are Attuned', dateStr: 'May 25, 2026' }
  ]);

  // Active Selected item to generate high fidelity PDF previews
  const [selectedInvoicePreview, setSelectedInvoicePreview] = useState<any | null>(null);

  // Form input bindings
  const [newInvoiceForm, setNewInvoiceForm] = useState({ client: '', item: '', amount: '', alignment: '', status: 'Sent' });
  const [newVendorForm, setNewVendorForm] = useState({ name: '', contact: '', origin: '', category: '', leadTime: '', leadGems: '' });
  const [newExpenseForm, setNewExpenseForm] = useState({ title: '', category: 'Ritual Consecration', amount: '', notes: '' });
  const [newTaskForm, setNewTaskForm] = useState({ title: '', status: 'Backlog', priority: 'Medium', assignee: '', daysLeft: '3' });

  // Synchronous mock fallback for offline or setup logs
  const addTerminalLogMessage = async (msg: string) => {
    const token = localStorage.getItem('signtific_admin_token');
    if (!token) return;
    try {
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Google OAuth Auth session mount effect
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        console.log("Firebase Google Active Session recovered: ", user.email);
        
        // Auto-login exchange if we have secure session but missing token
        if (user.email?.toLowerCase() === 'debarghapakhira@gmail.com' && !localStorage.getItem('signtific_admin_token')) {
          try {
            const response = await fetch('/api/auth/google-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                uid: user.uid,
                displayName: user.displayName
              })
            });
            const data = await response.json();
            if (response.ok && data.token) {
              localStorage.setItem('signtific_admin_token', data.token);
              setIsAuthenticated(true);
            }
          } catch (e) {
            console.error('Auto-login token exchange failure:', e);
          }
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
        setUseFirestoreSource(false);
        localStorage.removeItem('signtific_admin_token');
        setIsAuthenticated(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    if (useFirestoreSource) {
      setIsLoading(true);
      try {
        const [invSnap, venSnap, expSnap, tskSnap, logSnap] = await Promise.all([
          getDocs(collection(firestoreDb, 'invoices')).catch(err => handleFirestoreError(err, OperationType.GET, 'invoices')),
          getDocs(collection(firestoreDb, 'vendors')).catch(err => handleFirestoreError(err, OperationType.GET, 'vendors')),
          getDocs(collection(firestoreDb, 'expenses')).catch(err => handleFirestoreError(err, OperationType.GET, 'expenses')),
          getDocs(collection(firestoreDb, 'tasks')).catch(err => handleFirestoreError(err, OperationType.GET, 'tasks')),
          getDocs(collection(firestoreDb, 'logs')).catch(err => handleFirestoreError(err, OperationType.GET, 'logs'))
        ]);

        const dataInvoices = invSnap.docs.map(doc => doc.data());
        const dataVendors = venSnap.docs.map(doc => doc.data());
        const dataExpenses = expSnap.docs.map(doc => doc.data());
        const dataTasks = tskSnap.docs.map(doc => doc.data());
        const dataLogs = logSnap.docs.map(doc => doc.data());

        setInvoices(dataInvoices);
        setVendors(dataVendors);
        setExpenses(dataExpenses);
        setTasks(dataTasks);
        
        // Sort logs descending/ascending
        const sortedLogs = [...dataLogs].sort((a: any, b: any) => b.id.localeCompare(a.id));
        setTerminalLog(sortedLogs.map((l: any) => `[${l.timestamp}] ${l.message}`));
      } catch (err) {
        console.error('Firestore alignment sync failure', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const token = localStorage.getItem('signtific_admin_token');
    if (!token) return;

    setIsLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [resInvoices, resVendors, resExpenses, resTasks, resLogs, resProducts, resContent, resCheckpoints] = await Promise.all([
        fetch('/api/invoices', { headers }),
        fetch('/api/vendors', { headers }),
        fetch('/api/expenses', { headers }),
        fetch('/api/tasks', { headers }),
        fetch('/api/logs', { headers }),
        fetch('/api/products', { headers }),
        fetch('/api/website/content', { headers }),
        fetch('/api/website/checkpoints', { headers })
      ]);

      if (resInvoices.status === 401 || resInvoices.status === 403) {
        handleLogout();
        return;
      }

      const [dataInvoices, dataVendors, dataExpenses, dataTasks, dataLogs, dataProducts, dataContent, dataCheckpoints] = await Promise.all([
        resInvoices.json(),
        resVendors.json(),
        resExpenses.json(),
        resTasks.json(),
        resLogs.json(),
        resProducts.json(),
        resContent.json(),
        resCheckpoints.json()
      ]);

      setInvoices(dataInvoices);
      setVendors(dataVendors);
      setExpenses(dataExpenses);
      setTasks(dataTasks);
      setProductsList(dataProducts || []);
      setSiteForm(dataContent);
      setCheckpointsList(dataCheckpoints || []);
      
      const formattedLogs = dataLogs.map((l: any) => `[${l.timestamp}] ${l.message}`);
      setTerminalLog(formattedLogs);
    } catch (err) {
      console.error('Failed to align temple records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, useFirestoreSource]);

  const handleSaveProduct = async (productData: any) => {
    const token = localStorage.getItem('signtific_admin_token');
    if (!token) return;

    try {
      setIsLoading(true);
      const cleanProduct = {
        ...productData,
        originalPrice: Number(productData.originalPrice),
        salePrice: Number(productData.salePrice),
        rating: Number(productData.rating) || 5,
        reviewsCount: Number(productData.reviewsCount) || 1,
        benefits: Array.isArray(productData.benefits) 
          ? productData.benefits 
          : String(productData.benefits).split('\n').map(b => b.trim()).filter(Boolean),
        crystalsUsed: Array.isArray(productData.crystalsUsed)
          ? productData.crystalsUsed
          : String(productData.crystalsUsed).split(',').map(c => c.trim()).filter(Boolean),
        zodiacConnection: Array.isArray(productData.zodiacConnection)
          ? productData.zodiacConnection
          : String(productData.zodiacConnection).split(',').map(z => z.trim()).filter(Boolean),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanProduct)
      });

      if (res.ok) {
        // Automatically push automatic rollback backup checkpoint
        await fetch('/api/website/checkpoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title: `AutoBackup: Updated product "${cleanProduct.name}"` })
        });

        alert(`Product "${cleanProduct.name}" synchronized and automatic backup checkpoint registered successfully!`);
        setEditingProduct(null);
        setIsAddingProduct(false);
        onDataChange?.();
        await loadData();
      } else {
        const err = await res.json();
        alert(`Error saving product: ${err.error}`);
      }
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to delete product "${name}"? An auto-backup checkpoint will be captured so you can rollback if needed.`)) return;

    const token = localStorage.getItem('signtific_admin_token');
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        await fetch('/api/website/checkpoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title: `AutoBackup: Deleted product "${name}"` })
        });

        alert(`Product "${name}" deleted.`);
        onDataChange?.();
        await loadData();
      } else {
        alert("Failed to delete product.");
      }
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('signtific_admin_token');
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch('/api/website/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(siteForm)
      });

      if (res.ok) {
        await fetch('/api/website/checkpoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title: `AutoBackup: Website customization settings updated` })
        });

        alert("Website copy and imagery adjustments synchronized live and fully backed up!");
        onDataChange?.();
        await loadData();
      } else {
        alert("Failed to update website customization.");
      }
    } catch (e: any) {
      alert(`Update error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateManualCheckpoint = async () => {
    const title = prompt("Enter a description title for this backup checkpoint (e.g. 'Before catalog revision'):");
    if (!title) return;

    const token = localStorage.getItem('signtific_admin_token');
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch('/api/website/checkpoints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });

      if (res.ok) {
        alert("Manual Checkpoint saved!");
        await loadData();
      } else {
        alert("Failed to create checkpoint.");
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = async (id: string, title: string) => {
    if (!confirm(`WARNING: Are you sure you want to rollback to checkpoint "${title}"? This will overwrite your current live website content AND products with the values stored in this backup cycle.`)) return;

    const token = localStorage.getItem('signtific_admin_token');
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/website/checkpoints/${id}/rollback`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert(`Rollback succeeded! Reverted successfully to: ${title}`);
        onDataChange?.();
        await loadData();
      } else {
        alert("Failed to execute system rollback.");
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setIsLoading(true);
    try {
      const result = await googleSignIn();
      if (!result) {
        setAuthError('Google Sign-In was cancelled or failed.');
        setIsLoading(false);
        return;
      }

      const { user } = result;
      if (user.email?.toLowerCase() !== 'debarghapakhira@gmail.com') {
        setAuthError(`Access Restricted: Only debarghapakhira@gmail.com is authorized. Logged in as ${user.email}`);
        await firebaseLogout();
        setIsLoading(false);
        return;
      }

      // Exchange for a secure backend-signed session JWT
      const response = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName
        })
      });

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('signtific_admin_token', data.token);
        setIsAuthenticated(true);
        setGoogleUser(user);
      } else {
        setAuthError(data.error || 'Server validation failed. Access denied.');
        await firebaseLogout();
      }
    } catch (err: any) {
      console.error('Google alignment login failure:', err);
      setAuthError('Connection anomaly or authentication error occurred during Google verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('signtific_admin_token');
    setIsAuthenticated(false);
    setGoogleUser(null);
    setGoogleToken(null);
    setUseFirestoreSource(false);
    try {
      await firebaseLogout();
    } catch (e) {
      console.error('Logout sync anomaly:', e);
    }
  };

  // Create Invoice logic
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceForm.client || !newInvoiceForm.amount) return;
    
    const customId = `INV-2026-${Math.floor(Math.random() * 900 + 100)}`;
    const invoicePayload = {
      id: customId,
      client: newInvoiceForm.client,
      date: new Date().toISOString().split('T')[0],
      item: newInvoiceForm.item || 'Planetary Crystal Alignment Package',
      amount: parseFloat(newInvoiceForm.amount) || 0,
      status: newInvoiceForm.status as any,
      alignment: newInvoiceForm.alignment || 'Universal Alignment'
    };

    if (useFirestoreSource) {
      if (!googleUser) {
        alert("Please authorize Google Sign-In to execute Cloud Firestore operations.");
        return;
      }
      try {
        await setDoc(doc(firestoreDb, 'invoices', customId), invoicePayload)
          .catch(err => handleFirestoreError(err, OperationType.CREATE, `invoices/${customId}`));
        
        // Log to Firestore
        const logId = `log-${Date.now()}`;
        const logTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        await setDoc(doc(firestoreDb, 'logs', logId), {
          id: logId,
          timestamp: logTimestamp,
          message: `Created High-Precision Invoice ${customId} for ${invoicePayload.client} (₹${invoicePayload.amount}) via Firestore Client.`
        });

        setShowAddInvoiceModal(false);
        setNewInvoiceForm({ client: '', item: '', amount: '', alignment: '', status: 'Sent' });
        await loadData();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const token = localStorage.getItem('signtific_admin_token');
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(invoicePayload)
      });

      if (response.ok) {
        setShowAddInvoiceModal(false);
        setNewInvoiceForm({ client: '', item: '', amount: '', alignment: '', status: 'Sent' });
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Vendor logic
  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorForm.name || !newVendorForm.contact) return;

    const customId = `VND-${Math.floor(Math.random() * 90 + 300)}`;
    const vendorPayload = {
      id: customId,
      name: newVendorForm.name,
      contact: newVendorForm.contact,
      origin: newVendorForm.origin || 'Kashmir Basin, India',
      category: newVendorForm.category || 'Raw Geodes',
      leadTime: newVendorForm.leadTime || '5 Days',
      leadGems: newVendorForm.leadGems || 'Natural Crystal Beads',
      rating: 5,
      status: 'Approved' as any
    };

    if (useFirestoreSource) {
      if (!googleUser) {
        alert("Please authorize Google Sign-In to execute Cloud Firestore operations.");
        return;
      }
      try {
        await setDoc(doc(firestoreDb, 'vendors', customId), vendorPayload)
          .catch(err => handleFirestoreError(err, OperationType.CREATE, `vendors/${customId}`));
        
        // Log to Firestore
        const logId = `log-${Date.now()}`;
        const logTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        await setDoc(doc(firestoreDb, 'logs', logId), {
          id: logId,
          timestamp: logTimestamp,
          message: `Onboarded newly registered artisan and geode vendor: ${vendorPayload.name} via Firestore.`
        });

        setShowAddVendorModal(false);
        setNewVendorForm({ name: '', contact: '', origin: '', category: '', leadTime: '', leadGems: '' });
        await loadData();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const token = localStorage.getItem('signtific_admin_token');
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vendorPayload)
      });

      if (response.ok) {
        setShowAddVendorModal(false);
        setNewVendorForm({ name: '', contact: '', origin: '', category: '', leadTime: '', leadGems: '' });
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Expense logic
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseForm.title || !newExpenseForm.amount) return;

    const customId = `EXP-${Math.floor(Math.random() * 90 + 100)}`;
    const expensePayload = {
      id: customId,
      title: newExpenseForm.title,
      category: newExpenseForm.category,
      amount: parseFloat(newExpenseForm.amount) || 0,
      date: new Date().toISOString().split('T')[0],
      notes: newExpenseForm.notes || ''
    };

    if (useFirestoreSource) {
      if (!googleUser) {
        alert("Please authorize Google Sign-In to execute Cloud Firestore operations.");
        return;
      }
      try {
        await setDoc(doc(firestoreDb, 'expenses', customId), expensePayload)
          .catch(err => handleFirestoreError(err, OperationType.CREATE, `expenses/${customId}`));

        // Log to Firestore
        const logId = `log-${Date.now()}`;
        const logTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        await setDoc(doc(firestoreDb, 'logs', logId), {
          id: logId,
          timestamp: logTimestamp,
          message: `Logged operations opex: ${expensePayload.title} (₹${expensePayload.amount}) via Firestore.`
        });

        setShowAddExpenseModal(false);
        setNewExpenseForm({ title: '', category: 'Ritual Consecration', amount: '', notes: '' });
        await loadData();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const token = localStorage.getItem('signtific_admin_token');
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expensePayload)
      });

      if (response.ok) {
        setShowAddExpenseModal(false);
        setNewExpenseForm({ title: '', category: 'Ritual Consecration', amount: '', notes: '' });
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Task logic
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title || !newTaskForm.assignee) return;

    const customId = `TSK-${Math.floor(Math.random() * 90 + 500)}`;
    const taskPayload = {
      id: customId,
      title: newTaskForm.title,
      status: newTaskForm.status as any,
      priority: newTaskForm.priority as any,
      assignee: newTaskForm.assignee,
      daysLeft: parseInt(newTaskForm.daysLeft) || 3
    };

    if (useFirestoreSource) {
      if (!googleUser) {
        alert("Please authorize Google Sign-In to execute Cloud Firestore operations.");
        return;
      }
      try {
        await setDoc(doc(firestoreDb, 'tasks', customId), taskPayload)
          .catch(err => handleFirestoreError(err, OperationType.CREATE, `tasks/${customId}`));

        // Log to Firestore
        const logId = `log-${Date.now()}`;
        const logTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        await setDoc(doc(firestoreDb, 'logs', logId), {
          id: logId,
          timestamp: logTimestamp,
          message: `Created Astro Task: ${taskPayload.title} assigned to ${taskPayload.assignee} via Firestore.`
        });

        setShowAddTaskModal(false);
        setNewTaskForm({ title: '', status: 'Backlog', priority: 'Medium', assignee: '', daysLeft: '3' });
        await loadData();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const token = localStorage.getItem('signtific_admin_token');
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskPayload)
      });

      if (response.ok) {
        setShowAddTaskModal(false);
        setNewTaskForm({ title: '', status: 'Backlog', priority: 'Medium', assignee: '', daysLeft: '3' });
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper action to advance task status
  const moveTask = async (taskId: string, direction: 'forward' | 'backward') => {
    const statuses = ['Backlog', 'Water Cleanse', 'Moon Bath Bathing', 'Sealed / Composed'];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIdx = statuses.indexOf(task.status);
    let nextIdx = currentIdx;
    if (direction === 'forward' && currentIdx < statuses.length - 1) {
      nextIdx += 1;
    } else if (direction === 'backward' && currentIdx > 0) {
      nextIdx -= 1;
    }
    
    if (nextIdx !== currentIdx) {
      const nextStatus = statuses[nextIdx];

      if (useFirestoreSource) {
        if (!googleUser) {
          alert("Please authorize Google Sign-In to execute Cloud Firestore operations.");
          return;
        }
        try {
          await updateDoc(doc(firestoreDb, 'tasks', taskId), { status: nextStatus })
            .catch(err => handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`));
          
          await loadData();
        } catch (err) {
          console.error(err);
        }
        return;
      }

      const token = localStorage.getItem('signtific_admin_token');
      try {
        const response = await fetch(`/api/tasks/${taskId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: nextStatus })
        });
        if (response.ok) {
          await loadData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Integrated Gmail Email Dispatch Client
  const sendGmailEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailRecipient || !mailSubject || !mailBody) {
      alert("Missing required fields: Recipient, Subject, or Body.");
      return;
    }

    setIsMailSending(true);
    setMailStatus(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Missing active Google OAuth credentials. Please authorize above first.");
      }

      // Build valid standard RFC 2822 MIME message
      const sanitizedRecipient = mailRecipient.replace(/\r?\n|\r/g, ' ').trim();
      const sanitizedSubject = mailSubject.replace(/\r?\n|\r/g, ' ').trim();
      
      const mimeMessage = [
        `To: ${sanitizedRecipient}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${sanitizedSubject}`,
        '',
        mailBody
      ].join('\r\n');

      // Base64URL encode MIME string safely
      const encodedMsg = btoa(unescape(encodeURIComponent(mimeMessage)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // POST to official Gmail REST endpoint
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: encodedMsg })
      });

      if (!response.ok) {
        const errDetails = await response.json().catch(() => ({}));
        throw new Error(`Gmail API Gateway rejection: ${errDetails?.error?.message || response.statusText}`);
      }

      // Add to sending logs
      setMailHistory(prev => [
        {
          clientName: 'Staff Dispatcher',
          email: mailRecipient,
          subject: mailSubject,
          dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        },
        ...prev
      ]);
      setMailStatus("success");
      setMailRecipient('');
      setMailSubject('');
      setMailBody('');
    } catch (err: any) {
      console.error("Gmail Dispatch Error:", err);
      setMailStatus(`error: ${err?.message || "Failed to dispatch Gmail message."}`);
    } finally {
      setIsMailSending(false);
    }
  };

  const loadPresetTemplate = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (templateKey === 'blessing') {
      setMailSubject("Astral Prosperity Crystal Consecration Notice");
      setMailBody(
        "Hari Om,\n\nWe are pleased to inform you that your customized planetary crystal beads have been aligned and bathed under strict Vedic chants, natural sandalwood pastes, and holy Ganga Jal coordinate bathes over lunar cycle nodes.\n\nYour holographic sacred authenticity attestation certificate series has been printed and sealed in velvet protective pouches. Standard dispatch routing will begin shortly.\n\nBlessed Journeys,\nAura & Stone Dispatch Core"
      );
    } else if (templateKey === 'shipping') {
      setMailSubject("Sacred Vedic Gems Consignment Dispatched");
      setMailBody(
        "Dear Customer,\n\nYour attuned gemstone crystal matrix has been safely layered in saffron-dyed protection velvet wraps and shipped with premium express mail. Your energetic insulation packages are locked.\n\nYour batch code tracking references are active. Monitor state alignment gracefully.\n\nNamaste,\nOperations Team, Jaipur Hub"
      );
    } else if (templateKey === 'ledger') {
      setMailSubject("Commercial Attestation Ledger Attuned & Invoice Finalized");
      setMailBody(
        "Hello Astrolabe Business Partner,\n\nThis is to certify that your commercial partner invoice has been safely finalized and posted to our real-time secure storage grid.\n\nYou can access or print your high-definition aligned accounting overview directly within our staff terminal dashboard anytime.\n\nRegards,\nAura & Stone Billing Division"
      );
    }
  };

  // Computed metrics Calculations
  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const paidInvoiced = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingInvoiced = invoices.filter(i => i.status === 'Sent' || i.status === 'Draft').reduce((acc, curr) => acc + curr.amount, 0);
  const overdueInvoiced = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

  const totalOpex = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const categoryExpenseTotals = expenses.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  // Custom visual components for elegant charts (instead of canvas packages)
  // Clean mathematical SVG Area Chart for Financial Progression
  const billingChartPoints = "10,95  120,80  240,65  360,45  480,30  600,15";
  const expenseChartPoints = "10,90  120,82  240,75  360,60  480,50  600,45";

  // Filtered lists
  const searchedInvoices = invoices.filter(i => {
    const matchesSearch = i.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = invoiceFilter === 'All' ? true : i.status === invoiceFilter;
    return matchesSearch && matchesFilter;
  });

  const searchedExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = expenseFilter === 'All' ? true : e.category === expenseFilter;
    return matchesSearch && matchesFilter;
  });

  const searchedVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.leadGems.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-transparent px-4 py-12 select-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-md w-full bg-[#FAF7F2] border border-[#D1CEBF] rounded-3xl p-8 md:p-10 shadow-xl space-y-8 hover:shadow-2xl transition-all duration-700"
        >
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 bg-[#1A1A1A] rounded-2xl text-[#FAF7F2] shadow-md mb-2">
              <Sparkles className="h-6 w-6 text-[#A6A18F]" />
            </div>
            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] tracking-wider">
              Sacred Gateway <br/>
              <span className="font-semibold text-[#A6A18F]">CMS Operations</span>
            </h2>
            <p className="text-xs text-[#1A1A1A]/60 max-w-xs mx-auto leading-relaxed font-light">
              This portal is strictly reserved for authorized administrative staff. Verify your Google Identity to calibrate crystallographic supply chains.
            </p>
          </div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-[11px] font-mono leading-relaxed"
            >
              ⚠️ {authError}
            </motion.div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] disabled:bg-[#857F75]/50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-mono text-xs uppercase tracking-widest font-bold border border-[#D1CEBF]/20 shadow-md transition-all duration-300 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="h-4 w-4 mr-1 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.43c0,-0.64 -0.06,-1.25 -0.16,-1.84z" fill="#4285F4" />
                    <path d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.91,0.61 -2.08,0.97 -3.3,0.97c-2.33,0 -4.31,-1.57 -5.02,-3.69H2.92v2.66C4.41,18.73 7.96,20.6 12,20.6z" fill="#34A853" />
                    <path d="M6.98,13.13C6.8,12.57 6.7,11.97 6.7,11.35c0,-0.62 0.1,-1.22 0.28,-1.78l-2.66,-2.66C3.47,8.21 3,9.72 3,11.35c0,1.63 0.47,3.14 1.32,4.44l2.66,-2.66z" fill="#FBBC05" />
                    <path d="M12,5.18c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,2.44 14.42,1.6 12,1.6C7.96,1.6 4.41,3.47 2.92,6.47l2.66,2.66C6.29,7.01 8.27,5.18 12,5.18z" fill="#EA4335" />
                  </g>
                </svg>
              )}
              <span>{isLoading ? 'Verifying...' : 'Sign In with Google'}</span>
            </button>
            
            <div className="text-center font-mono text-[9px] text-[#857F75] uppercase tracking-widest pt-2">
              🔒 Standard Single Admin Enforced
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      
      {/* Editorial Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#D1CEBF] pb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#1A1A1A] text-[#FAF7F2] font-mono text-[9px] uppercase tracking-widest rounded-md font-bold flex items-center gap-1.5 shadow-md">
              <Sparkles className="h-3 w-3 text-[#A6A18F]" /> INTERNAL STAFF ONLY
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-[#A6A18F] font-bold uppercase tracking-wider">Operational Engine Live</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide">
            Aura & Stone <span className="font-semibold text-[#A6A18F]">CMS Portal</span>
          </h1>
          <p className="text-xs text-[#1A1A1A]/60 max-w-2xl leading-relaxed font-light">
            An all-in-one content, commerce, and operations suite designed for business success. Program crystal batches, track mineral supply chains, record purifying expenses, and verify global Vedic invoices.
          </p>

          {/* Active Administrator Identity Badge with Logout Button */}
          {googleUser && (
            <div className="pt-3 flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 bg-[#E8E4D9] border border-[#D1CEBF]/40 py-1.5 px-3 rounded-xl shadow-3xs">
                {googleUser.photoURL ? (
                  <img 
                    src={googleUser.photoURL} 
                    alt="Operator" 
                    className="h-5 w-5 rounded-full border border-[#D1CEBF]" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif text-[10px] border border-[#D1CEBF]">
                    {googleUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="font-bold text-[#1A1A1A] tracking-wider">ADMINISTRATOR:</span>
                  <span className="text-[#857F75] font-medium">{googleUser.email}</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="cursor-pointer font-mono text-[10px] font-bold uppercase tracking-widest bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors py-1.5 px-3 rounded-xl flex items-center gap-1 border border-red-200/50 shadow-3xs"
                title="Authenticate Logout"
              >
                <LogOut className="h-3 w-3 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Rapid Tab Selector Pill */}
        <div className="flex flex-wrap lg:flex-nowrap bg-[#FAF7F2]/80 border border-[#D1CEBF] p-1.5 rounded-2xl shadow-sm gap-1 self-start lg:self-center items-center font-sans">
          {(['dashboard', 'invoices', 'vendors', 'expenses', 'tasks', 'gmail', 'audit', 'products', 'site'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery('');
                }}
                className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all gap-1.5 flex items-center ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-white shadow-md border-b-2 border-[#A6A18F]/40' 
                    : 'text-[#857F75] hover:text-[#1A1A1A] hover:bg-[#E8E6E1]/50'
                }`}
              >
                {tab === 'dashboard' && <Compass className="h-3.5 w-3.5" />}
                {tab === 'invoices' && <FileText className="h-3.5 w-3.5" />}
                {tab === 'vendors' && <Users className="h-3.5 w-3.5" />}
                {tab === 'expenses' && <DollarSign className="h-3.5 w-3.5" />}
                {tab === 'tasks' && <CheckSquare className="h-3.5 w-3.5" />}
                {tab === 'gmail' && <Send className="h-3.5 w-3.5 text-[#D4AF37]" />}
                {tab === 'audit' && <Award className="h-3.5 w-3.5" />}
                {tab === 'products' && <Box className="h-3.5 w-3.5 text-[#D4AF37]" />}
                {tab === 'site' && <Sparkles className="h-3.5 w-3.5 text-emerald-600" />}
                <span className="hidden sm:inline text-[11px] font-bold">
                  {tab === 'gmail' && 'Gmail'}
                  {tab === 'products' && 'Products'}
                  {tab === 'site' && 'Site builder'}
                  {tab !== 'gmail' && tab !== 'products' && tab !== 'site' && tab}
                </span>
              </button>
            );
          })}
          
          <div className="h-6 w-[1px] bg-[#D1CEBF] mx-1 hidden sm:block" />
          
          <button
            onClick={handleLogout}
            className="cursor-pointer px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-widest text-red-700 hover:text-red-900 hover:bg-red-50 transition-all flex items-center gap-1.5 border border-dashed border-red-200/40"
            title="Disconnect administrator session"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* CORE PAGES ROUTER VIEW */}
      
      {/* SUB-PAGE: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Cloud Firestore Sync & Storage Engine Board */}
          <div className="bg-[#FAF7F2] border border-[#D1CEBF] p-6 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xs">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 bg-[#1C1C1C] text-sky-200 font-mono text-[9px] uppercase tracking-widest rounded-md font-bold flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="h-3 w-3 text-[#D4AF37]" /> FIREBASE CLOUD FORTS
                </span>
                <span className="text-[10px] font-mono text-[#857F75] uppercase tracking-wider font-bold">PROJECT: gen-lang-client-0811246245</span>
              </div>
              <h2 className="font-serif text-xl font-light text-[#1A1A1A] tracking-wider">
                Vedas Cloud <span className="font-semibold text-[#A6A18F]">Storage Core Controller</span>
              </h2>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-sans max-w-3xl font-light">
                Configure your dual-mode storage core. Transition seamlessly between your standard low-latency flat-file cluster and your secure mathematically-hardened **Google Cloud Firestore**. Synced operations conform strictly to deployed Zero-Trust cellular rules.
              </p>
              {firestoreSyncSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{firestoreSyncSuccess}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-4 flex flex-col gap-3 justify-center">
              <div className="flex items-center justify-between p-2.5 bg-white border border-[#D1CEBF] rounded-2xl gap-4">
                <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">Active Core:</span>
                <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#D1CEBF]/45">
                  <button
                    onClick={() => setUseFirestoreSource(false)}
                    className={`px-2.5 py-1 text-[9.5px] font-mono rounded-lg font-bold uppercase tracking-widest cursor-pointer transition-all ${
                      !useFirestoreSource
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'text-[#857F75] hover:text-[#1A1A1A]'
                    }`}
                  >
                    Local Flat
                  </button>
                  <button
                    onClick={() => {
                      if (!googleUser) {
                        alert("Sign in to your Google Account first (in the Gmail tab or via the authorize button) to utilize Cloud Firestore.");
                        return;
                      }
                      setUseFirestoreSource(true);
                    }}
                    className={`px-2.5 py-1 text-[9.5px] font-mono rounded-lg font-bold uppercase tracking-widest cursor-pointer transition-all ${
                      useFirestoreSource
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-[#857F75] hover:text-emerald-800'
                    }`}
                  >
                    Firestore
                  </button>
                </div>
              </div>

              {googleUser ? (
                <button
                  onClick={async () => {
                    // Sync implementation helper local
                    setFirestoreSyncLoading(true);
                    setFirestoreSyncSuccess(null);
                    try {
                      const token = localStorage.getItem('signtific_admin_token');
                      const headers = { 'Authorization': `Bearer ${token}` };
                      const [resInvoices, resVendors, resExpenses, resTasks, resLogs] = await Promise.all([
                        fetch('/api/invoices', { headers }),
                        fetch('/api/vendors', { headers }),
                        fetch('/api/expenses', { headers }),
                        fetch('/api/tasks', { headers }),
                        fetch('/api/logs', { headers })
                      ]);

                      const [dataInvoices, dataVendors, dataExpenses, dataTasks, dataLogs] = await Promise.all([
                        resInvoices.json(),
                        resVendors.json(),
                        resExpenses.json(),
                        resTasks.json(),
                        resLogs.json()
                      ]);

                      for (const inv of dataInvoices) {
                        await setDoc(doc(firestoreDb, 'invoices', inv.id), {
                          id: inv.id,
                          client: inv.client,
                          date: inv.date,
                          item: inv.item,
                          amount: inv.amount,
                          status: inv.status,
                          alignment: inv.alignment
                        }).catch(err => handleFirestoreError(err, OperationType.CREATE, `invoices/${inv.id}`));
                      }

                      for (const ven of dataVendors) {
                        await setDoc(doc(firestoreDb, 'vendors', ven.id), {
                          id: ven.id,
                          name: ven.name,
                          contact: ven.contact,
                          origin: ven.origin,
                          rating: ven.rating,
                          category: ven.category,
                          leadTime: ven.leadTime,
                          leadGems: ven.leadGems,
                          status: ven.status
                        }).catch(err => handleFirestoreError(err, OperationType.CREATE, `vendors/${ven.id}`));
                      }

                      for (const exp of dataExpenses) {
                        await setDoc(doc(firestoreDb, 'expenses', exp.id), {
                          id: exp.id,
                          title: exp.title,
                          category: exp.category,
                          amount: exp.amount,
                          date: exp.date,
                          notes: exp.notes
                        }).catch(err => handleFirestoreError(err, OperationType.CREATE, `expenses/${exp.id}`));
                      }

                      for (const tsk of dataTasks) {
                        await setDoc(doc(firestoreDb, 'tasks', tsk.id), {
                          id: tsk.id,
                          title: tsk.title,
                          status: tsk.status,
                          priority: tsk.priority,
                          assignee: tsk.assignee,
                          daysLeft: tsk.daysLeft
                        }).catch(err => handleFirestoreError(err, OperationType.CREATE, `tasks/${tsk.id}`));
                      }

                      const logId = `log-${Date.now()}`;
                      const logTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                      await setDoc(doc(firestoreDb, 'logs', logId), {
                        id: logId,
                        timestamp: logTimestamp,
                        message: `DATABASE SYNCHRONIZATION: Local flat-files crawled and synchronized to secure Cloud Firestore collections under: ${googleUser.email}`
                      });

                      setFirestoreSyncSuccess(`Successfully synchronized e-commerce ledger collections to Cloud Firestore!`);
                      setUseFirestoreSource(true);
                      await loadData();
                    } catch (err: any) {
                      console.error('Data Sync Error:', err);
                      alert('Sync Failed: Check application console logs for strict rules details.');
                    } finally {
                      setFirestoreSyncLoading(false);
                    }
                  }}
                  disabled={firestoreSyncLoading}
                  className="cursor-pointer text-center bg-[#1A1A1A] hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {firestoreSyncLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#D4AF37]" />
                      <span>Syncing Collections...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>Sync Core to Firestore</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      await googleSignIn();
                    } catch (e) {
                      alert("Handshake denied: Check secure credentials.");
                    }
                  }}
                  className="cursor-pointer text-center bg-white hover:bg-[#FAF7F2] border border-[#D1CEBF] text-[#1A1A1A] py-3.5 px-4 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.543 0 2.95.549 4.053 1.458l3.142-3.14C18.91 1.776 15.783 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.262 0 11.36-4.99 11.36-11.24 0-.7-.075-1.378-.195-2.015H12.24z"
                    />
                  </svg>
                  <span>Authorize Google Cloud</span>
                </button>
              )}
            </div>
          </div>

          {/* Key Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-white border border-[#D1CEBF] rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#FAF7F2] rounded-bl-full pointer-events-none flex items-center justify-end p-2 text-[#D1CEBF]">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#A6A18F] font-bold">Total billing ledger</span>
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-serif text-[#1A1A1A] font-light">₹{(totalInvoiced).toLocaleString('en-IN')}</span>
                <p className="text-[9.5px] text-[#A6A18F] font-mono leading-none">Paid Attuned: ₹{paidInvoiced.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="p-6 bg-white border border-[#D1CEBF] rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#FAF7F2] rounded-bl-full pointer-events-none flex items-center justify-end p-2 text-[#D1CEBF]">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#A6A18F] font-bold">MINERAL SUPPLY PARTNERS</span>
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-serif text-[#1A1A1A] font-light">{vendors.length} Vendors</span>
                <p className="text-[9.5px] text-emerald-700 font-mono leading-none">All geological matrix verified</p>
              </div>
            </div>

            <div className="p-6 bg-white border border-[#D1CEBF] rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#FAF7F2] rounded-bl-full pointer-events-none flex items-center justify-end p-2 text-[#D1CEBF]">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#A6A18F] font-bold">TEMPLE PURIFY EXPENDITURES</span>
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-serif text-[#1A1A1A] font-light">₹{(totalOpex).toLocaleString('en-IN')}</span>
                <p className="text-[9.5px] text-[#A6A18F] font-mono leading-none">Acoustics & Sandalwood: 62%</p>
              </div>
            </div>

            <div className="p-6 bg-white border border-[#D1CEBF] rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#FAF7F2] rounded-bl-full pointer-events-none flex items-center justify-end p-2 text-[#D1CEBF]">
                <CheckSquare className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#A6A18F] font-bold">Attunement sprint schedule</span>
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-serif text-[#1A1A1A] font-light">{tasks.filter(t => t.status !== 'Sealed / Composed').length} Active Tasks</span>
                <p className="text-[9.5px] text-amber-700 font-mono leading-none">4 High Priority items pending bath</p>
              </div>
            </div>

          </div>

          {/* Graphical Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SVG Visual Progression Charts */}
            <div className="lg:col-span-8 bg-white border border-[#D1CEBF] p-6 rounded-3xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#A6A18F] uppercase font-bold block">Consolidated Analytics</span>
                  <h3 className="font-serif text-lg text-[#1A1A1A]">Operational Cashflow vs. Purifying Expenses</h3>
                </div>
                <div className="flex gap-4 font-mono text-[9px] font-bold uppercase tracking-wide text-[#1A1A1A]/80">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
                    <span>Invoiced Volume</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
                    <span>purify expenses</span>
                  </div>
                </div>
              </div>

              {/* Vector SVG Multi-Line Area Chart Representation */}
              <div className="relative pt-6 h-52 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="600" y2="20" stroke="#FAF7F2" strokeWidth="1" strokeDasharray="3" />
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#FAF7F2" strokeWidth="1" strokeDasharray="3" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="#FAF7F2" strokeWidth="1" strokeDasharray="3" />
                  
                  {/* Fill Area 1 (Invoiced) */}
                  <path d={`M 10,95 L ${billingChartPoints} L 600,95 Z`} fill="rgba(4, 120, 87, 0.08)" />
                  {/* Fill Area 2 (Expenses) */}
                  <path d={`M 10,95 L ${expenseChartPoints} L 600,95 Z`} fill="rgba(217, 119, 6, 0.05)" />

                  {/* Line Draw 1 (Invoiced) */}
                  <polyline points={billingChartPoints} fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Line Draw 2 (Expenses) */}
                  <polyline points={expenseChartPoints} fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="4" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Hotspots / Dots on key nodes */}
                  <circle cx="10" cy="95" r="3.5" fill="#047857" />
                  <circle cx="360" cy="45" r="4.5" fill="#D4AF37" stroke="#FAF7F2" strokeWidth="1.5" />
                  <circle cx="600" cy="15" r="4" fill="#047857" />
                </svg>

                {/* X Axis Time Labels */}
                <div className="flex justify-between font-mono text-[9px] text-[#A6A18F] pt-3 uppercase tracking-widest border-t border-[#FAF7F2]/60 mt-2">
                  <span>Q2 2025</span>
                  <span>June Solstice</span>
                  <span>Sept Equinox</span>
                  <span>Makar Sankranti</span>
                  <span>Chaitra Moon</span>
                  <span>Today (Waxing)</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Logging Core terminal - helps operational overview */}
            <div className="lg:col-span-4 bg-[#1A1A1A] border border-[#D1CEBF]/20 rounded-3xl p-6 text-white space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-1 b-b border-white/10 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] bg-red-800 text-white px-2 py-0.5 rounded leading-none">REAL-TIME</span>
                  <span className="font-mono text-[9px] text-[#A6A18F] uppercase tracking-wider font-bold">Operations Logs</span>
                </div>
                <h4 className="font-serif text-[#FAF7F2] font-semibold text-sm">Sacred Ledger Feed</h4>
              </div>

              {/* Logs output */}
              <div className="flex-1 font-mono text-[10px] space-y-2 text-[#FAF7F2]/80 max-h-36 overflow-y-auto pr-1 scrollbar-none">
                {terminalLog.map((log, i) => (
                  <p key={i} className="line-clamp-2 hover:text-[#D4AF37] transition-colors leading-relaxed">
                    {log}
                  </p>
                ))}
              </div>

              {/* Action shortcuts */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold tracking-widest">Rapid Quick Triggers</span>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                  <button 
                    onClick={() => {
                      addTerminalLogMessage("MANUAL OVERRIDE: Moon purification frequencies recalibrated at 432Hz.");
                    }}
                    className="cursor-pointer text-left bg-white/10 hover:bg-white/15 text-white p-2 rounded border border-white/5 transition-colors uppercase font-bold"
                  >
                    ✦ Calm Freq Bath
                  </button>
                  <button 
                    onClick={() => {
                      addTerminalLogMessage("MANUAL OVERRIDE: Solder seal validation triggered on dispatch bulk packaging.");
                    }}
                    className="cursor-pointer text-left bg-white/10 hover:bg-white/15 text-white p-2 rounded border border-white/5 transition-colors uppercase font-bold"
                  >
                    ⚡ Solder Seal Check
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Secondary overview table combining status logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Priority task overview */}
            <div className="bg-white border border-[#D1CEBF] rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-3">
                <h3 className="font-serif text-base text-[#1A1A1A]">Urgent Attunement Tasks</h3>
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className="cursor-pointer font-mono text-[9px] text-[#A6A18F] hover:text-[#1A1A1A] border-b border-dashed border-[#A6A18F] pb-0.5 uppercase tracking-widest"
                >
                  Go to Kanban Board →
                </button>
              </div>

              <div className="space-y-3">
                {tasks.filter(t => t.priority === 'High' && t.status !== 'Sealed / Composed').slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between bg-[#FAF7F2]/45 border border-[#D1CEBF]/40 p-3 rounded-xl hover:border-[#D1CEBF] transition-colors">
                    <div className="space-y-1">
                      <span className="block text-xs text-[#1A1A1A] font-medium leading-normal">{task.title}</span>
                      <div className="flex gap-2 items-center text-[9px] font-mono">
                        <span className="text-[#A6A18F]">{task.assignee}</span>
                        <span className="text-[#1A1A1A]/40">•</span>
                        <span className="text-red-850 font-bold bg-amber-100 px-1 py-0.5 rounded leading-none">{task.status}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#A6A18F] whitespace-nowrap bg-white border border-[#D1CEBF]/45 px-2 py-1 rounded-lg">
                      {task.daysLeft} Day{task.daysLeft > 1 ? 's' : ''} Left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sourcing Vendor status */}
            <div className="bg-white border border-[#D1CEBF] rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-3">
                <h3 className="font-serif text-base text-[#1A1A1A]">Geological Sourcing Vendors</h3>
                <button 
                  onClick={() => setActiveTab('vendors')}
                  className="cursor-pointer font-mono text-[9px] text-[#A6A18F] hover:text-[#1A1A1A] border-b border-dashed border-[#A6A18F] pb-0.5 uppercase tracking-widest"
                >
                  Manage Sourcing Co. →
                </button>
              </div>

              <div className="space-y-3">
                {vendors.slice(0, 3).map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between bg-[#FAF7F2]/45 border border-[#D1CEBF]/40 p-3 rounded-xl">
                    <div className="space-y-1">
                      <span className="block text-xs text-[#1A1A1A] font-semibold">{vendor.name}</span>
                      <p className="text-[9.5px] text-[#857F75] font-mono leading-none">{vendor.leadGems} • {vendor.origin}</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-250 px-2.5 py-1 rounded-full font-bold">
                      {vendor.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-PAGE: INVOICING CORE MODULE */}
      {activeTab === 'invoices' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            
            {/* Search and filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64 max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-[#A6A18F]" />
                <input
                  type="text"
                  placeholder="Query clients or serial number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 bg-white border border-[#D1CEBF] rounded-xl py-2 px-3 text-xs outline-none focus:border-[#1A1A1A]"
                />
              </div>

              {/* Status categories filter picker */}
              <div className="flex bg-[#FAF7F2] border border-[#D1CEBF] p-1 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider">
                {['All', 'Paid', 'Sent', 'Overdue', 'Draft'].map((state) => (
                  <button
                    key={state}
                    onClick={() => setInvoiceFilter(state)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all ${
                      invoiceFilter === state 
                        ? 'bg-white text-[#1A1A1A] shadow-sm' 
                        : 'text-[#857F75] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Invoice Trigger CTA */}
            <button
              onClick={() => setShowAddInvoiceModal(true)}
              className="cursor-pointer w-full sm:w-auto bg-[#1A1A1A] hover:bg-[#322D2C] text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md border border-[#D1CEBF]/20 transition-transform active:scale-98"
            >
              <Plus className="h-4 w-4 text-[#A6A18F]" /> Create Client Invoice
            </button>

          </div>

          {/* Dynamic aggregate summaries */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#FAF7F2]/40 border border-[#D1CEBF] rounded-2xl p-4 text-center">
            <div className="py-2">
              <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold tracking-widest">Revenue Realized</span>
              <span className="text-xl font-serif font-semibold text-emerald-800">₹{paidInvoiced.toLocaleString('en-IN')}</span>
            </div>
            <div className="py-2 border-l border-[#D1CEBF]/40">
              <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold tracking-widest">Aura Block (Unpaid)</span>
              <span className="text-xl font-serif font-semibold text-amber-700">₹{pendingInvoiced.toLocaleString('en-IN')}</span>
            </div>
            <div className="py-2 border-l border-[#D1CEBF]/40">
              <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold tracking-widest">Planetary Deficit (Overdue)</span>
              <span className="text-xl font-serif font-semibold text-red-800 font-bold">₹{overdueInvoiced.toLocaleString('en-IN')}</span>
            </div>
            <div className="py-2 border-l border-[#D1CEBF]/40">
              <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold tracking-widest">Total Invoice Registry</span>
              <span className="text-xl font-serif font-semibold text-[#1A1A1A]">₹{totalInvoiced.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Table list of invoices */}
          <div className="bg-white border border-[#D1CEBF] rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead className="bg-[#FAF7F2]/80 border-b border-[#D1CEBF] text-[9.5px] font-mono text-[#A6A18F] uppercase tracking-widest">
                  <tr>
                    <th className="p-4 md:p-5 font-bold">SERIAL ID</th>
                    <th className="p-4 md:p-5 font-bold">PATRON VOYAGER</th>
                    <th className="p-4 md:p-5 font-bold">ASTRONOMICAL ALIGNMENT ITEM</th>
                    <th className="p-4 md:p-5 font-bold text-right">LEDGER CHARGE</th>
                    <th className="p-4 md:p-5 font-bold text-center">STATUS</th>
                    <th className="p-4 md:p-5 font-bold text-right">CERTIFICATE / PREVIEW</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {searchedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center font-mono text-xs text-[#857F75] uppercase tracking-wide">
                        No invoices logged matching filters or searches.
                      </td>
                    </tr>
                  ) : (
                    searchedInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#FAF7F2]/25 transition-colors">
                        <td className="p-4 md:p-5 font-mono text-[#A6A18F] font-bold">{inv.id}</td>
                        <td className="p-4 md:p-5 font-serif font-medium text-[#1A1A1A]">{inv.client}</td>
                        <td className="p-4 md:p-5 space-y-0.5">
                          <span className="block font-medium text-[#1A1A1A]">{inv.item}</span>
                          <span className="text-[10px] text-[#A6A18F] font-mono uppercase">{inv.alignment}</span>
                        </td>
                        <td className="p-4 md:p-5 text-right font-mono font-bold text-[#1A1A1A]">
                          ₹{inv.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 md:p-5 text-center">
                          <span className={`inline-block font-mono text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-md font-bold ${
                            inv.status === 'Paid' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-250/25' 
                              : inv.status === 'Sent' 
                              ? 'bg-blue-50 text-blue-800 border border-blue-200/25'
                              : inv.status === 'Overdue'
                              ? 'bg-red-50 text-red-800 border border-red-200/25 font-bold animate-pulse'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4 md:p-5 text-right">
                          <button
                            onClick={() => setSelectedInvoicePreview(inv)}
                            className="cursor-pointer bg-[#F8F6F1] hover:bg-[#E8E6E1]/50 border border-[#D1CEBF] text-[#1A1A1A] p-2 rounded-lg text-[10px] font-mono tracking-wider uppercase font-bold flex items-center justify-center gap-1.5 ml-auto transition-colors"
                          >
                            <ExternalLink className="h-3 w-3 text-[#A6A18F]" /> Render PDF Preview
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-PAGE: VENDOR MANAGEMENT MODULE */}
      {activeTab === 'vendors' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-64 max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-[#A6A18F]" />
              <input
                type="text"
                placeholder="Search mineral artisans or mines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-white border border-[#D1CEBF] rounded-xl py-2 px-3 text-xs outline-none focus:border-[#1A1A1A]"
              />
            </div>
            
            <button
              onClick={() => setShowAddVendorModal(true)}
              className="cursor-pointer w-full sm:w-auto bg-[#1A1A1A] hover:bg-[#322D2C] text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md border border-[#D1CEBF]/20 transition-transform active:scale-98"
            >
              <Plus className="h-4 w-4 text-[#A6A18F]" /> Onboard Sourcing Partner
            </button>
          </div>

          {/* Vendors Bento Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchedVendors.length === 0 ? (
              <div className="col-span-full bg-white border border-[#D1CEBF] p-12 text-center text-xs font-mono text-[#857F75] uppercase tracking-wider rounded-3xl">
                No onboarded artisans or miners found matching query context.
              </div>
            ) : (
              searchedVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white border border-[#D1CEBF] rounded-3xl p-6 space-y-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  {/* Title and Badge */}
                  <div className="flex items-start justify-between border-b border-[#FAF7F2] pb-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-[#A39E96] font-bold uppercase tracking-wider leading-none block">
                        {vendor.id} • {vendor.category}
                      </span>
                      <h4 className="font-serif text-lg font-light text-[#1A1A1A] tracking-normal leading-snug">
                        {vendor.name}
                      </h4>
                    </div>
                    <span className={`font-mono text-[9.5px] uppercase tracking-wide px-3 py-1 rounded-full font-bold ${
                      vendor.status === 'Approved' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-250/25' 
                        : 'bg-amber-50 text-amber-800 border border-amber-250/25'
                    }`}>
                      {vendor.status}
                    </span>
                  </div>

                  {/* Core Mineral detail parameters */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans text-[#1A1A1A]/70">
                    <div>
                      <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold leading-none mb-1">Representative</span>
                      <strong className="text-[#1A1A1A]">{vendor.contact}</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold leading-none mb-1 font-semibold">Origin Basin</span>
                      <strong className="text-[#1A1A1A]">{vendor.origin}</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold leading-none mb-1">Flagship Crystals Sourced</span>
                      <strong className="text-[#1A1A1A]">{vendor.leadGems}</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono text-[#A6A18F] uppercase font-bold leading-none mb-1">Attunement Standard Lead Time</span>
                      <strong className="text-[#1A1A1A]">{vendor.leadTime}</strong>
                    </div>
                  </div>

                  {/* Rating / Integrity Check and action links */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#FAF7F2] font-mono text-[10px]">
                    <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]">
                      <span className="text-[#A6A18F] font-semibold text-[10px]">PLANETARY SCORE:</span>
                      <div className="flex text-[#D4AF37]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-[13px] leading-none">
                            {i < vendor.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        addTerminalLogMessage(`Simulated supply chain audit of mineral reserves at: ${vendor.name}`);
                        alert(`✓ Integrity inspection report initiated for raw geode stores at ${vendor.name} (${vendor.origin}). All mineral lattices confirmed genuine A+ grade.`);
                      }}
                      className="cursor-pointer bg-[#F8F6F1] hover:bg-[#E8E6E1]/50 border border-[#D1CEBF] text-[#1A1A1A] text-[9.5px] px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold"
                    >
                      Audit Supply
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* SUB-PAGE: EXPENSES MANAGEMENT CORE MODULE */}
      {activeTab === 'expenses' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64 max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-[#A6A18F]" />
                <input
                  type="text"
                  placeholder="Filter expenses list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 bg-white border border-[#D1CEBF] rounded-xl py-2 px-3 text-xs outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="flex bg-[#FAF7F2] border border-[#D1CEBF] p-1 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider">
                {['All', 'Ritual Consecration', 'Packaging', 'Quality Inspection', 'Sourcing & Shipping'].map((state) => (
                  <button
                    key={state}
                    onClick={() => setExpenseFilter(state)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all ${
                      expenseFilter === state 
                        ? 'bg-white text-[#1A1A1A] shadow-sm' 
                        : 'text-[#857F75] hover:text-[#1A1A1A] hover:bg-[#E8E6E1]/30'
                    }`}
                  >
                    {state === 'All' ? 'All' : state.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="cursor-pointer w-full sm:w-auto bg-[#1A1A1A] hover:bg-[#322D2C] text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md border border-[#D1CEBF]/20 transition-transform active:scale-98"
            >
              <Plus className="h-4 w-4 text-[#A6A18F]" /> Log Attunement Costs
            </button>

          </div>

          {/* Double Grid of Expenses list + Graphical category breakdown chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Ledger listing table */}
            <div className="lg:col-span-8 bg-white border border-[#D1CEBF] rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead className="bg-[#FAF7F2]/80 border-b border-[#D1CEBF] text-[9.5px] font-mono text-[#A6A18F] uppercase tracking-widest">
                    <tr>
                      <th className="p-4 md:p-5 font-bold">SERIAL SERIAL ID</th>
                      <th className="p-4 md:p-5 font-bold">PURIFYING WORK DESCRIPTOR</th>
                      <th className="p-4 md:p-5 font-bold">CATEGORY CATEGORY</th>
                      <th className="p-4 md:p-5 font-bold text-right">COST (INR)</th>
                      <th className="p-4 md:p-5 font-bold text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF7F2]">
                    {searchedExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center font-mono text-xs text-[#857F75] uppercase tracking-wide">
                          No logged consecration charges found.
                        </td>
                      </tr>
                    ) : (
                      searchedExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-[#FAF7F2]/10 transition-all">
                          <td className="p-4 md:p-5 font-mono text-[#A6A18F] font-bold">{exp.id}</td>
                          <td className="p-4 md:p-5 space-y-0.5">
                            <span className="block font-medium text-[#1A1A1A]">{exp.title}</span>
                            <span className="text-[10px] text-[#857F75] font-light leading-snug">{exp.notes}</span>
                          </td>
                          <td className="p-4 md:p-5">
                            <span className="inline-block bg-[#FAF7F2] text-[#857F75] border border-[#D1CEBF]/45 font-mono text-[10px] tracking-wide px-2.5 py-0.5 rounded leading-normal">
                              {exp.category}
                            </span>
                          </td>
                          <td className="p-4 md:p-5 text-right font-mono font-bold text-[#1A1A1A]">
                            ₹{exp.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 md:p-5 text-center">
                            <button
                              onClick={async () => {
                                if (useFirestoreSource) {
                                  if (!googleUser) {
                                    alert("Please sign in with Google first to perform Firestore delete operations.");
                                    return;
                                  }
                                  try {
                                    await deleteDoc(doc(firestoreDb, 'expenses', exp.id))
                                      .catch(err => handleFirestoreError(err, OperationType.DELETE, `expenses/${exp.id}`));
                                    
                                    // Log to Firestore
                                    const logId = `log-${Date.now()}`;
                                    const logTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                    await setDoc(doc(firestoreDb, 'logs', logId), {
                                      id: logId,
                                      timestamp: logTimestamp,
                                      message: `Deleted operations expense record: ${exp.title} (₹${exp.amount}) via Firestore.`
                                    });

                                    await loadData();
                                  } catch (err) {
                                    console.error(err);
                                  }
                                  return;
                                }

                                const token = localStorage.getItem('signtific_admin_token');
                                try {
                                  const response = await fetch(`/api/expenses/${exp.id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  });
                                  if (response.ok) {
                                    await loadData();
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="cursor-pointer p-2 rounded-full text-[#857F75] hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete log permanently"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Graphical Category allocation representation */}
            <div className="lg:col-span-4 bg-white border border-[#D1CEBF] rounded-3xl p-6 space-y-6 shadow-sm self-start">
              <div className="border-b border-[#FAF7F2] pb-4">
                <span className="text-[8px] font-mono tracking-[0.25em] text-[#A6A18F] uppercase font-bold block">Integrity checks stats</span>
                <h3 className="font-serif text-base text-[#1A1A1A]">Operational Allocations</h3>
              </div>

              {/* Graphical progress list showing Category percentage of expense */}
              <div className="space-y-4">
                {Object.entries(categoryExpenseTotals).map(([cat, amount]) => {
                  const percentage = totalOpex > 0 ? Math.round(((amount as number) / totalOpex) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-[#1A1A1A] font-medium uppercase font-sans tracking-wide leading-none">{cat}</span>
                        <span className="text-[#A6A18F] font-bold">{percentage}%</span>
                      </div>
                      
                      {/* Bar indicator line */}
                      <div className="h-2 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#D1CEBF]/10">
                        <div 
                          className="h-full bg-[#1A1A1A] rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="block text-[10px] text-[#A6A18F] font-mono text-left">
                        ₹{(amount as number).toLocaleString('en-IN')} logged in aggregate
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#FAF7F2]/60 bg-[#FAF7F2]/25 p-4 rounded-xl border border-dashed border-[#D1CEBF]/50 text-center space-y-1">
                <span className="block text-[8px] font-mono text-[#A6A18F] uppercase tracking-widest font-bold">Operating Budget lock</span>
                <p className="text-[10px] text-[#1A1A1A]/75 leading-relaxed font-sans font-light">
                  Aura purity investments are fully programmed within monthly profit constraints, ensuring robust high-fashion manufacturing success.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUB-PAGE: TASK MANAGEMENT KANBAN SPRINT MODULE */}
      {activeTab === 'tasks' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header details */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-1">
              <h3 className="font-serif text-lg text-[#1A1A1A]">Attunement & Solder Sprint Board</h3>
              <p className="text-xs text-[#857F75] font-light">
                Transition pure mineral stones through their required chronological purification stages to lock high manifestation frequencies.
              </p>
            </div>

            <button
              onClick={() => setShowAddTaskModal(true)}
              className="cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md border border-[#D1CEBF]/20 transition-transform active:scale-98"
            >
              <Plus className="h-4 w-4 text-[#A6A18F]" /> Allocate Purification Task
            </button>
          </div>

          {/* Kanban Lanes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Lane Generator helper */}
            {(['Backlog', 'Water Cleanse', 'Moon Bath Bathing', 'Sealed / Composed'] as const).map((stage) => {
              const stageTasks = tasks.filter(t => t.status === stage);
              return (
                <div key={stage} className="bg-[#FAF7F2]/50 border border-[#D1CEBF] rounded-3xl p-4 flex flex-col min-h-[420px] max-h-[550px] overflow-hidden">
                  
                  {/* Lane Title */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#D1CEBF]/40 mb-4 px-1 shrink-0">
                    <span className="font-serif text-sm text-[#1A1A1A] font-semibold flex items-center gap-2">
                      {stage === 'Backlog' && <Clock className="h-4 w-4 text-[#A6A18F]" />}
                      {stage === 'Water Cleanse' && <Award className="h-4 w-4 text-blue-500" />}
                      {stage === 'Moon Bath Bathing' && <Compass className="h-4 w-4 text-purple-600" />}
                      {stage === 'Sealed / Composed' && <CheckCircle2 className="h-4 w-4 text-emerald-800" />}
                      {stage}
                    </span>
                    <span className="font-mono text-[10px] text-white bg-[#1A1A1A] px-2.5 py-0.5 rounded-full font-bold">
                      {stageTasks.length}
                    </span>
                  </div>

                  {/* Lane Cards listing */}
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-none pb-2">
                    {stageTasks.length === 0 ? (
                      <div className="h-full border-2 border-dashed border-[#D1CEBF]/30 rounded-xl flex items-center justify-center p-6 text-center text-[10px] font-mono text-[#857F75] uppercase tracking-wide">
                        Empty Stage
                      </div>
                    ) : (
                      stageTasks.map((task) => (
                        <div key={task.id} className="bg-white border border-[#D1CEBF] rounded-2xl p-4 space-y-4 shadow-xs hover:shadow-md transition-shadow select-text">
                          
                          {/* Task identifier */}
                          <div className="flex items-start justify-between">
                            <span className="font-mono text-[9px] text-[#A6A18F] font-bold">{task.id}</span>
                            <span className={`font-mono text-[8.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded leading-none ${
                              task.priority === 'High' 
                                ? 'bg-red-50 text-red-800 border border-red-200/25' 
                                : task.priority === 'Medium' 
                                ? 'bg-amber-50 text-amber-800 border border-amber-200/25'
                                : 'bg-green-50 text-emerald-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>

                          {/* Task subject */}
                          <h4 className="font-serif text-xs font-semibold leading-normal text-[#1A1A1A] hover:text-[#A6A18F] transition-colors">
                            {task.title}
                          </h4>

                          {/* Operational assignee details */}
                          <div className="flex items-end justify-between pt-3 border-t border-[#FAF7F2] text-[10px] font-mono text-[#857F75]">
                            <div className="space-y-0.5">
                              <span className="block text-[8px] font-mono uppercase text-[#A39E96]">Assignee</span>
                              <strong className="text-[#1A1A1A] text-[9.5px]">{task.assignee}</strong>
                            </div>
                            <span className="text-[8px] tracking-wide text-amber-900 bg-amber-50 px-1 py-0.5 rounded leading-none">
                              {task.daysLeft}d left
                            </span>
                          </div>

                          {/* Action Advance Buttons */}
                          <div className="flex items-center justify-between pt-1 font-mono text-[9px]">
                            {stage !== 'Backlog' ? (
                              <button
                                onClick={() => moveTask(task.id, 'backward')}
                                className="cursor-pointer text-[#857F75] hover:text-[#1A1A1A] p-1 flex items-center gap-0.5"
                                title="Demote to prior phase"
                              >
                                ← Back
                              </button>
                            ) : <div />}
                            {stage !== 'Sealed / Composed' ? (
                              <button
                                onClick={() => moveTask(task.id, 'forward')}
                                className="cursor-pointer text-emerald-800 hover:text-emerald-999 font-bold p-1 flex items-center gap-0.5 bg-emerald-50 px-2 rounded-md hover:bg-emerald-100 transition-colors"
                                title="Advance Attunement stage"
                              >
                                Process →
                              </button>
                            ) : (
                              <div className="text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                                ✓ Certified
                              </div>
                            )}
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              );
            })}
            
          </div>

        </div>
      )}

      {activeTab === 'gmail' && (
        <div className="space-y-8 animate-fadeIn font-sans">
          
          {/* Header & Status Indicator */}
          <div className="bg-[#FAF7F2] border border-[#D1CEBF] p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 bg-[#1A1A1A] text-amber-200 font-mono text-[9px] uppercase tracking-widest rounded-md font-bold flex items-center gap-1.5 shadow-xs">
                  <Send className="h-3 w-3 text-[#D4AF37]" /> GMAIL COMMUNICATIONS GATEWAY
                </span>
                {googleUser ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-mono font-bold tracking-tight uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>ON AIR</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono font-bold tracking-tight uppercase bg-zinc-100 border border-dashed border-zinc-300 px-2.5 py-0.5 rounded-full">
                    <span>LOCKED</span>
                  </div>
                )}
              </div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A]">
                Chamber of <span className="font-semibold text-[#A6A18F]">Electronic Correspondence</span>
              </h2>
              <p className="text-xs text-[#1A1A1A]/60 max-w-2xl leading-relaxed font-light">
                Secure electronic dispatch wing for Aura & Stone operations. Draft sacred crystal blessing messages, order dispatches, or attested ledger invoices directly to your global clientele using real Google credentials securely.
              </p>
            </div>

            {googleUser && (
              <div className="flex items-center gap-3 bg-white border border-[#D1CEBF] p-3 rounded-2xl shadow-xs self-start md:self-center">
                {googleUser.photoURL ? (
                  <img src={googleUser.photoURL} alt="User Avatar" className="h-9 w-9 rounded-full border border-[#D1CEBF]" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-serif text-sm">
                    {googleUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-[11px] font-mono font-bold text-[#1A1A1A] max-w-[150px] truncate leading-tight">{googleUser.displayName || 'Authorized operator'}</p>
                  <p className="text-[9px] font-mono text-[#857F75] truncate max-w-[150px] leading-tight">{googleUser.email}</p>
                </div>
                <button
                  onClick={async () => {
                    await firebaseLogout();
                    setGoogleUser(null);
                    setGoogleToken(null);
                  }}
                  className="cursor-pointer p-1.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                  title="Disconnect account"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {!googleUser ? (
            <div className="bg-white border border-[#D1CEBF] p-12 rounded-3xl text-center space-y-6 max-w-2xl mx-auto shadow-sm">
              <div className="mx-auto h-16 w-16 bg-[#FAF7F2] border border-[#D1CEBF]/45 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                <Send className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-light text-[#1A1A1A] tracking-wide">
                  Initiate Secure Google Handshake
                </h3>
                <p className="text-xs text-[#857F75] max-w-md mx-auto leading-relaxed">
                  To comply with architectural security rules, accessing Gmail requires active cryptographic token grants via Google OAuth. Handshakes persist tokens safely in-memory only.
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await googleSignIn();
                  } catch (e) {
                    alert("Handshake denied: Google account workspace session refused.");
                  }
                }}
                className="cursor-pointer bg-[#1A1A1A] hover:bg-black text-white px-8 py-4 rounded-2xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md inline-flex items-center gap-3"
              >
                <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.543 0 2.95.549 4.053 1.458l3.142-3.14C18.91 1.776 15.783 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.262 0 11.36-4.99 11.36-11.24 0-.7-.075-1.378-.195-2.015H12.24z" />
                </svg>
                <span>Authorize & Unlock Chamber</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Dynamic Electronic Mail Composer Card */}
              <div className="lg:col-span-7 bg-white border border-[#D1CEBF] p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
                <div className="border-b border-[#FAF7F2] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.25em] text-[#A6A18F] uppercase font-bold block">Composer Client</span>
                    <h3 className="font-serif text-lg text-[#1A1A1A]">Attuned Correspondence Draft</h3>
                  </div>

                  {/* Preset template Quickloader dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#857F75] font-bold uppercase tracking-wider">Template:</span>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => loadPresetTemplate(e.target.value)}
                      className="bg-[#FAF7F2] text-[#1A1A1A] border border-[#D1CEBF] rounded-xl px-2.5 py-1 text-xs font-mono font-bold focus:outline-hidden cursor-pointer"
                    >
                      <option value="blessing">Crystal Blessing</option>
                      <option value="shipping">Vedic Dispatch</option>
                      <option value="ledger">Ledger Attestation</option>
                    </select>
                  </div>
                </div>

                <form onSubmit={sendGmailEmail} className="space-y-4">
                  {mailStatus && (
                    <div className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 ${
                      mailStatus === 'success' 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      {mailStatus === 'success' ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>MIME message successfully dispatched via official Gmail API standard.</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                          <span>Dispatch Failed: {mailStatus}</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#1A1A1A] uppercase tracking-wider font-bold">Recipient Mailbox address</label>
                    <input
                      type="email"
                      value={mailRecipient}
                      onChange={(e) => setMailRecipient(e.target.value)}
                      placeholder="e.g. client@prosperity.com"
                      className="w-full bg-[#FAF7F2] border border-[#D1CEBF] rounded-2xl px-4 py-3 text-xs font-mono text-[#1A1A1A] focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#1A1A1A] uppercase tracking-wider font-bold">Electronic Subject Header</label>
                    <input
                      type="text"
                      value={mailSubject}
                      onChange={(e) => setMailSubject(e.target.value)}
                      placeholder="Subject of Vedic Notice"
                      className="w-full bg-[#FAF7F2] border border-[#D1CEBF] rounded-2xl px-4 py-3 text-xs font-sans text-[#1A1A1A] focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#1A1A1A] uppercase tracking-wider font-bold">MIME Message Body Content</label>
                    <textarea
                      rows={8}
                      value={mailBody}
                      onChange={(e) => setMailBody(e.target.value)}
                      placeholder="Compose your spiritual cosmic letter details here gracefully..."
                      className="w-full bg-[#FAF7F2] border border-[#D1CEBF] rounded-2xl p-4 text-xs font-sans text-[#1A1A1A] focus:outline-hidden leading-relaxed"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isMailSending}
                    className="cursor-pointer w-full bg-[#1A1A1A] hover:bg-black disabled:bg-zinc-300 text-white py-3.5 px-4 rounded-2xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isMailSending ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-[#D4AF37]" />
                        <span>DISPATCHING VIA GMAIL CLOUD...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-[#D4AF37]" />
                        <span>COMPILE & DISPATCH MESSAGE</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Sent correspondence ledger audit rail */}
              <div className="lg:col-span-5 bg-white border border-[#D1CEBF] p-6 rounded-3xl shadow-xs space-y-6 self-start">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#A6A18F] uppercase font-bold block">Transmission History</span>
                  <h3 className="font-serif text-lg text-[#1A1A1A]">Sent Correspondences</h3>
                </div>

                <div className="divide-y divide-[#FAF7F2] max-h-[420px] overflow-y-auto pr-1">
                  {mailHistory.length === 0 ? (
                    <div className="text-center py-12 text-xs font-mono text-[#857F75]">
                      No digital correspondence sent during this operational session.
                    </div>
                  ) : (
                    mailHistory.map((item, idx) => (
                      <div key={idx} className="py-4 space-y-2 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5">
                            <span className="text-xs font-sans font-medium text-[#1A1A1A]">{item.clientName}</span>
                            <span className="block text-[10px] font-mono text-[#857F75]">{item.email}</span>
                          </div>
                          <span className="text-[9.5px] font-mono text-[#A6A18F] bg-[#FAF7F2] border border-[#D1CEBF]/45 px-2 py-0.5 rounded leading-none whitespace-nowrap">
                            {item.dateStr}
                          </span>
                        </div>
                        <p className="text-[11px] font-sans text-[#1A1A1A]/70 line-clamp-1 italic font-light">
                          "{item.subject}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          <CodebaseRatingDashboard />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: PRODUCTS CATALOG MANAGER */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn font-sans select-text pb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D1CEBF]/50 pb-5">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">
                COMMERCE GRID INVENTORY
              </span>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A]">
                Crystalline Jewelry Catalog
              </h2>
            </div>
            
            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProductForm({
                  id: `prod-${Date.now()}`,
                  name: '',
                  originalPrice: 1999,
                  salePrice: 1499,
                  rating: 5,
                  reviewsCount: 1,
                  description: '',
                  shortDescription: '',
                  benefits: '',
                  crystalsUsed: '',
                  imageUrl: '',
                  videoUrl: '',
                  category: 'bracelet',
                  stockStatus: 'in-stock',
                  isBestSeller: false,
                  zodiacConnection: '',
                  specifications: {
                    beadSize: '8mm Grade A Spheres',
                    beadCount: 24,
                    threadMaterial: 'Vedic Elastic Chord',
                    origin: 'Finely Sourced',
                    chargeTime: '3 Nights'
                  }
                });
                setIsAddingProduct(true);
              }}
              className="cursor-pointer bg-[#1A1A1A] hover:bg-[#332F2B] text-white text-xs font-mono font-bold uppercase tracking-widest px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-md leading-none"
            >
              <Plus className="h-4 w-4 text-[#D4AF37]" />
              <span>Publish New Curation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ACTIVE PRODUCTS MASTER LIST */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF7F2] border border-[#D1CEBF] p-4 rounded-2xl shadow-3xs space-y-3">
                <span className="text-[9px] font-mono text-[#857F75] font-bold uppercase block tracking-wider">
                  Live Showroom Index ({productsList.length})
                </span>
                
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {productsList.map((prod) => (
                    <div
                      key={prod.id}
                      className={`p-3 rounded-xl border transition-all ${
                        (editingProduct?.id === prod.id)
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-md'
                          : 'bg-white hover:bg-[#FAF7F2] border-[#E8E6E1]'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={prod.imageUrl || `${import.meta.env.BASE_URL}src/assets/images/signtific_hero_banner_1779793774735.png`}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-lg object-cover shrink-0 border border-[#FAF7F2]"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1.5">
                            <strong className="text-xs font-serif font-semibold block truncate leading-tight">
                              {prod.name}
                            </strong>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full uppercase bg-[#C5A880]/15 text-[#C5A880] shrink-0 font-bold">
                              {prod.category}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 font-mono text-[10px]">
                            <span className={(editingProduct?.id === prod.id) ? 'text-gray-300' : 'text-[#857F75]'}>
                              Sale: <span className="font-bold text-[#D4AF37]">₹{prod.salePrice}</span>
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className={(editingProduct?.id === prod.id) ? 'text-gray-400' : 'text-gray-500'}>
                              Stock: <span className="font-bold underline uppercase">{prod.stockStatus}</span>
                            </span>
                          </div>
                          
                          {/* Quick video badge indicator */}
                          {prod.videoUrl && (
                            <span className="inline-flex items-center gap-1 text-[8.5px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                              <Compass className="h-2.5 w-2.5 spinSlow text-emerald-600" />
                              <span>Dynamic Video Active</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-3.5 pt-2 border-t border-dashed border-gray-200/40">
                        <button
                          onClick={() => {
                            setIsAddingProduct(false);
                            setEditingProduct(prod);
                            setNewProductForm({
                              ...prod,
                              benefits: Array.isArray(prod.benefits) ? prod.benefits.join('\n') : prod.benefits || '',
                              crystalsUsed: Array.isArray(prod.crystalsUsed) ? prod.crystalsUsed.join(', ') : prod.crystalsUsed || '',
                              zodiacConnection: Array.isArray(prod.zodiacConnection) ? prod.zodiacConnection.join(', ') : prod.zodiacConnection || '',
                              specifications: prod.specifications || {
                                beadSize: '8mm Grade A Spheres',
                                beadCount: 24,
                                threadMaterial: 'Vedic Elastic Chord',
                                origin: 'Finely Sourced',
                                chargeTime: '3 Nights'
                              }
                            });
                          }}
                          className={`cursor-pointer text-[9px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                            (editingProduct?.id === prod.id)
                              ? 'bg-white hover:bg-gray-100 text-[#1A1A1A] border-white'
                              : 'bg-white hover:bg-gray-55 text-[#1A1A1A] border-[#D1CEBF]'
                          }`}
                        >
                          Configure Item Details
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="cursor-pointer text-[9px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 flex items-center gap-1"
                          title="Erase publication record permanently"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          <span>Erase</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE FORM CONTAINER */}
            <div className="lg:col-span-7">
              {isAddingProduct || editingProduct ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProduct(newProductForm);
                  }}
                  className="bg-white border-2 border-[#D1CEBF] p-6 rounded-3xl shadow-md space-y-6"
                >
                  <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                    <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
                      {isAddingProduct ? 'Publish Fresh Creation' : `Modify "${editingProduct?.name}"`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="cursor-pointer text-xs font-mono font-bold uppercase text-[#857F75] hover:text-[#1A1A1A] tracking-wider"
                    >
                      Dismiss Editing
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Dynamic Product Name *</label>
                      <input
                        type="text"
                        required
                        value={newProductForm.name}
                        onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                        placeholder="e.g. The Mercury Abundance Talisman"
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Catalog SKU Code Id *</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingProduct}
                        value={newProductForm.id}
                        onChange={(e) => setNewProductForm({ ...newProductForm, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                        placeholder="e.g. mercury-abundance-talisman"
                        className="w-full bg-[#FAF7F2]/50 disabled:opacity-75 border border-[#D1CEBF] p-2.5 rounded-xl font-medium font-mono outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Sale Price (INR ₹) *</label>
                      <input
                        type="number"
                        required
                        value={newProductForm.salePrice}
                        onChange={(e) => setNewProductForm({ ...newProductForm, salePrice: Number(e.target.value) })}
                        placeholder="e.g. 1499"
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Original Listed Price (INR ₹) *</label>
                      <input
                        type="number"
                        required
                        value={newProductForm.originalPrice}
                        onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: Number(e.target.value) })}
                        placeholder="e.g. 1999"
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Showroom Category *</label>
                      <select
                        value={newProductForm.category}
                        onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium font-mono outline-none focus:border-black"
                      >
                        <option value="bracelet">Planetary Bracelet</option>
                        <option value="ring">Aura Guard Ring</option>
                        <option value="combo">Astrological Combo Set</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Stock Inventory Status *</label>
                      <select
                        value={newProductForm.stockStatus}
                        onChange={(e) => setNewProductForm({ ...newProductForm, stockStatus: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none"
                      >
                        <option value="in-stock">IN STOCK (AVAILABLE ON CHECKOUT)</option>
                        <option value="out-of-stock">OUT OF STOCK (DISABLED PREVIEW)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Hot Bestseller Promotion *</label>
                      <select
                        value={newProductForm.isBestSeller ? 'true' : 'false'}
                        onChange={(e) => setNewProductForm({ ...newProductForm, isBestSeller: e.target.value === 'true' })}
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none font-mono"
                      >
                        <option value="false">Standard Catalog Item</option>
                        <option value="true">Bestseller Showcase (Renders on Home main page!)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 font-sans text-xs">
                    <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Short Promo Copy (Appears in previews)</label>
                    <input
                      type="text"
                      value={newProductForm.shortDescription || ''}
                      onChange={(e) => setNewProductForm({ ...newProductForm, shortDescription: e.target.value })}
                      placeholder="e.g. The absolute shield against career boundaries."
                      className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1 font-sans text-xs">
                    <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Full Geological & Metaphysical Narrative Details *</label>
                    <textarea
                      required
                      rows={3}
                      value={newProductForm.description}
                      onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                      placeholder="Narrate the exact planet frequency tuning, laboratory validations, or spiritual purpose of this design..."
                      className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Showroom Showcase Image URL *</label>
                      <input
                        type="text"
                        required
                        value={newProductForm.imageUrl}
                        onChange={(e) => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                        placeholder="URL path to high resolution product JPEG/PNG"
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Showcase Video Embedded Link (YouTube or CDN)</label>
                      <input
                        type="text"
                        value={newProductForm.videoUrl || ''}
                        onChange={(e) => setNewProductForm({ ...newProductForm, videoUrl: e.target.value })}
                        placeholder="e.g., https://www.youtube.com/embed/..."
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Planetary Mineral Elements</label>
                      <input
                        type="text"
                        value={newProductForm.crystalsUsed ? (Array.isArray(newProductForm.crystalsUsed) ? newProductForm.crystalsUsed.join(', ') : newProductForm.crystalsUsed) : ''}
                        onChange={(e) => setNewProductForm({ ...newProductForm, crystalsUsed: e.target.value })}
                        placeholder="Comma separated: Citrine, Pyrite"
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Compatible Zodiac Signs</label>
                      <input
                        type="text"
                        value={newProductForm.zodiacConnection ? (Array.isArray(newProductForm.zodiacConnection) ? newProductForm.zodiacConnection.join(', ') : newProductForm.zodiacConnection) : ''}
                        onChange={(e) => setNewProductForm({ ...newProductForm, zodiacConnection: e.target.value })}
                        placeholder="Comma separated: Aries, Leo"
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">Custom Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={newProductForm.rating}
                        onChange={(e) => setNewProductForm({ ...newProductForm, rating: Number(e.target.value) })}
                        placeholder="5"
                        className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-mono outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] border border-[#D1CEBF] p-4 rounded-2xl text-xs space-y-3 font-sans">
                    <strong className="block text-[10px] font-mono text-[#857F75] uppercase tracking-wider font-bold">
                      Vedic Consecration & Dimensional Blueprint Specifications
                    </strong>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] text-[#857F75] uppercase font-bold mb-0.5">Physical Bead Diameter</label>
                        <input
                          type="text"
                          value={newProductForm.specifications?.beadSize || ''}
                          onChange={(e) => setNewProductForm({
                            ...newProductForm,
                            specifications: { ...(newProductForm.specifications || {}), beadSize: e.target.value }
                          })}
                          className="w-full bg-white border border-[#D1CEBF] p-1.5 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-[#857F75] uppercase font-bold mb-0.5">Physical Strand Count</label>
                        <input
                          type="number"
                          value={newProductForm.specifications?.beadCount || 24}
                          onChange={(e) => setNewProductForm({
                            ...newProductForm,
                            specifications: { ...(newProductForm.specifications || {}), beadCount: Number(e.target.value) }
                          })}
                          className="w-full bg-white border border-[#D1CEBF] p-1.5 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-[#857F75] uppercase font-bold mb-0.5">Aura Bathing Duration</label>
                        <input
                          type="text"
                          value={newProductForm.specifications?.chargeTime || ''}
                          onChange={(e) => setNewProductForm({
                            ...newProductForm,
                            specifications: { ...(newProductForm.specifications || {}), chargeTime: e.target.value }
                          })}
                          className="w-full bg-white border border-[#D1CEBF] p-1.5 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Benefits textfield - one benefit per line */}
                  <div className="space-y-1 font-sans text-xs">
                    <label className="block text-[#857F75] font-mono text-[10px] uppercase font-bold">
                      Planetary Blessings & Benefits (One line per statement list)
                    </label>
                    <textarea
                      rows={3}
                      value={newProductForm.benefits}
                      onChange={(e) => setNewProductForm({ ...newProductForm, benefits: e.target.value })}
                      placeholder="Allows unshakeable financial focus&#10;Repels negative nazar in the workspace&#10;Keeps the solar plexus chakra aligned"
                      className="w-full bg-[#FAF7F2] border border-[#D1CEBF] p-2.5 rounded-xl font-medium outline-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer w-full bg-[#1A1A1A] hover:bg-[#332F2B] active:scale-98 text-white font-mono text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-all shadow-md mt-4"
                  >
                    🚀 Save Curation & Push Live (Triggers Auto-Rollback Checkpoint)
                  </button>
                </form>
              ) : (
                <div className="bg-[#FAF7F2] border-2 border-dashed border-[#D1CEBF] rounded-3xl p-12 text-center select-none space-y-4">
                  <div className="h-14 w-14 rounded-full bg-[#C5A880]/10 flex items-center justify-center mx-auto">
                    <Box className="h-6 w-6 text-[#C5A880]" />
                  </div>
                  <h3 className="font-serif text-lg font-light text-[#1A1A1A]">No Creative Item Selected</h3>
                  <p className="text-xs text-[#857F75] max-w-sm mx-auto leading-relaxed">
                    Select a curated bracelet or aura shield ring from the live showroom index on the left to edit, or click the <strong>"Publish New Curation"</strong> button above to create a custom product from laboratory minerals!
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: WEBSITE BUILDER COPYWRITER & CHECKPOINT ROLLBACKS */}
      {/* ======================================================== */}
      {activeTab === 'site' && (
        <div className="space-y-6 animate-fadeIn font-sans select-text pb-20">
          <div className="flex justify-between items-center border-b border-[#D1CEBF]/50 pb-5">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">
                WEBSITE LAYOUT CUSTOMIZER & VERSIONING
              </span>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A]">
                Vedic Live Copywriter Portal
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: SQUARESPACE-STYLE SECTION EDITOR */}
            <div className="lg:col-span-7 bg-white border-2 border-[#D1CEBF] p-6 sm:p-8 rounded-3xl shadow-md">
              <div className="flex items-center gap-1.5 pb-4 border-b border-gray-100 mb-6">
                <Sparkles className="h-5 w-5 text-emerald-600 fill-current text-emerald-600" />
                <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
                  Section Blocks Editor
                </h3>
              </div>

              <form onSubmit={handleUpdateWebsite} className="space-y-6 text-xs text-sans">
                
                {/* BRAND REBRAND SECTION */}
                <div className="p-4 bg-[#FAF7F2] border border-[#D1CEBF] rounded-2xl space-y-4">
                  <span className="text-[9px] font-mono text-[#C5A880] font-bold uppercase block tracking-wider">
                    Block 1: Global Identity & Title Tags
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Core Brand Name *</label>
                      <input
                        type="text"
                        required
                        value={siteForm?.brandName || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, brandName: e.target.value })}
                        placeholder="e.g. Aura & Stone"
                        className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg font-bold"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Global Tagline / Subtitle *</label>
                      <input
                        type="text"
                        required
                        value={siteForm?.brandSubtitle || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, brandSubtitle: e.target.value })}
                        placeholder="e.g. Crystalline Astrology"
                        className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* CINEMATIC HERO BLOCK */}
                <div className="p-4 bg-[#FAF7F2] border border-[#D1CEBF] rounded-2xl space-y-4">
                  <span className="text-[9px] font-mono text-[#C5A880] font-bold uppercase block tracking-wider">
                    Block 2: Luxury Video / Cinematic Hero Copy
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Hero Headline Prefix *</label>
                      <input
                        type="text"
                        required
                        value={siteForm?.heroHeadline || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, heroHeadline: e.target.value })}
                        placeholder="e.g. The Indian"
                        className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Hero Highlight Accent Words *</label>
                      <input
                        type="text"
                        required
                        value={siteForm?.heroHighlight || ''}
                        onChange={(e) => setSiteForm({ ...siteForm, heroHighlight: e.target.value })}
                        placeholder="e.g. Science of Signs"
                        className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg font-bold text-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Hero Core Descriptive Paragraph *</label>
                    <textarea
                      required
                      rows={3}
                      value={siteForm?.heroParagraph || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, heroParagraph: e.target.value })}
                      placeholder="Hero copy explaining Vedic minerals formulas..."
                      className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Backdrop Mobile Hero Banner URL *</label>
                    <input
                      type="text"
                      required
                      value={siteForm?.bannerImage || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, bannerImage: e.target.value })}
                      placeholder="URL path to hero banner image"
                      className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg"
                    />
                  </div>
                </div>

                {/* ESSENTIAL QUOTE */}
                <div className="p-4 bg-[#FAF7F2] border border-[#D1CEBF] rounded-2xl space-y-4">
                  <span className="text-[9px] font-mono text-[#C5A880] font-bold uppercase block tracking-wider">
                    Block 3: Cosmic Founders Quote Block
                  </span>
                  
                  <div className="space-y-1">
                    <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Autographed Quote Text *</label>
                    <textarea
                      required
                      rows={3}
                      value={siteForm?.founderQuote || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, founderQuote: e.target.value })}
                      placeholder="Narrate authentic corporate struggle, ancestral wisdom..."
                      className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg font-serif italic"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Author Attribution Subtitle *</label>
                    <input
                      type="text"
                      required
                      value={siteForm?.founderQuoteSubtitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, founderQuoteSubtitle: e.target.value })}
                      placeholder="e.g. Co-Founder & Chief Vedic Architect, Aura & Stone"
                      className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg"
                    />
                  </div>
                </div>

                {/* VEDIC SCEPTRED STORY */}
                <div className="p-4 bg-[#FAF7F2] border border-[#D1CEBF] rounded-2xl space-y-4">
                  <span className="text-[9px] font-mono text-[#C5A880] font-bold uppercase block tracking-wider">
                    Block 4: Historical Heritage Story Panel (About Page)
                  </span>
                  
                  <div className="space-y-1">
                    <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Heritage Editorial Headline *</label>
                    <input
                      type="text"
                      required
                      value={siteForm?.historyHeadline || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, historyHeadline: e.target.value })}
                      placeholder="e.g., Ancient Sceptred Science Met Minimalist Form"
                      className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Story Paragraph 1 (Himalayan Descent Sourcing) *</label>
                    <textarea
                      required
                      rows={3}
                      value={siteForm?.historyParagraph1 || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, historyParagraph1: e.target.value })}
                      placeholder="Decribe initial laboratory startup in Kashmir..."
                      className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[#857F75] font-mono text-[9px] uppercase font-bold">Story Paragraph 2 (Chemical geological metrics) *</label>
                    <textarea
                      required
                      rows={3}
                      value={siteForm?.historyParagraph2 || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, historyParagraph2: e.target.value })}
                      placeholder="Explain deep laboratory matrix testing..."
                      className="w-full bg-white border border-[#D1CEBF] p-2 rounded-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full bg-[#1A1A1A] hover:bg-[#332F2B] text-white py-4 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                  <span>Push Customization Live & Generate Backup Checkpoint</span>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: RECOVERY VALLT (TIMELINE OF ROLLBACK CHECKS) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FAF7F2] border-2 border-[#D1CEBF] p-5 sm:p-6 rounded-3xl shadow-sm space-y-4 text-xs">
                
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#D1CEBF]/40">
                  <div className="p-1.5 rounded-lg bg-[#C5A880]/15 text-[#C5A880]">
                    <Clock className="h-5 w-5 shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#1A1A1A]">Historical Sync Records</h3>
                    <p className="text-[10px] text-[#857F75]">Planetary Rollback Vault</p>
                  </div>
                </div>

                <p className="text-xs text-[#857F75] leading-relaxed">
                  Aura & Stone records up to <strong>25 operational backups</strong>. If some layout modifications fail to satisfy your design eyes, or catalog records are mistakenly corrupted, you can revert the entire website to an earlier state instantly.
                </p>

                <button
                  onClick={handleCreateManualCheckpoint}
                  className="cursor-pointer w-full bg-white hover:bg-gray-50 text-[#1A1A1A] font-mono font-bold uppercase tracking-widest py-3 px-4 rounded-xl border border-[#D1CEBF] text-center transition-all flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Plus className="h-4 w-4 text-[#C5A880]" />
                  <span>Capture Manual Checkpoint</span>
                </button>

                <div className="space-y-3.5 mt-4 pt-4 border-t border-dashed border-[#D1CEBF]/50">
                  <span className="text-[9px] font-mono font-bold text-[#857F75] uppercase block tracking-wider">
                    Rolling Backup Timeline (Max 25 states)
                  </span>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {checkpointsList.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-xl border border-[#E8E6E1]/60 text-[#857F75] italic text-[11px]">
                        No checkpoint records captured. Save changes to trigger automatic backup arrays.
                      </div>
                    ) : (
                      checkpointsList.map((chk) => {
                        const localTime = new Date(chk.timestamp).toLocaleString();
                        return (
                          <div
                            key={chk.id}
                            className="p-3 bg-white rounded-xl border border-[#E8E6E1] space-y-2 shadow-4xs hover:shadow-3xs transition-all text-[11px]"
                          >
                            <div className="flex justify-between items-start gap-1.5">
                              <span className="font-sans font-bold leading-tight block text-[#1A1A1A]">
                                {chk.title}
                              </span>
                              <span className="text-[8.5px] font-mono bg-[#E3EFE0] text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded font-bold shrink-0 uppercase">
                                Secure
                              </span>
                            </div>

                            <div className="text-[9.5px] font-mono text-[#857F75] space-y-0.5">
                              <div>Time: <span className="text-gray-900 font-medium">{localTime}</span></div>
                              <div>ID: <span className="font-sans text-[9px] tracking-tight">{chk.id}</span></div>
                              <div>Author: <span className="text-gray-900 font-bold">{chk.user}</span></div>
                            </div>

                            <button
                              onClick={() => handleRollback(chk.id, chk.title)}
                              className="cursor-pointer w-full bg-gray-55 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#D1CEBF] font-mono text-[9px] font-bold uppercase py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 mt-1"
                              title="Overwrite entire showroom index and copy tags with this backup batch"
                            >
                              <RefreshCw className="h-3.5 w-3.5 spinHover text-[#C5A880]" />
                              <span>Rollback Website to this State</span>
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}


      {/* ACTIVE SCREEN OVERLAYS / INTERACTIVE SLIDE-OUT MODALS */}

      {/* PDF HIGH RESOLUTION COMMERCIAL INVOICE INBOUND PREVIEW DIALOG */}
      <AnimatePresence>
        {selectedInvoicePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoicePreview(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* High-fidelity invoice sheet */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white text-[#1A1A1A] border-4 border-double border-[#D1CEBF] rounded-3xl p-6 sm:p-10 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto select-text font-serif space-y-6"
            >
              {/* Close Overlay btn */}
              <button
                onClick={() => setSelectedInvoicePreview(null)}
                className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-[#FAF7F2] text-[#857F75] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5 font-bold" />
              </button>

              {/* Document Banner */}
              <div className="text-center space-y-1.5 border-b border-[#D1CEBF]/40 pb-6">
                <span className="font-serif text-xl font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">
                  SIGNTIFIC INDIA LTD
                </span>
                <p className="text-[10px] font-mono tracking-widest text-[#A6A18F] uppercase leading-none font-bold">
                  HIMALAYAN PLANETARY ALIGNMENT LABORATORY CODEX INVOICE
                </p>
                <p className="text-[8px] font-mono text-[#857F75] uppercase pb-1 leading-none">
                  ISO 9001:2015 MINERAL METADATA INTEGRITY CALIBRATION CERTIFICATE
                </p>
              </div>

              {/* Commercial Invoice details */}
              <div className="font-mono text-[10.5px] grid grid-cols-2 gap-4 pb-4 border-b border-[#FAF7F2] text-[#1A1A1A]/75">
                <div>
                  <span className="block text-[8px] text-[#A6A18F] uppercase font-bold leading-none mb-1">Voyager Client Ledger</span>
                  <strong className="text-sm font-serif font-semibold text-[#1A1A1A]">{selectedInvoicePreview.client}</strong>
                  <span className="block text-[9.5px] mt-1 text-[#857F75]">Ethereal Station Account Match</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] text-[#A6A18F] uppercase font-bold leading-none mb-1">Invoice Coordinates</span>
                  <strong className="text-[#1A1A1A]">{selectedInvoicePreview.id}</strong>
                  <span className="block text-[9.5px] mt-1 text-[#857F75]">REG DATE: {selectedInvoicePreview.date}</span>
                </div>
              </div>

              {/* Itemized Charge breakdown table */}
              <div className="space-y-4">
                <span className="block text-[8px] font-mono text-[#A6A18F] uppercase tracking-widest font-bold">Consigned attunement services</span>
                
                <div className="border border-[#D1CEBF]/50 rounded-xl overflow-hidden text-xs">
                  <div className="bg-[#FAF7F2] p-3 font-mono text-[9px] text-[#A6A18F] font-bold uppercase tracking-wide grid grid-cols-12">
                    <span className="col-span-8">Product specifications mapping</span>
                    <span className="col-span-1 text-center">Qty</span>
                    <span className="col-span-3 text-right">Attune Fee</span>
                  </div>

                  <div className="p-4 grid grid-cols-12 items-center text-[#1A1A1A]">
                    <div className="col-span-8 space-y-1">
                      <strong className="font-serif text-sm font-light uppercase">{selectedInvoicePreview.item}</strong>
                      <span className="block text-[10px] font-mono text-[#A6A18F]">{selectedInvoicePreview.alignment}</span>
                    </div>
                    <span className="col-span-1 text-center font-mono">1</span>
                    <span className="col-span-3 text-right font-mono font-bold">₹{selectedInvoicePreview.amount.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Ganga clean and laser holographic attunement surcharge (Included) */}
                  <div className="px-4 py-2 border-t border-[#FAF7F2] grid grid-cols-12 text-[10px] font-mono text-[#857F75] items-center bg-[#FAF7F2]/20">
                    <span className="col-span-9 uppercase">3-night lunar consecration bathing, Panchamrut cleanse, and signed paper cert</span>
                    <span className="col-span-3 text-right font-bold text-emerald-800 uppercase">Gratis (Inc.)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Grand Totals */}
              <div className="font-mono text-xs flex justify-between items-center bg-[#FAF7F2] p-4 rounded-xl border border-double border-[#D1CEBF] text-right font-bold text-[#1A1A1A]">
                <div className="text-left">
                  <span className="block text-[8px] text-[#A6A18F] uppercase font-bold leading-none mb-1">Solder Attunement Ledger Status</span>
                  <span className={`inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded leading-none ${
                    selectedInvoicePreview.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedInvoicePreview.status}
                  </span>
                </div>
                <div>
                  <span className="block text-[8.5px] text-[#A6A18F] uppercase leading-none mb-1">Consolidated Grand Total</span>
                  <span className="text-base font-serif font-bold text-[#1A1A1A]">₹{selectedInvoicePreview.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Footnote stamp and sign */}
              <div className="flex items-end justify-between pt-6 border-t border-[#D1CEBF]/40 font-mono text-[9px] text-[#A6A18F]">
                <div>
                  <p className="font-sans font-light leading-relaxed max-w-[250px] text-[8.5px]">
                    "Certified natural crystal grids, physically verified by Indian Sceptred Geology Laboratory standard protocols."
                  </p>
                </div>
                <div className="text-center">
                  <span className="block font-serif font-bold italic text-xs text-[#1A1A1A] leading-none mb-1">P. Shastry</span>
                  <span className="block border-t border-[#A6A18F]/40 pt-1 text-[8px] uppercase tracking-widest font-semibold">Chief Astrologer seal</span>
                </div>
              </div>

              {/* Action buttons (Print) */}
              <div className="flex gap-3 justify-end font-mono text-[10px] pt-4">
                <button
                  onClick={() => {
                    alert("A complete, high-resolution dispatch document has been formatted and queued on the printing server.");
                  }}
                  className="cursor-pointer bg-[#F8F6F1] hover:bg-[#E8E6E1]/50 border border-[#D1CEBF] text-[#1A1A1A] font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <Printer className="h-4.5 w-4.5 text-[#A6A18F]" /> Print Certificate
                </button>
                <button
                  onClick={() => setSelectedInvoicePreview(null)}
                  className="cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider"
                >
                  Close View
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* ADD INVOICE SLIDE-OUT PANEL MODAL */}
      <AnimatePresence>
        {showAddInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddInvoiceModal(false)}
              className="absolute inset-0 bg-black/50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-[#D1CEBF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-4 mb-6">
                <h3 className="font-serif text-lg text-[#1A1A1A]">Generate Client Invoice</h3>
                <button onClick={() => setShowAddInvoiceModal(false)} className="text-[#857F75] hover:text-[#1A1A1A] p-2 leading-none">
                  ✕
                </button>
              </div>

              {/* Form entries */}
              <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Patron Voyager Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohini Roy"
                    value={newInvoiceForm.client}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, client: e.target.value })}
                    className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Attunement Selection Item</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Prosperity Wealth Bracelet"
                    value={newInvoiceForm.item}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, item: e.target.value })}
                    className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Astrological Crystal Grid Align</label>
                  <input
                    type="text"
                    placeholder="e.g. Money Magnet (Green Aventurine + Citrine)"
                    value={newInvoiceForm.alignment}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, alignment: e.target.value })}
                    className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Cost mapping (INR)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5900"
                      value={newInvoiceForm.amount}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, amount: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Initial Ledger Status</label>
                    <select
                      value={newInvoiceForm.status}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, status: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-bold"
                    >
                      <option value="Sent">Sent (Unpaid)</option>
                      <option value="Paid">Paid</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border border-[#D1CEBF]/20 mt-4 shadow-md"
                >
                  Add Invoice Record
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* ADD VENDOR SLIDE-OUT PANEL MODAL */}
      <AnimatePresence>
        {showAddVendorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddVendorModal(false)}
              className="absolute inset-0 bg-black/50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-[#D1CEBF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-4 mb-6">
                <h3 className="font-serif text-lg text-[#1A1A1A]">Onboard Artisan & Sourcing Co.</h3>
                <button onClick={() => setShowAddVendorModal(false)} className="text-[#857F75] hover:text-[#1A1A1A] p-2 leading-none">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Mine / Artisan Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ural Quartz Sourcing Ltd"
                    value={newVendorForm.name}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, name: e.target.value })}
                    className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Primary Contact rep</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Viktor Popov"
                      value={newVendorForm.contact}
                      onChange={(e) => setNewVendorForm({ ...newVendorForm, contact: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Origin Basin Coordinates</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ural Mt. Basin"
                      value={newVendorForm.origin}
                      onChange={(e) => setNewVendorForm({ ...newVendorForm, origin: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Artisan Work Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Crystalline Raw Geodes, Mountings"
                    value={newVendorForm.category}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, category: e.target.value })}
                    className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Crystals Shipped Details</label>
                    <input
                      type="text"
                      placeholder="e.g. High Grade Quartz beads"
                      value={newVendorForm.leadGems}
                      onChange={(e) => setNewVendorForm({ ...newVendorForm, leadGems: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Transit lead times</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Days"
                      value={newVendorForm.leadTime}
                      onChange={(e) => setNewVendorForm({ ...newVendorForm, leadTime: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border border-[#D1CEBF]/20 mt-4 shadow-md"
                >
                  Onboard Sourcing Partner
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* ADD EXPENSE SLIDE-OUT PANEL MODAL */}
      <AnimatePresence>
        {showAddExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddExpenseModal(false)}
              className="absolute inset-0 bg-black/50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-[#D1CEBF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-4 mb-6">
                <h3 className="font-serif text-lg text-[#1A1A1A]">Record Purification Expenses</h3>
                <button onClick={() => setShowAddExpenseModal(false)} className="text-[#857F75] hover:text-[#1A1A1A] p-2 leading-none">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Expenditure Descriptor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saffron thread bundle locks"
                    value={newExpenseForm.title}
                    onChange={(e) => setNewExpenseForm({ ...newExpenseForm, title: e.target.value })}
                    className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold font-bold text-amber-800 font-mono">Cost sum (INR)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3500"
                      value={newExpenseForm.amount}
                      onChange={(e) => setNewExpenseForm({ ...newExpenseForm, amount: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Administrative Category</label>
                    <select
                      value={newExpenseForm.category}
                      onChange={(e) => setNewExpenseForm({ ...newExpenseForm, category: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-bold"
                    >
                      <option value="Ritual Consecration">Ritual Consecration</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Quality Inspection">Quality Inspection</option>
                      <option value="Sourcing & Shipping">Sourcing & Shipping</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Supplementary ledger specification notes</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Attuned thread materials for sealing certificates"
                    value={newExpenseForm.notes}
                    onChange={(e) => setNewExpenseForm({ ...newExpenseForm, notes: e.target.value })}
                    className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border border-[#D1CEBF]/20 mt-4 shadow-md"
                >
                  Log Expense Record
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ADD ATTUNEMENT SPRINT TASK PANEL MODAL */}
      <AnimatePresence>
        {showAddTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTaskModal(false)}
              className="absolute inset-0 bg-black/50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-[#D1CEBF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-4 mb-6">
                <h3 className="font-serif text-lg text-[#1A1A1A]">Assign Attunement Work</h3>
                <button onClick={() => setShowAddTaskModal(false)} className="text-[#857F75] hover:text-[#1A1A1A] p-2 leading-none">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Sprinted Attunement Work Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Recalibrate Citrine solar lock nodes"
                    value={newTaskForm.title}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                    className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Responsible Assignee</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pandit Shastri Ji"
                      value={newTaskForm.assignee}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, assignee: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Calibration Days Allotted</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3"
                      value={newTaskForm.daysLeft}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, daysLeft: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Priority Calibrations</label>
                    <select
                      value={newTaskForm.priority}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-bold"
                    >
                      <option value="High">🔴 High Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="Low">🟢 Low Priority</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Purification Phase Lane</label>
                    <select
                      value={newTaskForm.status}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value })}
                      className="w-full bg-[#FAF7F2]/45 border border-[#D1CEBF] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-bold"
                    >
                      <option value="Backlog">Backlog</option>
                      <option value="Water Cleanse">Water Cleanse</option>
                      <option value="Moon Bath Bathing">Moon Bath Bathing</option>
                      <option value="Sealed / Composed">Sealed / Composed</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border border-[#D1CEBF]/20 mt-4 shadow-md"
                >
                  Allocate Attunement Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
