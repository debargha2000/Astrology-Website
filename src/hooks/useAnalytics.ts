import { useCallback, useEffect } from 'react';

interface AnalyticsEvent {
  event_name: string;
  parameters?: Record<string, unknown>;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
    clarity: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID || 'G-XXXXXXXXXX';
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || 'XXXXXXXXXXXXXX';

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });

  // Facebook Pixel
  if (FB_PIXEL_ID !== 'XXXXXXXXXXXXXX') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).fbq) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq = function (...args: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).fbq.callMethod) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).fbq.callMethod.apply((window as any).fbq, args);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).fbq.queue.push(args);
        }
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fbq ||
      function (...args: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).fbq.queue.push(args);
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq.push(['init', FB_PIXEL_ID]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fbq.push(['track', 'PageView']);
  }

  // Microsoft Clarity
  if (import.meta.env.VITE_CLARITY_ID) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).clarity =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clarity ||
      function (...args: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).clarity.q = (window as any).clarity.q || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).clarity.q.push(args);
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).clarity('start', import.meta.env.VITE_CLARITY_ID);
  }
}

export function trackEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  const eventData: AnalyticsEvent = {
    event_name: eventName,
    parameters: {
      ...parameters,
      page_location: window.location.href,
      page_title: document.title,
    },
  };

  // GA4
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('trackCustom', eventName, parameters);
  }

  // Microsoft Clarity
  if (window.clarity) {
    window.clarity('set', 'custom', { event: eventName, ...parameters });
  }

  // Custom analytics endpoint
  fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
    keepalive: true,
  }).catch(() => {});
}

export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}

export function trackProductView(
  productId: string,
  productName: string,
  price: number,
  category: string
) {
  trackEvent('view_item', {
    item_id: productId,
    item_name: productName,
    price,
    currency: 'INR',
    item_category: category,
  });

  if (window.gtag) {
    window.gtag('event', 'view_item', {
      items: [
        {
          item_id: productId,
          item_name: productName,
          price,
          currency: 'INR',
          item_category: category,
        },
      ],
    });
  }
}

export function trackAddToCart(
  productId: string,
  productName: string,
  price: number,
  quantity: number,
  category: string
) {
  trackEvent('add_to_cart', {
    item_id: productId,
    item_name: productName,
    price,
    currency: 'INR',
    quantity,
    item_category: category,
    value: price * quantity,
  });

  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      items: [
        {
          item_id: productId,
          item_name: productName,
          price,
          currency: 'INR',
          quantity,
          item_category: category,
        },
      ],
      value: price * quantity,
      currency: 'INR',
    });
  }
}

export function trackBeginCheckout(
  cartItems: Array<{ id: string; name: string; price: number; quantity: number; category: string }>
) {
  const value = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  trackEvent('begin_checkout', {
    currency: 'INR',
    value,
    items: cartItems.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category,
    })),
  });

  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'INR',
      value,
      items: cartItems.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        currency: 'INR',
        quantity: item.quantity,
        item_category: item.category,
      })),
    });
  }
}

export function trackPurchase(
  orderId: string,
  value: number,
  cartItems: Array<{ id: string; name: string; price: number; quantity: number; category: string }>,
  coupon?: string
) {
  trackEvent('purchase', {
    transaction_id: orderId,
    value,
    currency: 'INR',
    coupon,
    items: cartItems.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      currency: 'INR',
      quantity: item.quantity,
      item_category: item.category,
    })),
  });

  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value,
      currency: 'INR',
      coupon,
      items: cartItems.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        currency: 'INR',
        quantity: item.quantity,
        item_category: item.category,
      })),
    });
  }
}

export function trackSearch(searchTerm: string, resultsCount: number) {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

export function trackZodiacCalculation(sign: string, birthDate: string) {
  trackEvent('zodiac_calculation', {
    zodiac_sign: sign,
    birth_date: birthDate,
  });
}

export function trackAIInteraction(
  type: 'recommendation' | 'chatbot' | 'content_generation' | 'astrology_insight',
  success: boolean,
  latency: number
) {
  trackEvent('ai_interaction', {
    ai_type: type,
    success,
    latency_ms: latency,
  });
}

export function useAnalytics() {
  useEffect(() => {
    initAnalytics();

    // Track initial page view
    trackPageView(window.location.pathname, document.title);

    // Listen for route changes
    const handleRouteChange = () => {
      trackPageView(window.location.pathname, document.title);
    };

    window.addEventListener('popstate', handleRouteChange);
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);
}

export function useProductAnalytics(
  productId: string,
  productName: string,
  price: number,
  category: string
) {
  const trackView = useCallback(
    () => trackProductView(productId, productName, price, category),
    [productId, productName, price, category]
  );
  const trackAdd = useCallback(
    (quantity: number) => trackAddToCart(productId, productName, price, quantity, category),
    [productId, productName, price, category]
  );

  return { trackView, trackAdd };
}

export function useCheckoutAnalytics(
  cartItems: Array<{ id: string; name: string; price: number; quantity: number; category: string }>
) {
  const trackCheckout = useCallback(() => trackBeginCheckout(cartItems), [cartItems]);
  const trackOrder = useCallback(
    (orderId: string, value: number, coupon?: string) =>
      trackPurchase(
        orderId,
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        cartItems,
        coupon
      ),
    [cartItems]
  );

  return { trackCheckout, trackOrder };
}
