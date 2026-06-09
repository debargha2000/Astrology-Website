import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ZodiacCalculatorPage = lazy(() => import('./pages/ZodiacCalculatorPage'));
const ChargingStationPage = lazy(() => import('./pages/ChargingStationPage'));
const EncyclopediaPage = lazy(() => import('./pages/EncyclopediaPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CMSPage = lazy(() => import('./pages/CMSPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono tracking-widest uppercase text-[#857F75]">
          Aligning cosmic frequencies...
        </p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/zodiac-calculator" element={<ZodiacCalculatorPage />} />
        <Route path="/charging-station" element={<ChargingStationPage />} />
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<CMSPage />} />
        <Route path="/cms" element={<CMSPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
