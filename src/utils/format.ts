/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const formatINR = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatTimer = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export const generateOrderId = (): string => {
  return 'order_' + Math.random().toString(36).slice(2, 12);
};

export const generateReceiptSuffix = (): string => {
  return 'rec_' + Date.now().toString().slice(-6);
};

export const generateRegistrationId = (): string => {
  return `ARS-${Math.floor(Math.random() * 900000 + 100000)}`;
};

export const generateAvatarUrl = (name: string): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=d4af37&fontFamily=Inter`;
};
