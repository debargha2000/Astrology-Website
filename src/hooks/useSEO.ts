import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
}

export function useSEO({
  title,
  description,
  image,
  type = 'website',
  price,
  currency = 'INR',
  availability = 'in_stock',
}: SEOProps) {
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://auraandstone.in';

  useEffect(() => {
    document.title = title;

    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);

    // Open Graph
    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:type', type);
    updateProperty('og:url', `${baseUrl}${location.pathname}`);

    if (image) {
      updateProperty('og:image', image);
      updateMeta('twitter:image', image);
    }

    // Product specific
    if (type === 'product' && price) {
      updateProperty('product:price:amount', price.toString());
      updateProperty('product:price:currency', currency);
      updateProperty('product:availability', availability);
    }

    // JSON-LD structured data
    let jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': type === 'product' ? 'Product' : 'WebSite',
      name: 'Aura & Stone',
      url: baseUrl,
      description,
    };

    if (type === 'product' && price) {
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description,
        image: image ? [image] : [],
        brand: {
          '@type': 'Brand',
          name: 'Aura & Stone',
        },
        offers: {
          '@type': 'Offer',
          url: `${baseUrl}${location.pathname}`,
          priceCurrency: currency,
          price: price.toString(),
          availability: `https://schema.org/${availability.replace('_', '')}`,
          seller: {
            '@type': 'Organization',
            name: 'Aura & Stone',
          },
        },
      } as Record<string, unknown>;
    }

    // Remove existing JSON-LD
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.title = 'Aura & Stone - Crystalline Astrology';
    };
  }, [title, description, image, type, price, currency, availability, location.pathname, baseUrl]);
}

export function useBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://auraandstone.in';

  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${baseUrl}${item.url}`,
      })),
    };

    // Remove existing breadcrumb JSON-LD
    const existingScript = document.querySelector('script[data-breadcrumb]');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb', 'true');
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      const existing = document.querySelector('script[data-breadcrumb]');
      if (existing) existing.remove();
    };
  }, [items, location.pathname, baseUrl]);
}
