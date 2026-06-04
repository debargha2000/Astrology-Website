import React, { useEffect, useState } from 'react';

import { AstroTab } from './cms/AstroTab';
import { AuthGate } from './cms/AuthGate';
import { CmsHeader } from './cms/CmsHeader';
import { DashboardTab } from './cms/DashboardTab';
import { ExpensesTab } from './cms/ExpensesTab';
import { TasksTab } from './cms/TasksTab';
import { GmailTab } from './cms/GmailTab';
import { InvoicesTab } from './cms/InvoicesTab';
import { ProductsTab } from './cms/ProductsTab';
import { LogsTab } from './cms/LogsTab';
import { SiteTab } from './cms/SiteTab';
import { ToastContainer } from './cms/Toast';
import type { CmsSubTab } from './cms/types';
import { useCmsHandlers } from './cms/useCmsHandlers';
import { useCmsAuth, useCmsData } from './cms/useCmsState';
import { useToast } from './cms/useToast';
import { VendorsTab } from './cms/VendorsTab';

interface BusinessOperationsCMSProps {
  onDataChange?: () => void;
  currentProducts?: any[];
  currentWebsiteContent?: any;
}

export default function BusinessOperationsCMS(_props: BusinessOperationsCMSProps = {}) {
  const auth = useCmsAuth();
  const data = useCmsData();
  const { toasts, addToast, removeToast } = useToast();
  const handlers = useCmsHandlers({ ...auth, ...data }, addToast);
  const [activeTab, setActiveTab] = useState<CmsSubTab>('dashboard');

  useEffect(() => {
    if (auth.isAuthenticated) {
      data.loadData();
    }
  }, [auth.isAuthenticated, data]);

  if (!auth.isAuthenticated) {
    return (
      <AuthGate
        authError={auth.authError}
        isAuthLoading={auth.isAuthLoading}
        onLogin={auth.login}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <CmsHeader
        googleUser={auth.googleUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        onLogout={auth.logout}
      />

      {activeTab === 'dashboard' && (
        <DashboardTab state={{ ...auth, ...data }} handlers={handlers} onNavigate={setActiveTab} />
      )}
      {activeTab === 'invoices' && <InvoicesTab state={{ ...auth, ...data }} handlers={handlers} />}
      {activeTab === 'vendors' && <VendorsTab state={{ ...auth, ...data }} handlers={handlers} />}
      {activeTab === 'expenses' && <ExpensesTab state={{ ...auth, ...data }} handlers={handlers} />}
      {activeTab === 'tasks' && <TasksTab state={{ ...auth, ...data }} handlers={handlers} />}
      {activeTab === 'gmail' && <GmailTab state={{ ...auth, ...data }} />}
      {activeTab === 'products' && <ProductsTab state={{ ...auth, ...data }} handlers={handlers} />}
      {activeTab === 'site' && <SiteTab state={{ ...auth, ...data }} handlers={handlers} />}
      {activeTab === 'logs' && <LogsTab state={{ ...auth, ...data }} />}
      {activeTab === 'astro' && <AstroTab state={{ ...auth, ...data }} handlers={handlers} />}
    </div>
  );
}
