import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useNavigationStore } from '../store/navigationStore';
import type { PageId } from '../types';

const PAGE_TO_PATH: Record<PageId, string> = {
  home: '/',
  shop: '/shop',
  products: '/shop',
  'zodiac-calculator': '/zodiac-calculator',
  'charging-station': '/charging-station',
  encyclopedia: '/encyclopedia',
  about: '/about',
  checkout: '/checkout',
  cms: '/admin',
};

const PATH_TO_PAGE: Record<string, PageId> = {
  '/': 'home',
  '/shop': 'shop',
  '/zodiac-calculator': 'zodiac-calculator',
  '/charging-station': 'charging-station',
  '/encyclopedia': 'encyclopedia',
  '/about': 'about',
  '/checkout': 'checkout',
  '/admin': 'cms',
  '/cms': 'cms',
};

/**
 * Invisible component that bidirectionally syncs
 * the Zustand navigationStore ↔ React Router.
 *
 * - When `setCurrentPage(page)` is called anywhere in the app,
 *   this component calls `navigate(path)` so React Router
 *   renders the correct `<Route>`.
 *
 * - When the URL changes (browser back/forward, direct entry),
 *   this component calls `setCurrentPage(page)` so the Zustand
 *   store (and any UI that reads `currentPage`) stays in sync.
 */
export default function NavigationSync() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPage, setCurrentPage } = useNavigationStore();

  // Track the last values we synced to avoid infinite loops
  const lastSyncedPage = useRef<PageId>(currentPage);
  const lastSyncedPath = useRef<string>(location.pathname);

  // Zustand → Router
  useEffect(() => {
    if (currentPage !== lastSyncedPage.current) {
      lastSyncedPage.current = currentPage;
      const targetPath = PAGE_TO_PATH[currentPage] || '/';
      if (location.pathname !== targetPath) {
        lastSyncedPath.current = targetPath;
        navigate(targetPath);
      }
    }
  }, [currentPage, navigate, location.pathname]);

  // Router → Zustand
  useEffect(() => {
    if (location.pathname !== lastSyncedPath.current) {
      lastSyncedPath.current = location.pathname;
      const page = PATH_TO_PAGE[location.pathname] || 'home';
      if (page !== currentPage) {
        lastSyncedPage.current = page;
        setCurrentPage(page);
      }
    }
  }, [location.pathname, currentPage, setCurrentPage]);

  return null;
}
