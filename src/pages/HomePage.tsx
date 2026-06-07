import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCallback, useState, useEffect } from 'react';

import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { HERO_SLIDES, SLIDESHOW_INTERVAL_MS } from '../constants/content';
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDESHOW_INTERVAL_MS);
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
    historyParagraph1:
      'Aura & Stone was pioneered in the foothills of Jammu, Kashmir, with a deep, uncompromising mission: to de-mystify ancient Indian gemologies and elevate them to modern standards of luxury, precision, and physical authenticity. Led by three generations of Astro-scholars, we isolate specific minerals (such as green aventurine or Uruguayan amethyst clusters) that possess corresponding atomic frequencies to planetary transit nodes.',
    historyParagraph2:
      'By merging deep Vedic practices with laboratory testing (refractive indexes, geological hardness, chemical matrix formulas), we construct exquisite jewelry talismans that serve as protective and prosperous energy shields for daily corporate movers.',
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
        <div className="space-y-16 md:space-y-24">
          {/* Hero Section */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
                    Vedic Planetary Minerals
                  </span>
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1917] tracking-[0.04em] leading-[1.15] uppercase">
                    {websiteContent.heroHeadline} <br />
                    <span className="font-normal text-[#C5A880]">
                      {websiteContent.heroHighlight}
                    </span>
                  </h1>
                </div>
                <p className="text-sm md:text-base text-[#5E5950] font-sans leading-relaxed tracking-wide max-w-xl">
                  {websiteContent.heroParagraph}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => setCurrentPage('shop')}
                    className="cursor-pointer bg-[#1C1917] hover:bg-[#332F2B] text-white font-mono text-[11px] font-semibold tracking-widest uppercase px-9 py-4 border border-[#1C1917] transition-all text-center rounded-none shadow-sm hover:shadow-md"
                  >
                    EXPLORE THE SHOP
                  </button>
                  <button
                    onClick={() => setCurrentPage('zodiac-calculator')}
                    className="cursor-pointer bg-transparent hover:bg-[#1C1917]/5 text-[#1C1917] font-mono text-[11px] font-semibold tracking-widest uppercase px-9 py-4 border border-[#1C1917] transition-all text-center rounded-none"
                  >
                    FIND YOUR ZODIAC CRYSTAL
                  </button>
                </div>
              </div>

              {/* Right Column: Premium Glassmorphic Carousel */}
              <div className="lg:col-span-5 w-full flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] max-w-[380px] bg-[#FAF9F6]/60 backdrop-blur-md border border-[#EAE6DF]/60 p-4 rounded-3xl shadow-xl flex flex-col justify-between overflow-hidden group">
                  {/* Image Slideshow Frame */}
                  <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-[#F5F2EB]/50 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentSlide}
                        src={HERO_SLIDES[currentSlide]?.img ?? ''}
                        alt={HERO_SLIDES[currentSlide]?.name ?? ''}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="w-full h-full object-cover select-none"
                      />
                    </AnimatePresence>

                    {/* Left/Right Manual Controls */}
                    <button
                      onClick={() =>
                        setCurrentSlide(
                          (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                        )
                      }
                      className="absolute left-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#EAE6DF]/60 hover:bg-white text-[#1C1917] transition-colors shadow-md opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                      className="absolute right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#EAE6DF]/60 hover:bg-white text-[#1C1917] transition-colors shadow-md opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Slide details */}
                  <div className="pt-4 px-1 space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-serif text-sm tracking-wide text-[#1C1917] font-medium block">
                        {HERO_SLIDES[currentSlide]?.name ?? ''}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#C5A880]">
                        {HERO_SLIDES[currentSlide]?.price ?? ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#857F75] uppercase tracking-wider">
                      <span>Crystal: {HERO_SLIDES[currentSlide]?.crystal ?? ''}</span>
                      <button
                        onClick={() => {
                          const slideName = HERO_SLIDES[currentSlide]?.name?.toLowerCase() ?? '';
                          let prodId = 'money-magnet';
                          if (slideName.includes('nazar') || slideName.includes('evil'))
                            prodId = 'evil-eye';
                          else if (slideName.includes('healer') || slideName.includes('combo'))
                            prodId = 'super-combo';
                          else if (slideName.includes('stress') || slideName.includes('amethyst'))
                            prodId = 'stress-killer';
                          else if (slideName.includes('harmony') || slideName.includes('rose'))
                            prodId = 'love-harmony';

                          const prod = products.find((p) => p.id === prodId);
                          if (prod) {
                            handleAddToCart(prod);
                          } else {
                            setCurrentPage('shop');
                          }
                        }}
                        className="cursor-pointer text-[#C5A880] hover:text-[#1C1917] font-bold border-b border-dashed border-[#C5A880] pb-0.5"
                      >
                        ACQUIRE NOW →
                      </button>
                    </div>
                  </div>

                  {/* Indicator Dots */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {HERO_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentSlide === idx
                            ? 'w-5 bg-[#C5A880]'
                            : 'w-1.5 bg-white/70 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bestsellers */}
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
