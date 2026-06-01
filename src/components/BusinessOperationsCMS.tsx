import React, { useEffect, useState } from 'react';
import { useCmsAuth, useCmsData } from './cms/useCmsState';
import { useCmsHandlers } from './cms/useCmsHandlers';
import { AuthGate } from './cms/AuthGate';
import { CmsHeader } from './cms/CmsHeader';
import { DashboardTab } from './cms/DashboardTab';
import { InvoicesTab } from './cms/InvoicesTab';
import { VendorsTab } from './cms/VendorsTab';
import { ExpensesTab } from './cms/ExpensesTab';
import { TasksTab } from './cms/TasksTab';
import { GmailTab } from './cms/GmailTab';
import { ProductsTab } from './cms/ProductsTab';
import { SiteTab } from './cms/SiteTab';
import type { CmsSubTab } from './cms/types';

interface BusinessOperationsCMSProps {
  onDataChange?: () => void;
  currentProducts?: any[];
  currentWebsiteContent?: any;
}

export default function BusinessOperationsCMS(_props: BusinessOperationsCMSProps = {}) {
  const auth = useCmsAuth();
  const data = useCmsData();
  const handlers = useCmsHandlers({ ...auth, ...data });
  const [activeTab, setActiveTab] = useState<CmsSubTab>('dashboard');

  useEffect(() => {
    if (auth.isAuthenticated) {
      data.loadData();
    }
  }, [auth.isAuthenticated, data]);

  if (!auth.isAuthenticated) {
    return <AuthGate authError={auth.authError} isAuthLoading={auth.isAuthLoading} onLogin={auth.login} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
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
    </div>
  );
}
