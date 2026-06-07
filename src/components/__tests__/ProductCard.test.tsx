import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';

import ProductCard from '../ProductCard';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: 'P1',
    name: 'Test Crystal',
    salePrice: 999,
    originalPrice: 1199,
    rating: 5,
    reviewsCount: 10,
    description: 'A test crystal',
    shortDescription: 'Short desc',
    benefits: ['Test benefit'],
    crystalsUsed: ['Amethyst', 'Clear Quartz'],
    imageUrl: '/test.png',
    videoUrl: '',
    category: 'bracelet' as const,
    stockStatus: 'in-stock' as const,
    isBestSeller: false,
    zodiacConnection: ['Aries'],
    specifications: {
      beadSize: '8mm',
      beadCount: 24,
      threadMaterial: 'Elastic',
      origin: 'India',
      chargeTime: '3 Days',
    },
  };

  it('renders product name and price', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={() => {}}
        onViewDetails={() => {}}
        isAdded={false}
      />
    );
    expect(screen.getByText('Test Crystal')).toBeInTheDocument();
  });
});
