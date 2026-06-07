import { motion } from 'motion/react';

import CartDrawer from '../components/CartDrawer';
import CrystalEncyclopedia from '../components/CrystalEncyclopedia';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';
import { useNavigationStore } from '../store/navigationStore';
import { useUIStore } from '../store/uiStore';

export default function EncyclopediaPage() {
  const { items: cartItems } = useCartStore();
  const { isCartOpen, openCart, closeCart } = useUIStore();
  const { currentPage, setCurrentPage } = useNavigationStore();

  return (
    <motion.div
      id="encyclopedia-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cartItems.reduce((acc, c) => acc + c.quantity, 0)}
        onOpenCart={openCart}
        brandName="Aura & Stone"
        brandSubtitle="Crystalline Astrology"
      />
      <CrystalEncyclopedia />
      <Footer setCurrentPage={setCurrentPage} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
        onUpdateSize={() => {}}
        onUpdatePersonalization={() => {}}
        onCheckout={() => setCurrentPage('checkout')}
      />
    </motion.div>
  );
}
