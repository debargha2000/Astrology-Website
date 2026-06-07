import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  FileText,
  Users,
  DollarSign,
  CheckSquare,
} from 'lucide-react';
import { useMemo } from 'react';

import { googleSignIn } from '../../lib/firebase';

import type { CmsSubTab, Invoice, Expense } from './types';
import type { CmsHandlers } from './useCmsHandlers';
import type { CmsState } from './useCmsState';

interface Props {
  state: CmsState;
  handlers: CmsHandlers;
  onNavigate: (tab: CmsSubTab) => void;
}

function buildChart(invoices: Invoice[], expenses: Expense[]) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const invoiceByMonth: Record<number, number> = {};
  const expenseByMonth: Record<number, number> = {};

  invoices.forEach((inv) => {
    const d = new Date(inv.date);
    if (!isNaN(d.getTime())) {
      const m = d.getMonth();
      invoiceByMonth[m] = (invoiceByMonth[m] || 0) + (inv.amount || 0);
    }
  });

  expenses.forEach((exp) => {
    const d = new Date(exp.date);
    if (!isNaN(d.getTime())) {
      const m = d.getMonth();
      expenseByMonth[m] = (expenseByMonth[m] || 0) + (exp.amount || 0);
    }
  });

  const usedMonths = Array.from(
    new Set([
      ...Object.keys(invoiceByMonth).map(Number),
      ...Object.keys(expenseByMonth).map(Number),
    ])
  ).sort((a, b) => a - b);

  if (usedMonths.length === 0) {
    return {
      points: { billing: '', expense: '' },
      labels: ['No data'],
      maxVal: 1,
      billingData: [],
      expenseData: [],
    };
  }

  const billingData = usedMonths.map((m) => ({
    month: m,
    label: months[m],
    value: invoiceByMonth[m] || 0,
  }));
  const expenseData = usedMonths.map((m) => ({
    month: m,
    label: months[m],
    value: expenseByMonth[m] || 0,
  }));

  const allValues = [...billingData.map((d) => d.value), ...expenseData.map((d) => d.value)];
  const maxVal = Math.max(...allValues, 1);

  const padX = 40;
  const padY = 10;
  const chartW = 600 - padX * 2;
  const chartH = 100 - padY * 2;

  const toPoints = (data: { value: number }[]) => {
    return data
      .map((d, i) => {
        const x = padX + (i / Math.max(data.length - 1, 1)) * chartW;
        const y = padY + chartH - (d.value / maxVal) * chartH;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const labels = billingData.map((d) => d.label);

  return {
    points: { billing: toPoints(billingData), expense: toPoints(expenseData) },
    labels,
    maxVal,
    billingData,
    expenseData,
  };
}

export function DashboardTab({ state, handlers, onNavigate }: Props) {
  const {
    invoices,
    vendors,
    expenses,
    tasks,
    terminalLog,
    useFirestoreSource,
    setUseFirestoreSource,
    firestoreSyncLoading,
    firestoreSyncSuccess,
    googleUser,
  } = state;
  const { addTerminalLog, syncLocalToFirestore } = handlers;

  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const paidInvoiced = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((a, c) => a + c.amount, 0);
  const totalOpex = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const activeTasks = tasks.filter((t) => t.status !== 'Sealed / Composed').length;

  const chart = useMemo(() => buildChart(invoices, expenses), [invoices, expenses]);
  const hasChartData = chart.billingData.length > 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-cream border border-stone p-6 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xs">
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#1C1C1C] text-sky-200 font-mono text-[9px] uppercase tracking-widest rounded-md font-bold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="h-3 w-3 text-gold" /> FIREBASE CLOUD FORTS
            </span>
            <span className="text-[10px] font-mono text-clay uppercase tracking-wider font-bold">
              PROJECT: aura-and-stone
            </span>
          </div>
          <h2 className="font-serif text-xl font-light text-ink tracking-wider">
            Vedas Cloud{' '}
            <span className="font-semibold text-gold-muted">Storage Core Controller</span>
          </h2>
          <p className="text-xs text-ink/75 leading-relaxed font-sans max-w-3xl font-light">
            Configure your dual-mode storage core. Transition seamlessly between standard
            low-latency flat-file cluster and your secure mathematically-hardened Google Cloud
            Firestore. Synced operations conform strictly to deployed Zero-Trust cellular rules.
          </p>
          {firestoreSyncSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-mono flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{firestoreSyncSuccess}</span>
            </div>
          )}
        </div>

        <div className="md:col-span-4 flex flex-col gap-3 justify-center">
          <div className="flex items-center justify-between p-2.5 bg-white border border-stone rounded-2xl gap-4">
            <span className="text-[10px] font-mono font-bold text-ink uppercase tracking-wider">
              Active Core:
            </span>
            <div className="flex items-center gap-1 bg-cream p-1 rounded-xl border border-stone/45">
              <button
                onClick={() => setUseFirestoreSource(false)}
                className={`px-2.5 py-1 text-[9.5px] font-mono rounded-lg font-bold uppercase tracking-widest cursor-pointer transition-all ${
                  !useFirestoreSource ? 'bg-ink text-white shadow-xs' : 'text-clay hover:text-ink'
                }`}
              >
                Local Flat
              </button>
              <button
                onClick={() => {
                  if (!googleUser) {
                    return;
                  }
                  setUseFirestoreSource(true);
                }}
                className={`px-2.5 py-1 text-[9.5px] font-mono rounded-lg font-bold uppercase tracking-widest cursor-pointer transition-all ${
                  useFirestoreSource
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-clay hover:text-emerald-800'
                }`}
              >
                Firestore
              </button>
            </div>
          </div>

          {googleUser ? (
            <button
              onClick={async () => {
                state.setFirestoreSyncLoading(true);
                state.setFirestoreSyncSuccess(null);
                await syncLocalToFirestore();
              }}
              disabled={firestoreSyncLoading}
              className="cursor-pointer text-center bg-ink hover:bg-black text-white py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              {firestoreSyncLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-gold" />
                  <span>Syncing Collections...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 text-gold" />
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
                  // Auth handled by parent
                }
              }}
              className="cursor-pointer text-center bg-white hover:bg-cream border border-stone text-ink py-3.5 px-4 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-xs flex items-center justify-center gap-2"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total billing ledger',
            value: `₹${totalInvoiced.toLocaleString('en-IN')}`,
            sub: `Paid: ₹${paidInvoiced.toLocaleString('en-IN')}`,
            icon: FileText,
          },
          {
            label: 'Mineral supply partners',
            value: `${vendors.length} Vendors`,
            sub: 'All geological matrix verified',
            icon: Users,
          },
          {
            label: 'Temple purify expenditures',
            value: `₹${totalOpex.toLocaleString('en-IN')}`,
            sub: 'Acoustics & Sandalwood: 62%',
            icon: DollarSign,
          },
          {
            label: 'Attunement sprint schedule',
            value: `${activeTasks} Active Tasks`,
            sub: '4 High Priority items pending bath',
            icon: CheckSquare,
          },
        ].map((m, i) => (
          <div
            key={i}
            className="p-6 bg-white border border-stone rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="absolute top-0 right-0 h-16 w-16 bg-cream rounded-bl-full pointer-events-none flex items-center justify-end p-2 text-stone">
              <m.icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold-muted font-bold">
              {m.label}
            </span>
            <div className="mt-4 space-y-1">
              <span className="text-3xl font-serif text-ink font-light">{m.value}</span>
              <p className="text-[9.5px] text-gold-muted font-mono leading-none">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-stone p-6 rounded-3xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-cream pb-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-[0.25em] text-gold-muted uppercase font-bold block">
                Consolidated Analytics
              </span>
              <h3 className="font-serif text-lg text-ink">
                Operational Cashflow vs. Purifying Expenses
              </h3>
            </div>
            <div className="flex gap-4 font-mono text-[9px] font-bold uppercase tracking-wide text-ink/80">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
                <span>Invoiced Volume</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
                <span>Purify Expenses</span>
              </div>
            </div>
          </div>

          <div className="relative pt-6 h-52 w-full">
            {hasChartData ? (
              <>
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 100"
                  preserveAspectRatio="none"
                >
                  <line x1="40" y1="10" x2="40" y2="90" stroke="#FAF7F2" strokeWidth="1" />
                  <line x1="40" y1="90" x2="560" y2="90" stroke="#FAF7F2" strokeWidth="1" />
                  {[0.25, 0.5, 0.75].map((frac) => (
                    <line
                      key={frac}
                      x1="40"
                      y1={90 - frac * 80}
                      x2="560"
                      y2={90 - frac * 80}
                      stroke="#FAF7F2"
                      strokeWidth="1"
                      strokeDasharray="3"
                    />
                  ))}
                  <polygon
                    points={`40,90 ${chart.points.billing} ${40 + (chart.billingData.length > 1 ? 520 : 0)},90`}
                    fill="rgba(4, 120, 87, 0.08)"
                  />
                  <polygon
                    points={`40,90 ${chart.points.expense} ${40 + (chart.expenseData.length > 1 ? 520 : 0)},90`}
                    fill="rgba(217, 119, 6, 0.05)"
                  />
                  <polyline
                    points={chart.points.billing}
                    fill="none"
                    stroke="#047857"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={chart.points.expense}
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="2"
                    strokeDasharray="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chart.billingData.map((d, i) => {
                    const x = 40 + (i / Math.max(chart.billingData.length - 1, 1)) * 520;
                    const y = 90 - (d.value / chart.maxVal) * 80;
                    return <circle key={`b-${i}`} cx={x} cy={y} r="3" fill="#047857" />;
                  })}
                  {chart.expenseData.map((d, i) => {
                    const x = 40 + (i / Math.max(chart.expenseData.length - 1, 1)) * 520;
                    const y = 90 - (d.value / chart.maxVal) * 80;
                    return <circle key={`e-${i}`} cx={x} cy={y} r="3" fill="#D97706" />;
                  })}
                </svg>
                <div className="flex justify-between font-mono text-[9px] text-gold-muted pt-3 uppercase tracking-widest border-t border-cream/60 mt-2">
                  {chart.labels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-clay uppercase tracking-wider">
                No invoice or expense data available for chart
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-ink border border-stone/20 rounded-3xl p-6 text-white space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-1 border-b border-white/10 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] bg-red-800 text-white px-2 py-0.5 rounded leading-none">
                REAL-TIME
              </span>
              <span className="font-mono text-[9px] text-gold-muted uppercase tracking-wider font-bold">
                Operations Logs
              </span>
            </div>
            <h4 className="font-serif text-paper font-semibold text-sm">Sacred Ledger Feed</h4>
          </div>

          <div className="flex-1 font-mono text-[10px] space-y-2 text-paper/80 max-h-36 overflow-y-auto pr-1 scrollbar-none">
            {terminalLog.map((log, i) => (
              <p key={i} className="line-clamp-2 hover:text-gold transition-colors leading-relaxed">
                {log}
              </p>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold tracking-widest">
              Rapid Quick Triggers
            </span>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
              <button
                onClick={() =>
                  addTerminalLog(
                    'MANUAL OVERRIDE: Moon purification frequencies recalibrated at 432Hz.'
                  )
                }
                className="cursor-pointer text-left bg-white/10 hover:bg-white/15 text-white p-2 rounded border border-white/5 transition-colors uppercase font-bold"
              >
                ✦ Calm Freq Bath
              </button>
              <button
                onClick={() =>
                  addTerminalLog(
                    'MANUAL OVERRIDE: Solder seal validation triggered on dispatch bulk packaging.'
                  )
                }
                className="cursor-pointer text-left bg-white/10 hover:bg-white/15 text-white p-2 rounded border border-white/5 transition-colors uppercase font-bold"
              >
                ⚡ Solder Seal Check
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="bg-white border border-stone rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-cream pb-3">
            <h3 className="font-serif text-base text-ink">Urgent Attunement Tasks</h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="cursor-pointer font-mono text-[9px] text-gold-muted hover:text-ink border-b border-dashed border-gold-muted pb-0.5 uppercase tracking-widest"
            >
              Go to Kanban Board →
            </button>
          </div>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.priority === 'High' && t.status !== 'Sealed / Composed')
              .slice(0, 3)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-cream/45 border border-stone/40 p-3 rounded-xl hover:border-stone transition-colors"
                >
                  <div className="space-y-1">
                    <span className="block text-xs text-ink font-medium leading-normal">
                      {task.title}
                    </span>
                    <div className="flex gap-2 items-center text-[9px] font-mono">
                      <span className="text-gold-muted">{task.assignee}</span>
                      <span className="text-ink/40">•</span>
                      <span className="text-amber-800 font-bold bg-amber-100 px-1 py-0.5 rounded leading-none">
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gold-muted whitespace-nowrap bg-white border border-stone/45 px-2 py-1 rounded-lg">
                    {task.daysLeft} Day{task.daysLeft > 1 ? 's' : ''} Left
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white border border-stone rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-cream pb-3">
            <h3 className="font-serif text-base text-ink">Geological Sourcing Vendors</h3>
            <button
              onClick={() => onNavigate('vendors')}
              className="cursor-pointer font-mono text-[9px] text-gold-muted hover:text-ink border-b border-dashed border-gold-muted pb-0.5 uppercase tracking-widest"
            >
              Manage Sourcing Co. →
            </button>
          </div>
          <div className="space-y-3">
            {vendors.slice(0, 3).map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between bg-cream/45 border border-stone/40 p-3 rounded-xl"
              >
                <div className="space-y-1">
                  <span className="block text-xs text-ink font-semibold">{vendor.name}</span>
                  <p className="text-[9.5px] text-clay font-mono leading-none">
                    {vendor.leadGems} • {vendor.origin}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                  {vendor.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
