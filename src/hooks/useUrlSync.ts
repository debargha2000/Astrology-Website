/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { PageId } from '../types';

/**
 * Synchronizes the URL path with the current page state and vice versa.
 * - When the URL changes (popstate / hashchange), update the page.
 * - When the page changes, push the matching URL into history.
 */
export function useUrlSync(
  currentPage: PageId,
  setCurrentPage: (page: PageId) => void
): void {
  useEffect(() => {
    const BASE_PATH = import.meta.env.BASE_URL || '/';

    const isAdminPath = (path: string): boolean => {
      const normalized = path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) : path;
      return (
        normalized === 'admin' ||
        normalized === 'admin/' ||
        normalized === '/admin' ||
        normalized === '/admin/'
      );
    };

    const isAdminHash = (hash: string): boolean =>
      hash === '#/admin' || hash === '#admin' || hash === '#/cms' || hash === '#cms';

    const handleRouteCheck = (): void => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (isAdminPath(path) || isAdminHash(hash)) {
        if (currentPage !== 'cms') setCurrentPage('cms');
      }
    };

    handleRouteCheck();
    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('hashchange', handleRouteCheck);
    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('hashchange', handleRouteCheck);
    };
  }, [currentPage, setCurrentPage]);

  useEffect(() => {
    const BASE_PATH = import.meta.env.BASE_URL || '/';
    const path = window.location.pathname;
    const hash = window.location.hash;
    const normalizedPath = path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) : path;
    const isAdminPath =
      normalizedPath === 'admin' || normalizedPath === 'admin/' || normalizedPath === '/admin' || normalizedPath === '/admin/';
    const isAdminHash =
      hash === '#/admin' || hash === '#admin' || hash === '#/cms' || hash === '#cms';

    if (currentPage === 'cms') {
      if (!isAdminPath && !isAdminHash) {
        window.history.pushState({ page: 'cms' }, '', BASE_PATH + 'admin');
      }
    } else {
      if (isAdminPath) {
        window.history.pushState({ page: currentPage }, '', BASE_PATH);
      }
    }
  }, [currentPage]);
}

export function useScrollToTop(dependency: unknown): void {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dependency]);
}
