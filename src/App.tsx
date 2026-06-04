/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PageId, Product, CartItem, Review, WebsiteContent, Checkpoint } from './types';
import { PRODUCTS, REVIEWS, HERO_IMAGE, COMBO_IMAGE, RITUAL_IMAGE, VEDIC_EXPERT_IMAGE, POLISHED_GEMSTONES_LOOM_IMAGE, MONEY_MAGNET_IMAGE, EVIL_EYE_IMAGE, STRESS_KILLER_IMAGE, LOVE_HARMONY_IMAGE } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ZodiacCalculator from './components/ZodiacCalculator';
import ChargingStation from './components/ChargingStation';
import CrystalEncyclopedia from './components/CrystalEncyclopedia';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import BusinessOperationsCMS from './components/BusinessOperationsCMS';
import PranayamaCalmGuide from './components/PranayamaCalmGuide';
import { BirthDetailsForm } from './components/astro/BirthDetailsForm';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Flame, Eye, ShoppingBag, ShieldCheck, HelpCircle, Send, Check, Heart, Sparkles, MessageSquarePlus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAppStore } from './store';
import { apiService } from './services/api';
import type { BirthDetails } from './types';

export default function App() {
  // Use Zustand store for state management
  const {
    products,
    websiteContent,
    isCartOpen,
    selectedProduct,
    currentPage,
    cartItems,
    setProducts: setProductsStore,
    setWebsiteContent: setWebsiteContentStore,
    setCartItems: setCartItemsStore,
    setSelectedProduct: setSelectedProductStore,
    setCurrentPage: setCurrentPageStore,
    setIsCartOpen: setIsCartOpenStore,
  } = useAppStore();

  const setCartItems = setCartItemsStore;
  const setSelectedProduct = setSelectedProductStore;
  const setCurrentPage = setCurrentPageStore;
  const setIsCartOpen = setIsCartOpenStore;

  // Fetch dynamic data on initial load and after CMS edits
  const fetchDynamicData = React.useCallback(async () => {
    try {
      const [productsData, contentData] = await Promise.all([
        apiService.getProducts(),
        apiService.getWebsiteContent()
      ]);

      if (Array.isArray(productsData) && productsData.length > 0) {
        setProductsStore(productsData as Product[]);
      }
      if (contentData && typeof contentData === 'object') {
        setWebsiteContentStore(contentData as WebsiteContent);
      }
    } catch (error) {
      console.warn("Error fetching dynamic products and website configs.", error);
      // Fallback to local data is handled by the store initialization
    }
  }, [setProductsStore, setWebsiteContentStore]);

  React.useEffect(() => {
    fetchDynamicData();
  }, [fetchDynamicData]);

  // Navigation & Cart States (from store)

  // Circular Slideshow States for Luxury Hero
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideshowImages = [
    { name: "The Money Magnet Bracelet", img: MONEY_MAGNET_IMAGE, crystal: "Citrine & Pyrite", price: "₹1,199" },
    { name: "Grounding Armor Nazar Shield", img: EVIL_EYE_IMAGE, crystal: "Black Tourmaline", price: "₹899" },
    { name: "The Master Healer Pack", img: COMBO_IMAGE, crystal: "Faceted Clear Quartz", price: "₹1,899" },
    { name: "The Stress Killer Remedy", img: STRESS_KILLER_IMAGE, crystal: "Royal Amethyst", price: "₹999" },
    { name: "Divine Harmony & Calm", img: LOVE_HARMONY_IMAGE, crystal: "Rose Quartz & Peach Sunstone", price: "₹949" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slideshowImages.length]);

  // Filter and Sorting in Shop Component
  const [shopCategory, setShopCategory] = useState<'all' | 'bracelet' | 'ring' | 'combo'>('all');
  const [shopSort, setShopSort] = useState<'rating' | 'price-low' | 'price-high'>('rating');

  // Testimonials & Review Submission States
  const [allReviews, setAllReviews] = useState<Review[]>(REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewProduct, setNewReviewProduct] = useState(PRODUCTS[0].name);
  const [reviewCarouselIdx, setReviewCarouselIdx] = useState(0);

  // About Page Contact Form State
  const [contactBirthDetails, setContactBirthDetails] = useState<BirthDetails>({ name: '', birthDate: '' });
  const [contactQuery, setContactQuery] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Synchronize route paths /admin or hash #/admin or #admin to load the CMS page
  useEffect(() => {
    const BASE_PATH = import.meta.env.BASE_URL || '/';

    const handleRouteCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      // Strip base path prefix for comparison
      const normalizedPath = path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) : path;
      
      if (
        normalizedPath === 'admin' || 
        normalizedPath === 'admin/' || 
        normalizedPath === '/admin' || 
        normalizedPath === '/admin/' ||
        hash === '#/admin' || 
        hash === '#admin' || 
        hash === '#/cms' || 
        hash === '#cms'
      ) {
        if (currentPage !== 'cms') {
          setCurrentPage('cms');
        }
      }
    };

    // Run once on load
    handleRouteCheck();

    // Listen to route changes
    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('hashchange', handleRouteCheck);
    
    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('hashchange', handleRouteCheck);
    };
  }, [currentPage]);

  // Sync URL bar history when currentPage change, showing /admin or reverting to /
  useEffect(() => {
    const BASE_PATH = import.meta.env.BASE_URL || '/';
    const path = window.location.pathname;
    const hash = window.location.hash;
    const normalizedPath = path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) : path;

    if (currentPage === 'cms') {
      if (normalizedPath !== 'admin' && normalizedPath !== 'admin/' && normalizedPath !== '/admin' && normalizedPath !== '/admin/' && hash !== '#/admin' && hash !== '#admin' && hash !== '#/cms' && hash !== '#cms') {
        window.history.pushState({ page: 'cms' }, '', BASE_PATH + 'admin');
      }
    } else {
      if (normalizedPath === 'admin' || normalizedPath === 'admin/' || normalizedPath === '/admin' || normalizedPath === '/admin/') {
        window.history.pushState({ page: currentPage }, '', BASE_PATH);
      }
    }
  }, [currentPage]);

  // Handle Carousel timer of reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewCarouselIdx((prev) => (prev + 1) % allReviews.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [allReviews]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems(
      (() => {
        // Check if item already exists with matching defaults
        const prev = cartItems;
        const existingIdx = prev.findIndex((item) => item.product.id === product.id);
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + 1 };
          return updated;
        }
        return [
          ...prev,
          {
            product,
            quantity: 1,
            size: 'standard-unisex',
            personalizedCertification: false
          }
        ];
      })()
    );
    // Visual feedback trigger
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (idx: number, quantity: number) => {
    const updated = [...cartItems];
    updated[idx] = { ...updated[idx], quantity };
    setCartItems(updated);
  };

  const handleRemoveCartItem = (idx: number) => {
    setCartItems(cartItems.filter((_, i) => i !== idx));
  };

  const handleUpdateSize = (idx: number, size: CartItem['size']) => {
    const updated = [...cartItems];
    updated[idx] = { ...updated[idx], size };
    setCartItems(updated);
  };

  const handleUpdatePersonalization = (idx: number, val: boolean, details?: CartItem['birthDetails']) => {
    const updated = [...cartItems];
    updated[idx] = { ...updated[idx], personalizedCertification: val, birthDetails: details ?? updated[idx].birthDetails };
    setCartItems(updated);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewAuthor.trim() && newReviewText.trim()) {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        author: newReviewAuthor,
        rating: newReviewRating,
        text: newReviewText,
        date: 'Today',
        verifiedPurchase: true,
        productTitle: newReviewProduct,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newReviewAuthor)}&backgroundColor=d4af37&fontFamily=Inter`
      };
      setAllReviews((prev) => [newRev, ...prev]);
      setIsReviewModalOpen(false);
      setNewReviewAuthor('');
      setNewReviewText('');
      alert("✓ Manifestation Review posted successfully! Your voice now vibrates inside the e-commerce celestial grids.");
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactBirthDetails({ name: '', birthDate: '' });
    setContactQuery('');
  };

  // Safe navigation formatting
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(p);
  };

  // Shop item filters
  const filteredProducts = products.filter((p) => {
    if (shopCategory === 'all') return true;
    return p.category === shopCategory;
  }).sort((a, b) => {
    if (shopSort === 'rating') return b.rating - a.rating;
    if (shopSort === 'price-low') return a.salePrice - b.salePrice;
    return b.salePrice - a.salePrice;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col font-sans overflow-x-hidden selection:bg-[#C5A880]/30 selection:text-[#1C1917] antialiased">
      
      {/* Upper Header component */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cartItems.reduce((acc, c) => acc + c.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        brandName={websiteContent.brandName}
        brandSubtitle={websiteContent.brandSubtitle}
      />

      {/* Main Pages Router view */}
      <main className="flex-1 pt-[116px]">
        <AnimatePresence mode="wait">
          
          {/* PAGE: HOME */}
          {currentPage === 'home' && (
            <motion.div
              id="home-page-container"
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 md:space-y-24"
            >
              {/* Luxury Cinematic Hero section for Mobile view */}
              <section className="block sm:hidden relative w-full px-4 pt-6 select-none">
                <div className="relative rounded-3xl overflow-hidden min-h-[480px] bg-[#151313] shadow-xl flex items-center justify-center p-6">
                  
                  {/* Backdrop banner photo */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={HERO_IMAGE}
                      alt="Aura & Stone Sacred Space Banner"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.35]"
                    />
                  </div>

                  {/* Hero content details overlay */}
                  <div className="relative z-10 text-center max-w-3xl space-y-6 py-8">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full text-[9px] tracking-widest text-[#D4AF37] uppercase font-mono backdrop-blur-xs">
                      <Sparkles className="h-3.5 w-3.5 fill-current text-[#D4AF37]" />
                      <span>75 Years of Himalayan Lineage</span>
                    </div>

                    <h1 className="font-serif text-2xl font-light text-white tracking-[0.04em] leading-[1.2] uppercase px-2">
                      {websiteContent.heroHeadline} <br />
                      <span className="font-semibold text-[#D4AF37]">{websiteContent.heroHighlight}</span>
                    </h1>

                    <p className="text-xs text-[#EAE6DF]/85 font-sans leading-relaxed max-w-2xl mx-auto tracking-wide px-2">
                      {websiteContent.heroParagraph}
                    </p>

                    <div className="pt-4 flex flex-col gap-3 items-center justify-center w-full max-w-sm mx-auto px-4">
                      <button
                        id="hero-shop-trigger-mobile"
                        onClick={() => setCurrentPage('shop')}
                        className="cursor-pointer w-full bg-[#D4AF37] hover:bg-[#C5A880] active:scale-98 text-[#151313] font-bold px-8 py-4 text-xs font-mono tracking-widest uppercase rounded-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        Explore Curations
                      </button>
                      <button
                        id="hero-zodiac-trigger-mobile"
                        onClick={() => setCurrentPage('zodiac-calculator')}
                        className="cursor-pointer w-full bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/25 text-white font-semibold px-8 py-4 text-xs font-mono tracking-widest uppercase rounded-lg transition-all backdrop-blur-sm"
                      >
                        Diagnose Birth Chart
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Luxury Cinematic Hero section for Desktop and Tablet view */}
              <section className="hidden sm:block relative w-full bg-[#FAF8F5] py-12 md:py-20 lg:py-24 border-b border-[#EAE6DF]/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Column: Authentic Copywriting & CTA Buttons */}
                    <div className="space-y-6 lg:space-y-8 text-left select-none">
                      <div className="space-y-3">
                        <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C5A880] uppercase font-mono block font-medium">
                          SACRED GEOMETRY • COSMIC FREQUENCY
                        </span>
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-[#1C1917] leading-[1.15] tracking-[0.01em] uppercase">
                          {websiteContent.heroHeadline},<br />
                          <span className="font-normal text-[#C5A880]">{websiteContent.heroHighlight}</span>
                        </h1>
                      </div>
                      
                      <p className="text-sm sm:text-base text-[#5A554E] font-sans leading-relaxed max-w-xl">
                        {websiteContent.heroParagraph}
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row gap-4">
                        <button
                          id="hero-shop-trigger"
                          onClick={() => setCurrentPage('shop')}
                          className="cursor-pointer bg-[#1C1917] hover:bg-[#332F2B] active:scale-98 text-white font-mono text-[11px] font-semibold tracking-widest uppercase px-9 py-4 border border-[#1C1917] transition-all text-center rounded-none shadow-sm hover:shadow-md"
                        >
                          EXPLORE THE SHOP
                        </button>
                        <button
                          id="hero-zodiac-trigger"
                          onClick={() => setCurrentPage('zodiac-calculator')}
                          className="cursor-pointer bg-transparent hover:bg-[#1C1917]/5 active:scale-98 text-[#1C1917] font-mono text-[11px] font-semibold tracking-widest uppercase px-9 py-4 border border-[#1C1917] transition-all text-center rounded-none"
                        >
                          FIND YOUR ZODIAC CRYSTAL
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Premium Square Product Slideshow */}
                    <div className="flex flex-col items-center justify-center relative">
                      
                      {/* Square Image Container */}
                      <div className="relative z-10 w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px] aspect-square rounded-2xl overflow-hidden border border-[#E5E2DC] bg-[#FAF8F5] shadow-xl flex items-center justify-center group cursor-pointer">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full"
                          >
                            <img
                              src={slideshowImages[currentSlide].img}
                              alt={slideshowImages[currentSlide].name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover select-none"
                            />
                          </motion.div>
                        </AnimatePresence>

                        {/* Slide Indicator Text Bottom Badge - Visible on Hover */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#EAE6DF] shadow-md flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <span className="text-[9px] font-mono tracking-wider text-[#C5A880] uppercase font-bold">{slideshowImages[currentSlide].crystal}</span>
                          <span className="h-1 w-1 rounded-full bg-[#1C1917]/20"></span>
                          <span className="text-[10px] font-sans font-medium text-[#1C1917] whitespace-nowrap">{slideshowImages[currentSlide].name}</span>
                        </div>
                      </div>

                      {/* Square Slideshow Bullet Navigational Indicators */}
                      <div className="flex gap-2.5 justify-center mt-6 relative z-20">
                        {slideshowImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-[#1C1917] w-6' : 'bg-[#EAE6DF] hover:bg-[#857F75] w-2'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* Statistics & core values display */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-[#EAE6DF] pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-serif text-[#1C1917] font-semibold">15,000+</div>
                    <div className="text-[10px] font-mono tracking-wider uppercase text-[#857F75]">Aligned Bracelets Shipped</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-serif text-[#1C1917] font-semibold">99.7%</div>
                    <div className="text-[10px] font-mono tracking-wider uppercase text-[#857F75]">Manifestation Rating</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-serif text-[#1C1917] font-semibold">75+ Yrs</div>
                    <div className="text-[10px] font-mono tracking-wider uppercase text-[#857F75]">Astrological Heritage</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-serif text-[#1C1917] font-semibold">Grade A+</div>
                    <div className="text-[10px] font-mono tracking-wider uppercase text-[#857F75]">Certified Pure Geodes</div>
                  </div>
                </div>
              </section>

              {/* Celestial Pranayama Calm Guide Integration */}
              <PranayamaCalmGuide />

              {/* Key Bestsellers block */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[#EAE6DF] pb-5">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C5A880] block font-medium">
                      Highly Sought Alignments
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-light text-[#1C1917]">
                      The Master Signature Bestsellers
                    </h2>
                  </div>
                  <button
                    id="view-all-shop-bestsellers"
                    onClick={() => setCurrentPage('shop')}
                    className="cursor-pointer text-xs font-mono text-[#C5A880] hover:text-[#1C1917] border-b border-dashed border-[#C5A880] pb-0.5 uppercase tracking-widest"
                  >
                    View Entire Codex Curation →
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.filter((p) => p.isBestSeller).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onViewDetails={(p) => setSelectedProduct(p)}
                      onAddToCart={handleAddToCart}
                      isAdded={cartItems.some((item) => item.product.id === prod.id)}
                    />
                  ))}
                </div>
              </section>

              {/* Influencer Endorsement / Mridul Madhok Section */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="bg-[#151313] text-[#EAE6DF] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center border border-[#C5A880]/20">
                  <div className="md:col-span-5 aspect-[4/3] md:aspect-square relative">
                    <img
                      src={VEDIC_EXPERT_IMAGE}
                      alt="Professional Vedic Grooming Expert"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.8]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151313] to-transparent md:hidden" />
                  </div>

                  <div className="md:col-span-7 p-6 md:p-12 space-y-6 select-text">
                    <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em] uppercase block font-semibold leading-none">
                      Astrological Lifestyle Co-Design
                    </span>

                    <h3 className="font-serif text-2xl md:text-3xl font-light text-white tracking-wide">
                      Selected and Endorsed by <br />
                      <span className="text-[#D4AF37] font-normal">Mridul Madhok</span>
                    </h3>

                    <blockquote className="text-xs text-[#A39E96] italic leading-relaxed border-l border-[#D4AF37]/45 pl-4 py-1 font-sans text-left">
                      "{websiteContent.founderQuote}"
                    </blockquote>

                    <div className="flex gap-4">
                      <button
                        id="cta-zodiac-influence"
                        onClick={() => setCurrentPage('zodiac-calculator')}
                        className="cursor-pointer bg-[#D4AF37] hover:bg-[#C5A880] text-[#151313] font-bold px-6 py-3.5 text-xs font-mono tracking-widest uppercase rounded"
                      >
                        Find Your Alignment Match
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Consecration ritual visual timeline banner */}
              <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880] font-medium block">
                    The 3-Nights Purification Science
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#1C1917] font-light">
                    How Consecration Works
                  </h3>
                </div>

                {/* Horizontal flow chart */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  
                  {/* Item 1 */}
                  <div className="p-6 bg-[#FAF7F2] border border-[#EAE6DF] rounded-2xl relative space-y-3">
                    <div className="h-10 w-10 rounded-full bg-[#151313] text-[#D4AF37] font-mono text-xs font-semibold flex items-center justify-center mb-4">
                      01
                    </div>
                    <h4 className="font-serif text-base text-[#1C1917] font-semibold">
                      Liquid Hydration Cleanse
                    </h4>
                    <p className="text-xs text-[#857F75] leading-relaxed">
                      Crystals are washed in Panchamrut—raw honey, cow milk, and ancient Ganges coordinates—to strip residual trade static and human friction energies.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="p-6 bg-[#FAF7F2] border border-[#EAE6DF] rounded-2xl relative space-y-3">
                    <div className="h-10 w-10 rounded-full bg-[#151313] text-[#D4AF37] font-mono text-xs font-semibold flex items-center justify-center mb-4">
                      02
                    </div>
                    <h4 className="font-serif text-base text-[#1C1917] font-semibold">
                      Lunar Vibrational Bathing
                    </h4>
                    <p className="text-xs text-[#857F75] leading-relaxed">
                      Stones rest under moon bathing frequencies to align molecular lattices. In addition, 432Hz Sanskrit chants resonate corresponding planetary frequencies.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="p-6 bg-[#FAF7F2] border border-[#EAE6DF] rounded-2xl relative space-y-3">
                    <div className="h-10 w-10 rounded-full bg-[#151313] text-[#D4AF37] font-mono text-xs font-semibold flex items-center justify-center mb-4">
                      03
                    </div>
                    <h4 className="font-serif text-base text-[#1C1917] font-semibold">
                      Solar Rise Gilded Lock
                    </h4>
                    <p className="text-xs text-[#857F75] leading-relaxed">
                      The final sealing and solar warming locks auspicious material frequencies. We certificate each stone securely before airtight velvet shielding.
                    </p>
                  </div>

                </div>
              </section>

              {/* Dynamic Customer Testimonials & Reviews Carousel slider */}
              <section className="bg-[#FAF7F2] py-20 border-y border-[#EAE6DF] overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12 relative flex flex-col items-center">
                  
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880] block font-medium">
                      Vibrational Client Truths
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#1C1917] font-light">
                      Real Manifestations
                    </h3>
                  </div>

                  {/* Slider Card element */}
                  <div className="w-full max-w-3xl bg-[#FDFBF7] border border-[#EAE6DF] rounded-3xl p-6 md:p-10 shadow-sm relative min-h-[220px] flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={reviewCarouselIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4 select-text"
                      >
                        {/* stars */}
                        <div className="flex text-[#D4AF37] gap-0.5">
                          {Array.from({ length: allReviews[reviewCarouselIdx].rating }).map((_, i) => (
                            <Star key={i} className="h-4.5 w-4.5 fill-current text-[#D4AF37]" />
                          ))}
                        </div>

                        {/* review quote */}
                        <p className="text-sm md:text-base text-[#5E5950] font-sans italic leading-relaxed">
                          "{allReviews[reviewCarouselIdx].text}"
                        </p>

                        {/* reviewer bio details */}
                        <div className="flex items-center gap-3 pt-3 border-t border-[#EAE6DF]/60">
                          <img
                            src={allReviews[reviewCarouselIdx].avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=d4af37&fontFamily=Inter'}
                            alt={allReviews[reviewCarouselIdx].author}
                            className="h-9 w-9 rounded-full border border-[#EAE6DF]"
                          />
                          <div>
                            <span className="block text-xs font-serif text-[#1C1917] font-semibold">
                              {allReviews[reviewCarouselIdx].author}
                            </span>
                            <span className="block text-[9px] font-mono text-[#C5A880] uppercase tracking-wide">
                              Verified alignment for {allReviews[reviewCarouselIdx].productTitle}
                            </span>
                          </div>
                        </div>

                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons for carousel */}
                    <div className="flex gap-2.5 absolute bottom-6 right-6 md:bottom-10 md:right-10">
                      <button
                        id="prev-carousel-btn"
                        onClick={() => setReviewCarouselIdx((prev) => (prev - 1 + allReviews.length) % allReviews.length)}
                        className="cursor-pointer p-1.5 rounded-full border border-[#EAE6DF] bg-white hover:bg-[#FAF7F2] transition-colors"
                      >
                        <ChevronLeft className="h-4.5 w-4.5" />
                      </button>
                      <button
                        id="next-carousel-btn"
                        onClick={() => setReviewCarouselIdx((prev) => (prev + 1) % allReviews.length)}
                        className="cursor-pointer p-1.5 rounded-full border border-[#EAE6DF] bg-white hover:bg-[#FAF7F2] transition-colors"
                      >
                        <ChevronRight className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom trigger to post review */}
                  <button
                    id="trigger-add-review-modal"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="cursor-pointer text-xs font-mono text-[#C5A880] hover:text-[#1C1917] border-b border-dashed border-[#C5A880] pb-0.5 tracking-widest uppercase flex items-center gap-1 font-semibold"
                  >
                    <MessageSquarePlus className="h-4 w-4" /> Share Your Sacred Manifestation
                  </button>

                </div>
              </section>

              {/* Frequently Asked Questions FAQ section */}
              <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 select-text">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880] font-medium block">
                    Intellectual Clarifications
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#1C1917] font-light">
                    Frequently Answered Queries
                  </h3>
                </div>

                <div className="divide-y divide-[#EAE6DF] space-y-6">
                  
                  <div className="pt-6 space-y-2">
                    <h4 className="font-serif text-base text-[#1C1917] font-medium flex items-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-[#C5A880]" />
                      Do I wear the bracelets on my left or right wrist?
                    </h4>
                    <p className="text-xs text-[#857F75] leading-relaxed pl-6">
                      For receiving prosperity and career growth, wear the <strong className="text-[#1C1917]">Money Magnet on the left wrist</strong> (the intuitive receiving side of your nervous system). For repelling active envy, bad gaze (nazar), and workplace static, wear the <strong className="text-[#1C1917]">Evil Eye on the right wrist</strong> (the defensive projecting pathway).
                    </p>
                  </div>

                  <div className="pt-6 space-y-2">
                    <h4 className="font-serif text-base text-[#1C1917] font-medium flex items-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-[#C5A880]" />
                      How long does the 3-Nights Consecration last?
                    </h4>
                    <p className="text-xs text-[#857F75] leading-relaxed pl-6">
                      The acoustic mantras and lunar energy cells program the stones to peak alignment for <strong className="text-[#1C1917]">about 12 months</strong>. We highly recommend utilizing our interactive Vedic Charge Station on the portal to virtually "re-align" your crystals during peak cosmic alignments, like full-moon cycles, or shipping them back for manual planetary re-bathing.
                    </p>
                  </div>

                  <div className="pt-6 space-y-2">
                    <h4 className="font-serif text-base text-[#1C1917] font-medium flex items-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-[#C5A880]" />
                      How do I know the crystals are authentic and mineralogical?
                    </h4>
                    <p className="text-xs text-[#857F75] leading-relaxed pl-6">
                      We never use colored glass, lightweight plastic, synthetics, or acrylic beads. Every mineral geode is sourced directly from certified mines in Peru, Brazil, and Afghanistan, and physically tested for density, crystalline structure hardness (Mohs index), and origin integrity. We ship a signed Vedic Certificate verifying these coordinates in every box.
                    </p>
                  </div>

                </div>
              </section>

            </motion.div>
          )}

          {/* PAGE: SHOP */}
          {currentPage === 'shop' && (
            <motion.div
              id="shop-page-container"
              key="shop-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-sans space-y-12"
            >
              {/* shop header titles */}
              <div className="text-center max-w-md mx-auto space-y-2">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880] font-medium block">
                  Vedic Jewelry Storefront
                </span>
                <h2 className="font-serif text-3xl font-light text-[#1C1917]">Explore Gemstone Codex</h2>
              </div>

              {/* Filters workspace bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-6">
                
                {/* Category selectors */}
                <div className="flex flex-wrap gap-2 text-xs tracking-wider font-mono">
                  {(['all', 'bracelet', 'ring', 'combo'] as const).map((cat) => (
                    <button
                      id={`shop-category-btn-${cat}`}
                      key={cat}
                      type="button"
                      onClick={() => setShopCategory(cat)}
                      className={`cursor-pointer px-4 py-2 rounded-full border transition-colors ${
                        shopCategory === cat
                          ? 'border-[#151313] bg-[#151313] text-white'
                          : 'border-[#EAE6DF] bg-white text-[#857F75] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="capitalize">{cat}s</span>
                    </button>
                  ))}
                </div>

                {/* Sorting mechanism */}
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#857F75]">
                  <span>Filter Order:</span>
                  <select
                    id="shop-sort-list"
                    value={shopSort}
                    onChange={(e) => setShopSort(e.target.value as typeof shopSort)}
                    className="bg-transparent border border-[#EAE6DF] px-2 py-1.5 rounded text-[#1C1917] outline-none font-medium focus:border-[#C5A880]"
                  >
                    <option value="rating">Planetary Score (High Rating)</option>
                    <option value="price-low">Authorized Cost: Low to High</option>
                    <option value="price-high">Authorized Cost: High to Low</option>
                  </select>
                </div>

              </div>

              {/* Products Display Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-12">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onViewDetails={(p) => setSelectedProduct(p)}
                    onAddToCart={handleAddToCart}
                    isAdded={cartItems.some((item) => item.product.id === prod.id)}
                  />
                ))}
              </div>

            </motion.div>
          )}

          {/* PAGE: ZODIAC CALCULATOR */}
          {currentPage === 'zodiac-calculator' && (
            <motion.div
              id="zodiac-calculator-root"
              key="zodiac-calculator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ZodiacCalculator
                onViewProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                cartProducts={cartItems.map((c) => c.product.id)}
              />
            </motion.div>
          )}

          {/* PAGE: CHARGING RITUAL CHAMBER */}
          {currentPage === 'charging-station' && (
            <motion.div
              id="charging-station-root"
              key="charging-station"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChargingStation
                cartProducts={cartItems.map((c) => c.product)}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}

          {/* PAGE: ENCYCLOPEDIA */}
          {currentPage === 'encyclopedia' && (
            <motion.div
              id="encyclopedia-root"
              key="encyclopedia"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CrystalEncyclopedia />
            </motion.div>
          )}

          {/* PAGE: ABOUT & NATAL QUERIES FORM */}
          {currentPage === 'about' && (
            <motion.div
              id="about-page-container"
              key="about-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-sans space-y-16"
            >
              {/* Editorial About legacy section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 select-text">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880] block font-semibold leading-none">
                    75 Years of Astrological Lineage
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1C1917] tracking-wide leading-tight">
                    {websiteContent.historyHeadline}
                  </h2>
                  <p className="text-xs text-[#5E5950] leading-relaxed">
                    {websiteContent.historyParagraph1}
                  </p>
                  <p className="text-xs text-[#5E5950] leading-relaxed">
                    {websiteContent.historyParagraph2}
                  </p>
                </div>

                <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-[#EAE6DF] shadow-md">
                  <img
                    src={POLISHED_GEMSTONES_LOOM_IMAGE}
                    alt="Polished gemstones resting on organic hand loom"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Natal query astrology interface form */}
              <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE6DF] p-6 md:p-12 max-w-3xl mx-auto space-y-8 shadow-sm">
                <div className="space-y-1.5 text-center">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A880] uppercase font-semibold block">
                    Direct Astrologer Query Frame
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1C1917]">
                    Natal Coordinate Consultation
                  </h3>
                  <p className="text-xs text-[#857F75] leading-relaxed max-w-md mx-auto">
                    Struggling with unexplained career stagnation or persistent nazar blocks? File your planetary coordinates directly for a free baseline crystallization report from Chief Astrologer Shastry.
                  </p>
                </div>

                {contactSubmitted ? (
                  <div className="p-6 bg-[#E3EFE0] border border-[#2D5A27]/25 text-[#2E5A27] rounded-2xl text-center font-semibold text-xs tracking-wider space-y-2">
                    <Check className="h-6 w-6 text-emerald-700 mx-auto" />
                    <span>Natal Report coordinates registered! Our Astrologer requires 48 hours for precise astronomical alignment calculation.</span>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <BirthDetailsForm
                      value={contactBirthDetails}
                      onChange={setContactBirthDetails}
                      showName={true}
                    />

                    <div>
                      <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Your Astral hurdles / Natal query</label>
                      <textarea
                        id="natal-form-query"
                        required
                        rows={4}
                        value={contactQuery}
                        onChange={(e) => setContactQuery(e.target.value)}
                        placeholder="State your hurdles (e.g., stagnant retail business, continuous sleep anxiety, seeking alignment recommendations)"
                        className="w-full bg-white border border-[#EAE6DF] rounded-lg px-4 py-3 text-xs outline-none focus:border-[#C5A880] text-[#1C1917] font-medium resize-none"
                      />
                    </div>

                    <button
                      id="natal-submit-btn"
                      type="submit"
                      className="w-full cursor-pointer bg-[#151313] hover:bg-[#322D2C] text-white py-3.5 rounded-lg text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5"
                    >
                      <Send className="h-4 w-4 text-[#D4AF37]" /> Submit Natal Grid coordinates
                    </button>
                  </form>
                )}
              </div>

            </motion.div>
          )}
          
          {/* PAGE: CMS WORKSPACE PORTAL */}
          {currentPage === 'cms' && (
            <motion.div
              id="cms-root-view"
              key="cms-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BusinessOperationsCMS 
                onDataChange={fetchDynamicData}
                currentProducts={products}
              />
            </motion.div>
          )}

          {/* PAGE: SECURE CHECKOUT */}
          {currentPage === 'checkout' && (
            <motion.div
              id="checkout-root-view"
              key="checkout-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckoutView
                cartItems={cartItems}
                onGoBack={() => setCurrentPage('home')}
                onClearCart={() => setCartItems([])}
                onAddReviewToggle={() => {
                  setCurrentPage('home');
                  setIsReviewModalOpen(true);
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer view */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* Slide-out Cart Drawer details */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onUpdateSize={handleUpdateSize}
        onUpdatePersonalization={handleUpdatePersonalization}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentPage('checkout');
        }}
      />

      {/* POPUP MODAL: Interactive product details sheet */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal worksheet */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-4 md:inset-x-auto md:inset-y-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-[#FDFBF7] rounded-3xl border border-[#EAE6DF] p-6 max-w-3xl w-full md:max-h-[85vh] overflow-y-auto flex flex-col md:flex-row gap-8 shadow-2xl select-text"
            >
              {/* Product Close Button */}
              <button
                id="close-product-modal-btn"
                onClick={() => setSelectedProduct(null)}
                className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-[#FAF7F2] text-[#857F75] hover:text-[#1C1917] transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Column: Image and crystal list */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="aspect-square bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EAE6DF]">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* specifications table list */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE6DF]/60 space-y-2 font-mono text-[10px] text-[#5E5950]">
                  <span className="block font-bold tracking-widest text-[#C5A880] uppercase mb-1">
                    Cosmic Integrity specifications:
                  </span>
                  <div className="flex justify-between border-b border-[#EAE6DF]/45 pb-1">
                    <span>STRUCTURE:</span>
                    <strong className="text-[#1C1917]">{selectedProduct.specifications.beadSize}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#EAE6DF]/45 pb-1">
                    <span>QUANTITY OF CHIPS:</span>
                    <strong className="text-[#1C1917]">{selectedProduct.specifications.beadCount || 24} pieces</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#EAE6DF]/45 pb-1">
                    <span>Vedic Charge Time:</span>
                    <strong className="text-[#1C1917]">{selectedProduct.specifications.chargeTime}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>GEOLOGICAL SOURCE:</span>
                    <strong className="text-[#1C1917] truncate max-w-[130px]">{selectedProduct.specifications.origin}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Details */}
              <div className="w-full md:w-1/2 space-y-5 flex flex-col justify-between">
                <div className="space-y-4 pt-4 md:pt-0">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest block font-semibold leading-none">
                      Active Astrological Alignment
                    </span>
                    <h3 className="font-serif text-xl tracking-wide text-[#1C1917]">
                      {selectedProduct.name}
                    </h3>
                  </div>

                  {/* price tag */}
                  <div className="flex items-baseline gap-2.5 font-mono text-[11px]">
                    <span className="text-base font-bold text-[#1C1917]">{formatPrice(selectedProduct.salePrice)}</span>
                    <span className="text-[#A39E96] line-through">{formatPrice(selectedProduct.originalPrice)}</span>
                    <span className="text-emerald-700 tracking-normal font-semibold font-sans uppercase">Cleansing Included</span>
                  </div>

                  <p className="text-xs text-[#5E5950] leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* dynamic benefits list */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#857F75] block font-semibold">
                      Thermodynamic & Mind Benefits:
                    </span>
                    <div className="space-y-2.5">
                      {selectedProduct.benefits.map((bene, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-xs text-[#5E5950] leading-snug">
                          <Check className="h-4 w-4 text-[#C5A880] shrink-0 mt-0.5" />
                          <span>{bene}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add to action sheet */}
                <div className="flex gap-4 pt-6 mt-6 border-t border-[#EAE6DF] items-center justify-between">
                  <div>
                    <span className="block text-[8px] font-mono uppercase text-[#857F75]">Vedic Stock status:</span>
                    <span className="text-[11px] font-sans font-bold text-emerald-800 uppercase flex items-center gap-1">
                      ● Active Sanctification Flow
                    </span>
                  </div>

                  <button
                    id="add-from-modal-trigger"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="cursor-pointer bg-[#151313] hover:bg-[#322D2C] text-white px-6 py-3.5 text-xs font-mono tracking-widest uppercase font-semibold rounded-lg"
                  >
                    Seal inside Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* POPUP MODAL: Submitting custom Manifestation review */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Review form modal box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-4 md:inset-x-auto md:inset-y-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-[#FDFBF7] rounded-3xl border border-[#EAE6DF] p-6 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close reviews */}
              <button
                id="close-review-modal-btn"
                onClick={() => setIsReviewModalOpen(false)}
                className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-[#FAF7F2] text-[#857F75] hover:text-[#1C1917] transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              <form onSubmit={handleAddReview} className="space-y-5 select-text pt-4">
                <div className="space-y-1 text-center">
                  <span className="text-[9px] font-mono tracking-widest text-[#C5A880] uppercase block">
                    Vibrational Contribution
                  </span>
                  <h3 className="font-serif text-xl font-light text-[#1C1917]">
                    Share Your Manifestation
                  </h3>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Your Chosen Name</label>
                  <input
                    id="new-review-author-input"
                    type="text"
                    required
                    placeholder="e.g. Priyan Sharma"
                    value={newReviewAuthor}
                    onChange={(e) => {
                      setNewReviewAuthor(e.target.value);
                    }}
                    className="w-full bg-[#FAF7F2] border border-[#EAE6DF] rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#C5A880] text-[#1C1917] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1.5 font-semibold">Select Consecrated Product</label>
                  <select
                    id="new-review-product-select"
                    value={newReviewProduct}
                    onChange={(e) => setNewReviewProduct(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE6DF] rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#C5A880] text-[#1C1917] font-medium"
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.name}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1.5 font-semibold">Resonant Alignment rating stars:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        id={`review-rate-star-${starVal}`}
                        key={starVal}
                        type="button"
                        onClick={() => setNewReviewRating(starVal)}
                        className="cursor-pointer p-1 text-[#D4AF37]"
                      >
                        <Star className={`h-6 w-6 stroke-1.25 ${starVal <= newReviewRating ? 'fill-current' : 'opacity-25'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">Manifestation story Text</label>
                  <textarea
                    id="new-review-text-input"
                    required
                    rows={4}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="What material or spiritual differences did you feel after consecrating this stone? (e.g. stuck payouts cleared, calming deep sleep cycles reached)"
                    className="w-full bg-[#FAF7F2] border border-[#EAE6DF] rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#C5A880] text-[#1C1917] font-medium resize-none leading-relaxed"
                  />
                </div>

                <button
                  id="submit-review-draft"
                  type="submit"
                  className="w-full cursor-pointer bg-[#151313] hover:bg-[#322D2C] text-white py-3.5 rounded-lg text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5"
                >
                  <Send className="h-4 w-4 text-[#D4AF37]" /> Solder and Broadcast Manifestation
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
