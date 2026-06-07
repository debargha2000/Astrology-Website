/// <reference types="vitest/globals" />
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { Product } from '../types';

import ProductCard from './ProductCard';

const mockAddToCart = vi.fn();
const mockSetSelectedProduct = vi.fn();

vi.mock('../store/cartStore', () => ({
  useCartStore: () => ({
    cartItems: [],
    addItem: mockAddToCart,
  }),
}));

vi.mock('../store/uiStore', () => ({
  useUIStore: () => ({
    setSelectedProduct: mockSetSelectedProduct,
  }),
}));

const mockProduct: Product = {
  id: 'test-1',
  name: 'Test Product',
  originalPrice: 1000,
  salePrice: 800,
  rating: 4.5,
  reviewsCount: 100,
  description: 'Test description',
  shortDescription: 'Short description',
  benefits: ['Benefit 1', 'Benefit 2'],
  crystalsUsed: ['Crystal 1', 'Crystal 2'],
  imageUrl: 'https://example.com/image.jpg',
  videoUrl: 'https://example.com/video.mp4',
  category: 'bracelet',
  stockStatus: 'in-stock',
  zodiacConnection: ['Aries', 'Leo'],
  isBestSeller: true,
  specifications: {
    beadSize: '8mm',
    beadCount: 20,
    threadMaterial: 'Elastic',
    origin: 'India',
    chargeTime: '3 Nights',
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product name and price', () => {
    render(
      <ProductCard
        product={mockProduct}
        onViewDetails={vi.fn()}
        onAddToCart={vi.fn()}
        isAdded={false}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₹800')).toBeInTheDocument();
    expect(screen.getByText('₹1,000')).toBeInTheDocument();
  });

  it('shows add to cart button when not added', () => {
    render(
      <ProductCard
        product={mockProduct}
        onViewDetails={vi.fn()}
        onAddToCart={vi.fn()}
        isAdded={false}
      />,
      { wrapper: createWrapper() }
    );

    const addButton = screen.getByText(/Quick Consecrate/i);
    expect(addButton).toBeInTheDocument();
  });

  it('shows added state when product is in cart', () => {
    render(
      <ProductCard
        product={mockProduct}
        onViewDetails={vi.fn()}
        onAddToCart={vi.fn()}
        isAdded={true}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/Added/i)).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const handleAddToCart = vi.fn();

    render(
      <ProductCard
        product={mockProduct}
        onViewDetails={vi.fn()}
        onAddToCart={handleAddToCart}
        isAdded={false}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByText(/Quick Consecrate/i));
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('calls onViewDetails when clicked', () => {
    const handleViewDetails = vi.fn();

    render(
      <ProductCard
        product={mockProduct}
        onViewDetails={handleViewDetails}
        onAddToCart={vi.fn()}
        isAdded={false}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByText('Test Product'));
    expect(handleViewDetails).toHaveBeenCalledWith(mockProduct);
  });

  it('displays rating stars', () => {
    render(
      <ProductCard
        product={mockProduct}
        onViewDetails={vi.fn()}
        onAddToCart={vi.fn()}
        isAdded={false}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('(100)')).toBeInTheDocument();
    // Rating is displayed as stars (SVG elements with lucide-star class)
    const stars = screen.getAllByTestId('star-icon');
    expect(stars.length).toBe(5);
  });

  it('shows best seller badge', () => {
    render(
      <ProductCard
        product={mockProduct}
        onViewDetails={vi.fn()}
        onAddToCart={vi.fn()}
        isAdded={false}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/Best Seller/i)).toBeInTheDocument();
  });
});
