import { motion } from 'motion/react';

import CartDrawer from '../components/CartDrawer';
import CheckoutView from '../components/CheckoutView';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';
import { useNavigationStore } from '../store/navigationStore';
import { useUIStore } from '../store/uiStore';

export default function CheckoutPage() {
  const { items: cartItems, clearCart } = useCartStore();
  const { isCartOpen, openCart, closeCart, openReviewModal } = useUIStore();
  const { currentPage, setCurrentPage } = useNavigationStore();

  return (
    <motion.div
      id="checkout-root-view"
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
      <CheckoutView
        cartItems={cartItems}
        onGoBack={() => setCurrentPage('home')}
        onClearCart={clearCart}
        onAddReviewToggle={() => {
          setCurrentPage('home');
          openReviewModal();
        }}
      />
      <Footer setCurrentPage={setCurrentPage} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
        onUpdateSize={() => {}}
        onUpdatePersonalization={() => {}}
        onCheckout={() => {}}
      />
    </motion.div>
  );
}
