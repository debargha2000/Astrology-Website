import { useState, useCallback } from 'react';

import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks';
import { useCartStore } from '../store/cartStore';
import { useNavigationStore } from '../store/navigationStore';
import { useUIStore } from '../store/uiStore';
import { Product } from '../types';

export default function ShopPage() {
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
  const { data: products = [] } = useProducts();

  const [shopCategory, setShopCategory] = useState<'all' | 'bracelet' | 'ring' | 'combo'>('all');
  const [shopSort, setShopSort] = useState<'rating' | 'price-low' | 'price-high'>('rating');

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product);
      openCart();
    },
    [addItem, openCart]
  );

  const filteredProducts = products
    .filter((p) => (shopCategory === 'all' ? true : p.category === shopCategory))
    .sort((a, b) => {
      if (shopSort === 'rating') return b.rating - a.rating;
      if (shopSort === 'price-low') return a.salePrice - b.salePrice;
      return b.salePrice - a.salePrice;
    });

  const getTotalItems = () => cartItems.reduce((acc, c) => acc + c.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col font-sans overflow-x-hidden">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={getTotalItems()}
        onOpenCart={openCart}
        brandName="Aura & Stone"
        brandSubtitle="Crystalline Astrology"
      />
      <main className="flex-1 pt-[116px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-sans space-y-12">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A880] font-medium block">
              Vedic Jewelry Storefront
            </span>
            <h2 className="font-serif text-3xl font-light text-[#1C1917]">
              Explore Gemstone Codex
            </h2>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-12">
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
    </div>
  );
}
