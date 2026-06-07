import { Check, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, FormEvent, useCallback } from 'react';

import { BirthDetailsForm } from '../components/astro/BirthDetailsForm';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useWebsiteContent } from '../hooks';
import { useCartStore } from '../store/cartStore';
import { useNavigationStore } from '../store/navigationStore';
import { useUIStore } from '../store/uiStore';
import { BirthDetails, WebsiteContent } from '../types';

export default function AboutPage() {
  const {
    items: cartItems,
    removeItem,
    updateQuantity,
    updateSize,
    updatePersonalization,
    getTotalItems,
  } = useCartStore();
  const { isCartOpen, openCart, closeCart } = useUIStore();
  const { currentPage, setCurrentPage } = useNavigationStore();
  const { data: contentData } = useWebsiteContent();

  const websiteContent =
    contentData ||
    ({
      historyHeadline: 'Ancient Sceptred Science Met Minimalist Form',
      historyParagraph1:
        'Aura & Stone was pioneered in the foothills of Jammu, Kashmir, with a deep, uncompromising mission: to de-mystify ancient Indian gemologies and elevate them to modern standards of luxury, precision, and physical authenticity. Led by three generations of Astro-scholars, we isolate specific minerals (such as green aventurine or Uruguayan amethyst clusters) that possess corresponding atomic frequencies to planetary transit nodes.',
      historyParagraph2:
        'By merging deep Vedic practices with laboratory testing (refractive indexes, geological hardness, chemical matrix formulas), we construct exquisite jewelry talismans that serve as protective and prosperous energy shields for daily corporate movers.',
    } as WebsiteContent);

  const [contactBirthDetails, setContactBirthDetails] = useState<BirthDetails>({
    name: '',
    birthDate: '',
  });
  const [contactQuery, setContactQuery] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactBirthDetails({ name: '', birthDate: '' });
    setContactQuery('');
  }, []);

  return (
    <motion.div
      id="about-page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-sans space-y-16"
    >
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={getTotalItems()}
        onOpenCart={openCart}
        brandName="Aura & Stone"
        brandSubtitle="Crystalline Astrology"
      />
      <main className="flex-1 pt-[116px]">
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
              src="/src/assets/images/polished_gemstones_loom_1779999095722.png"
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
              Struggling with unexplained career stagnation or persistent nazar blocks? File your
              planetary coordinates directly for a free baseline crystallization report from Chief
              Astrologer Shastry.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 bg-[#E3EFE0] border border-[#2D5A27]/25 text-[#2E5A27] rounded-2xl text-center font-semibold text-xs tracking-wider space-y-2">
              <Check className="h-6 w-6 text-emerald-700 mx-auto" />
              <span>
                Natal Report coordinates registered! Our Astrologer requires 48 hours for precise
                astronomical alignment calculation.
              </span>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <BirthDetailsForm
                value={contactBirthDetails}
                onChange={setContactBirthDetails}
                showName={true}
              />

              <div>
                <label className="block text-[8px] font-mono uppercase text-[#857F75] mb-1 font-semibold">
                  Your Astral hurdles / Natal query
                </label>
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
