import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  MessageSquarePlus,
  Sparkles,
  Star,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PranayamaCalmGuide from '../components/PranayamaCalmGuide';
import ProductCard from '../components/ProductCard';
import {
  CONSECRATION_STEPS,
  FAQ_ITEMS,
  HERO_SLIDES,
  REVIEW_CAROUSEL_INTERVAL_MS,
  SLIDESHOW_INTERVAL_MS,
  STATISTICS,
} from '../constants/content';
import { REVIEWS, VEDIC_EXPERT_IMAGE } from '../data';
import { useProducts, useWebsiteContent } from '../hooks';
import { useCartStore } from '../store/cartStore';
import { useNavigationStore } from '../store/navigationStore';
import { useUIStore } from '../store/uiStore';
import { Product } from '../types';

export default function HomePage() {
  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    updateSize,
    updatePersonalization,
  } = useCartStore();
  const { isCartOpen, openCart, closeCart, setSelectedProduct } = useUIStore();
  const { currentPage, setCurrentPage } = useNavigationStore();
  const { data: productsData } = useProducts();
  const { data: contentData } = useWebsiteContent();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  // Hero slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDESHOW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // Reviews carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % REVIEWS.length);
    }, REVIEW_CAROUSEL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const products = productsData || [];
  const websiteContent = contentData || {
    brandName: 'Aura & Stone',
    brandSubtitle: 'Crystalline Astrology',
    heroHeadline: 'The Indian',
    heroHighlight: 'Science of Signs',
    heroParagraph:
      'Fine crystal jewelry engineered from verified planetary minerals. Cleansed, moon bathed, and programmed to your birth chart parameters to create an unshakeable energetic shield.',
    founderQuote:
      'In today\u2019s fast-paced corporate and creative grids, we are continuously bombarded by negative gazes, digital noise, and heavy financial doubt. Aura & Stone was co-conceived because I wanted authentic, laboratory-tested crystal jewelry that looks incredibly sharp and high-fashion while offering robust spiritual protection. We took 75 years of my family\u2019s ancestral alignment wisdom and made it sleek, minimalistic, and absolute.',
    founderQuoteSubtitle: 'Co-Founder & Chief Vedic Architect, Aura & Stone',
    historyHeadline: 'Ancient Sceptred Science Met Minimalist Form',
    historyParagraph1: '',
    historyParagraph2: '',
    bannerImage: '',
  };

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product);
      openCart();
    },
    [addItem, openCart]
  );

  const filteredProducts = products.filter((p) => p.isBestSeller).slice(0, 3);
  const getTotalItems = () => cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const currentReview = REVIEWS[reviewIndex];

  return (
    <motion.div
      className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col font-sans overflow-x-hidden selection:bg-[#C5A880]/30 selection:text-[#1C1917] antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={getTotalItems()}
        onOpenCart={openCart}
        brandName={websiteContent.brandName}
        brandSubtitle={websiteContent.brandSubtitle}
      />
      <main className="flex-1 pt-[116px]">
        <div id="home-page-container" className="space-y-16 md:space-y-24">
          {/* ═══════════════════════════════════════════════════
              SECTION 1A: MOBILE HERO (shown on small screens)
          ═══════════════════════════════════════════════════ */}
          <section className="block sm:hidden relative w-full px-4 pt-6 select-none">
            <div className="relative rounded-3xl overflow-hidden min-h-[480px] bg-[#151313] shadow-xl flex items-center justify-center p-6">
              <div className="absolute inset-0 z-0">
                <img
                  src="/src/assets/images/aura_stone_hero_banner_1779793774735.png"
                  alt="Aura & Stone Sacred Space Banner"
                  className="w-full h-full object-cover filter brightness-[0.35]"
                />
              </div>
              <div className="relative z-10 text-center max-w-3xl space-y-6 py-8">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full text-[9px] tracking-widest text-[#D4AF37] uppercase font-mono backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5 fill-current text-[#D4AF37]" />
                  <span>75 Years of Himalayan Lineage</span>
                </div>
                <h1 className="font-serif text-2xl font-light text-white tracking-[0.04em] leading-[1.2] uppercase px-2">
                  {websiteContent.heroHeadline} <br />
                  <span className="font-semibold text-[#D4AF37]">
                    {websiteContent.heroHighlight}
                  </span>
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

          {/* ═══════════════════════════════════════════════════
              SECTION 1B: DESKTOP HERO (hidden on mobile)
          ═══════════════════════════════════════════════════ */}
          <section className="hidden sm:block relative w-full bg-[#FAF8F5] py-12 md:py-20 lg:py-24 border-b border-[#EAE6DF]/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Copy */}
                <div className="space-y-6 lg:space-y-8 text-left select-none">
                  <div className="space-y-3">
                    <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C5A880] uppercase font-mono block font-medium">
                      SACRED GEOMETRY • COSMIC FREQUENCY
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-[#1C1917] leading-[1.15] tracking-[0.01em] uppercase">
                      {websiteContent.heroHeadline},<br />
                      <span className="font-normal text-[#C5A880]">
                        {websiteContent.heroHighlight}
                      </span>
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

                {/* Right: Image Carousel */}
                <div className="flex flex-col items-center justify-center relative">
                  <div className="relative z-10 w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px] aspect-square rounded-2xl overflow-hidden border border-[#E5E2DC] bg-[#FAF8F5] shadow-xl flex items-center justify-center group cursor-pointer">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        className="absolute inset-0 w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={HERO_SLIDES[currentSlide]?.img}
                          alt={HERO_SLIDES[currentSlide]?.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none"
                        />
                      </motion.div>
                    </AnimatePresence>
                    {/* Hover label */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#EAE6DF] shadow-md flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="text-[9px] font-mono tracking-wider text-[#C5A880] uppercase font-bold">
                        {HERO_SLIDES[currentSlide]?.crystal}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#1C1917]/20" />
                      <span className="text-[10px] font-sans font-medium text-[#1C1917] whitespace-nowrap">
                        {HERO_SLIDES[currentSlide]?.name}
                      </span>
                    </div>
                  </div>
                  {/* Dots */}
                  <div className="flex gap-2.5 justify-center mt-6 relative z-20">
                    {HERO_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          currentSlide === idx
                            ? 'bg-[#1C1917] w-6'
                            : 'bg-[#EAE6DF] hover:bg-[#857F75] w-2'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              SECTION 2: STATS ROW
          ═══════════════════════════════════════════════════ */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-[#EAE6DF] pb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATISTICS.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-2xl md:text-3xl font-serif text-[#1C1917] font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-[#857F75]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              SECTION 3: PRANAYAMA CALM GUIDE
          ═══════════════════════════════════════════════════ */}
          <PranayamaCalmGuide />

          {/* ═══════════════════════════════════════════════════
              SECTION 4: BESTSELLERS
          ═══════════════════════════════════════════════════ */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onViewDetails={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  isAdded={cartItems.some((item) => item.product.id === prod.id)}
                />
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              SECTION 5: MRIDUL MADHOK QUOTE
          ═══════════════════════════════════════════════════ */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 select-none">
            <div className="bg-[#151313] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center border border-[#C5A880]/20">
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
                  &ldquo;{websiteContent.founderQuote}&rdquo;
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

          {/* ═══════════════════════════════════════════════════
              SECTION 6: CONSECRATION STEPS
          ═══════════════════════════════════════════════════ */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880] font-medium block">
                The 3-Nights Purification Science
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-[#1C1917] font-light">
                How Consecration Works
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {CONSECRATION_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="p-6 bg-[#FAF7F2] border border-[#EAE6DF] rounded-2xl relative space-y-3"
                >
                  <div className="h-10 w-10 rounded-full bg-[#151313] text-[#D4AF37] font-mono text-xs font-semibold flex items-center justify-center mb-4">
                    {step.number}
                  </div>
                  <h4 className="font-serif text-base text-[#1C1917] font-semibold">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#857F75] leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              SECTION 7: REAL MANIFESTATIONS (REVIEWS CAROUSEL)
          ═══════════════════════════════════════════════════ */}
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

              <div className="w-full max-w-3xl bg-[#FDFBF7] border border-[#EAE6DF] rounded-3xl p-6 md:p-10 shadow-sm relative min-h-[220px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reviewIndex}
                    className="space-y-4 select-text"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Stars */}
                    <div className="flex text-[#D4AF37] gap-0.5">
                      {Array.from({ length: currentReview?.rating || 0 }).map((_, i) => (
                        <Star key={i} className="h-4.5 w-4.5 fill-current text-[#D4AF37]" />
                      ))}
                    </div>
                    {/* Review Text */}
                    <p className="text-sm md:text-base text-[#5E5950] font-sans italic leading-relaxed">
                      &ldquo;{currentReview?.text}&rdquo;
                    </p>
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-3 border-t border-[#EAE6DF]/60">
                      <img
                        src={currentReview?.avatarUrl}
                        alt={currentReview?.author}
                        className="h-9 w-9 rounded-full border border-[#EAE6DF]"
                      />
                      <div>
                        <span className="block text-xs font-serif text-[#1C1917] font-semibold">
                          {currentReview?.author}
                        </span>
                        <span className="block text-[9px] font-mono text-[#C5A880] uppercase tracking-wide">
                          Verified alignment for {currentReview?.productTitle}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-2.5 absolute bottom-6 right-6 md:bottom-10 md:right-10">
                  <button
                    id="prev-carousel-btn"
                    onClick={() =>
                      setReviewIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)
                    }
                    className="cursor-pointer p-1.5 rounded-full border border-[#EAE6DF] bg-white hover:bg-[#FAF7F2] transition-colors"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <button
                    id="next-carousel-btn"
                    onClick={() => setReviewIndex((prev) => (prev + 1) % REVIEWS.length)}
                    className="cursor-pointer p-1.5 rounded-full border border-[#EAE6DF] bg-white hover:bg-[#FAF7F2] transition-colors"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              <button
                id="trigger-add-review-modal"
                className="cursor-pointer text-xs font-mono text-[#C5A880] hover:text-[#1C1917] border-b border-dashed border-[#C5A880] pb-0.5 tracking-widest uppercase flex items-center gap-1 font-semibold"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Share Your Sacred Manifestation
              </button>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              SECTION 8: FAQ
          ═══════════════════════════════════════════════════ */}
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
              {FAQ_ITEMS.map((faq) => (
                <div key={faq.question} className="pt-6 space-y-2">
                  <h4 className="font-serif text-base text-[#1C1917] font-medium flex items-center gap-2">
                    <CircleHelp className="h-4.5 w-4.5 text-[#C5A880]" />
                    {faq.question}
                  </h4>
                  <p
                    className="text-xs text-[#857F75] leading-relaxed pl-6"
                    dangerouslySetInnerHTML={{
                      __html: faq.answer
                        .replace(
                          /Money Magnet on the left wrist/g,
                          '<strong class="text-[#1C1917]">Money Magnet on the left wrist</strong>'
                        )
                        .replace(
                          /Evil Eye on the right wrist/g,
                          '<strong class="text-[#1C1917]">Evil Eye on the right wrist</strong>'
                        )
                        .replace(
                          /about 12 months/g,
                          '<strong class="text-[#1C1917]">about 12 months</strong>'
                        ),
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer setCurrentPage={setCurrentPage} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onUpdateSize={updateSize}
        onUpdatePersonalization={updatePersonalization}
        onCheckout={() => setCurrentPage('checkout')}
      />
    </motion.div>
  );
}
