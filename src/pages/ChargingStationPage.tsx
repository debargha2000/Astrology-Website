import { motion } from 'motion/react';

import CartDrawer from '../components/CartDrawer';
import ChargingStation from '../components/ChargingStation';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';
import { useNavigationStore } from '../store/navigationStore';
import { useUIStore } from '../store/uiStore';
import { Product } from '../types';

export default function ChargingStationPage() {
  const { items: cartItems } = useCartStore();
  const { isCartOpen, openCart, closeCart } = useUIStore();
  const { currentPage, setCurrentPage } = useNavigationStore();

  const handleAddToCart = (_product: Product) => {
    openCart();
  };

  return (
    <motion.div
      id="charging-station-root"
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
      <ChargingStation
        cartProducts={cartItems.map((c) => c.product)}
        onAddToCart={handleAddToCart}
      />
      <Footer setCurrentPage={setCurrentPage} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={(_idx, _q) => {}}
        onRemoveItem={(_idx) => {}}
        onUpdateSize={(_idx, _s) => {}}
        onUpdatePersonalization={(_idx, _val, _details) => {}}
        onCheckout={() => setCurrentPage('checkout')}
      />
    </motion.div>
  );
}
