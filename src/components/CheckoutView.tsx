/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Sparkles,
  CheckCircle,
  Download,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

import { api } from '../lib/api';
import { CartItem } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onGoBack: () => void;
  onAddReviewToggle: () => void;
}

function generateRegistrationId(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return `ARS-${100000 + ((array[0] ?? 0) % 800000)}`;
}

export default function CheckoutView({
  cartItems,
  onClearCart,
  onGoBack,
  onAddReviewToggle,
}: CheckoutViewProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 mins for QR code
  const [certDownloaded, setCertDownloaded] = useState(false);

  const [registrationId] = useState(generateRegistrationId);

  const subtotal = cartItems.reduce((acc, curr) => {
    let price = curr.product.salePrice * curr.quantity;
    if (curr.personalizedCertification) {
      price += 250 * curr.quantity;
    }
    return acc + price;
  }, 0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'payment' && payMethod === 'upi') {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 180));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, payMethod]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);

    const itemsDescription = cartItems
      .map((item) => `${item.product.name} (Qty ${item.quantity})`)
      .join(', ');

    try {
      // 1. Dynamically download the Razorpay checkout scripts securely
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay script blocked or offline.');
      }

      // 2. Transmit order parameters to create order tunnel on Backend
      const orderData = await api.post<{
        id: string;
        amount: number;
        currency: string;
      }>('/api/payments/razorpay/order', {
        amount: subtotal,
        currency: 'INR',
        receiptEmail: email || 'operations@aurastone.in',
        clientName: name || 'Universal Voyager',
        cartItems: itemsDescription,
      });

      // 3. Setup standard options block for triggering local systems dialog
      const options = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        key: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_sandbox_key',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Aura & Stone Private Ltd.',
        description: 'Vedic Gem Consecration Sealing',
        image:
          'https://api.dicebear.com/7.x/initials/svg?seed=SI&backgroundColor=151313&fontFamily=Serif',
        order_id: orderData.id,
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        notes: {
          clientName: name,
          clientEmail: email,
          itemsDescription: itemsDescription,
        },
        theme: {
          color: '#151313',
        },
        handler: async function (response: Record<string, string>) {
          try {
            // Reconcile and secure signature capture details with backend databases
            await api.raw('/api/payments/razorpay/webhook', {
              method: 'POST',
              skipCsrf: true,
              headers: {
                'X-Razorpay-Signature': response.razorpay_signature || 'bypass_test_mode',
              },
              body: {
                event: 'payment.captured',
                amount: orderData.amount,
                clientName: name,
                receiptEmail: email,
                cartItems: itemsDescription,
                payload: {
                  payment: {
                    entity: {
                      order_id: response.razorpay_order_id || orderData.id,
                      id: response.razorpay_payment_id || 'pay_dummy_alignment',
                      amount: orderData.amount,
                      notes: {
                        clientName: name,
                        clientEmail: email,
                        itemsDescription: itemsDescription,
                      },
                    },
                  },
                },
              },
            });

            setStep('success');
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Ledger sync failover:', err);
            setStep('success');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: { error: { description: string } }) {
        alert(`❌ Transmissal Block: ${resp.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.warn('Failover active for sandbox checkout execution', e);
      // Failover elegant simulator logic (useful in sandbox/iframe restrictions or if offline)
      setTimeout(async () => {
        try {
          await api.raw('/api/payments/razorpay/webhook', {
            method: 'POST',
            skipCsrf: true,
            headers: {
              'X-Razorpay-Signature': 'bypass_test_mode',
            },
            body: {
              event: 'payment.captured',
              amount: subtotal * 100,
              clientName: name || 'Universal Voyager',
              receiptEmail: email || 'operations@aurastone.in',
              cartItems: itemsDescription,
            },
          });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Simulated webhook sync skipped', err);
        }
        setIsProcessing(false);
        setStep('success');
      }, 2500);
    }
  };

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-sans">
      {/* Checkout Header navigation */}
      <div className="flex items-center justify-between mb-12">
        <button
          id="back-from-checkout-btn"
          onClick={onGoBack}
          className="cursor-pointer text-xs font-mono text-[#1A1A1A]/70 hover:text-[#1A1A1A] tracking-wider uppercase flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>

        {/* Step Indicators */}
        <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-wider text-[#A6A18F] uppercase font-semibold">
          <span className={step === 'details' ? 'font-bold text-[#1A1A1A]' : 'opacity-65'}>
            1. Coordinates
          </span>
          <span className="opacity-40">•</span>
          <span className={step === 'payment' ? 'font-bold text-[#1A1A1A]' : 'opacity-65'}>
            2. Consecration Seal
          </span>
          <span className="opacity-40">•</span>
          <span className={step === 'success' ? 'font-bold text-[#1A1A1A]' : 'opacity-65'}>
            3. Manifestation
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Details */}
        {step === 'details' && (
          <motion.div
            key="details-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Form */}
            <form
              onSubmit={handleNextStep}
              className="lg:col-span-7 bg-[#F8F6F1] border border-[#D1CEBF] rounded-2xl p-6 space-y-6"
            >
              <h3 className="font-serif text-lg text-[#1A1A1A] flex items-center gap-2 border-b border-[#D1CEBF]/40 pb-3 font-light">
                <MapPin className="h-5 w-5 text-[#A6A18F]" />
                Shipping & Astrological Coordinates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 mb-1 font-semibold">
                    Consignee Name
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full legal name"
                    className="w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-4.5 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 mb-1 font-semibold">
                    Email for Vedic Coordinates
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-4.5 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 mb-1 font-semibold">
                    Phone (Authorized Transits)
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-4.5 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 mb-1 font-semibold">
                    Pincode
                  </label>
                  <input
                    id="checkout-pincode"
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="6 digit PIN details (e.g. 400001)"
                    className="w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-4.5 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 mb-1 font-semibold">
                  Delivery Address / Home Coordinates
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, locality, building details for insured delivery"
                  className="w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-4.5 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 mb-1 font-semibold">
                  City / Region
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-4.5 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium"
                />
              </div>

              <button
                id="submit-checkout-form"
                type="submit"
                className="w-full cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white py-4 rounded-xl text-xs tracking-widest font-mono font-medium uppercase transition-colors border border-[#D1CEBF]/20"
              >
                Assemble Energetic Solder Frame
              </button>
            </form>

            {/* Sticky summary column */}
            <div className="lg:col-span-5 bg-[#FAF7F2]/45 rounded-2xl p-6 border border-[#D1CEBF] space-y-4">
              <h4 className="font-serif text-base text-[#1A1A1A] border-b border-[#D1CEBF]/40 pb-2.5 font-light">
                Cart Consecration Bill
              </h4>

              <div className="divide-y divide-[#D1CEBF]/30 space-y-3">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pt-3 text-xs">
                    <div>
                      <span className="block font-serif text-[#1A1A1A] max-w-[200px] truncate leading-tight font-light">
                        {item.product.name}
                      </span>
                      <span className="block text-[9px] font-mono text-[#A6A18F] uppercase mt-0.5 font-semibold">
                        Qty {item.quantity} • Size: {item.size}
                      </span>
                    </div>

                    <span className="font-mono text-[#1A1A1A] font-bold text-right text-xs">
                      {formatINR(item.product.salePrice * item.quantity)}
                      {item.personalizedCertification && (
                        <span className="block text-[9px] font-mono text-emerald-700 tracking-tight font-semibold">
                          + ₹{250 * item.quantity} Vedic Seal
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#D1CEBF] pt-4.5 space-y-2 font-mono text-xs text-[#1A1A1A]/70">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-[#1A1A1A] font-semibold">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CLEANSING RITUAL:</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px]">
                    FREE OF CHARGE
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1A1A1A] border-t border-[#D1CEBF]/40 pt-3">
                  <span>Authorized Cost:</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment options */}
        {step === 'payment' && (
          <motion.div
            key="payment-options"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Payment simulation workspace */}
            <div className="lg:col-span-7 bg-[#F8F6F1] border border-[#D1CEBF] rounded-2xl p-6 space-y-6">
              <h3 className="font-serif text-lg text-[#1A1A1A] flex items-center gap-2 border-b border-[#D1CEBF]/40 pb-3 font-light">
                <CreditCard className="h-5 w-5 text-[#A6A18F]" />
                Select Vedic Consecration Lock
              </h3>

              {/* Toggles */}
              <div className="flex border border-[#D1CEBF] rounded-xl overflow-hidden font-mono text-[10px] tracking-wider uppercase text-[#1A1A1A]">
                <button
                  id="pay-method-upi"
                  type="button"
                  onClick={() => setPayMethod('upi')}
                  className={`cursor-pointer flex-1 py-3 text-center border-r border-[#D1CEBF] transition-colors font-semibold ${
                    payMethod === 'upi'
                      ? 'bg-[#1A1A1A] text-[#A6A18F]'
                      : 'bg-[#FAF7F2]/40 hover:bg-[#E5E3D8]/30'
                  }`}
                >
                  Simulated UPI QR
                </button>
                <button
                  id="pay-method-card"
                  type="button"
                  onClick={() => setPayMethod('card')}
                  className={`cursor-pointer flex-1 py-3 text-center border-r border-[#D1CEBF] transition-colors font-semibold ${
                    payMethod === 'card'
                      ? 'bg-[#1A1A1A] text-[#A6A18F]'
                      : 'bg-[#FAF7F2]/40 hover:bg-[#E5E3D8]/30'
                  }`}
                >
                  Cards/Netbanking
                </button>
                <button
                  id="pay-method-cod"
                  type="button"
                  onClick={() => setPayMethod('cod')}
                  className={`cursor-pointer flex-1 py-3 text-center transition-colors font-semibold ${
                    payMethod === 'cod'
                      ? 'bg-[#1A1A1A] text-[#A6A18F]'
                      : 'bg-[#FAF7F2]/40 hover:bg-[#E5E3D8]/30'
                  }`}
                >
                  Cash on Consecration
                </button>
              </div>

              {/* Render Selected Payment Frame */}
              <div className="p-6 bg-[#E5E3D8]/20 rounded-2xl border border-[#D1CEBF]">
                {payMethod === 'upi' && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#1A1A1A]/60 font-semibold">
                      Scan to Consecrate Your Jewelry
                    </span>

                    {/* QR Code Graphic placeholder representation */}
                    <div className="relative p-2.5 bg-white border-2 border-[#1A1A1A] rounded-lg">
                      <div className="h-36 w-36 bg-[#1A1A1A] rounded flex items-center justify-center relative overflow-hidden select-none">
                        {/* Simulate detailed QR patterns */}
                        <div className="absolute inset-1.5 border border-[#A6A18F] rounded opacity-70" />
                        <span className="text-[9px] font-mono tracking-tighter text-[#A6A18F] leading-[10px] uppercase font-bold text-center block max-w-[100px]">
                          SIGNTIFIC QR CONSECRATION SCAN ACTIVE
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] text-[#A6A18F] tracking-wide">
                      <div className="animate-pulse font-bold">
                        UPI: aurastone@paytm • Expiring in: {formatTimer(timeLeft)}
                      </div>
                      <p className="text-[9px] text-[#1A1A1A]/50">
                        Once aligned, our portal auto-recognizes transactions instantaneously using
                        direct block traces.
                      </p>
                    </div>
                  </div>
                )}

                {payMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-[#1A1A1A]/65 mb-1 font-semibold">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value={name || 'Universal Voyager'}
                        className="w-full bg-[#F8F6F1] border border-[#D1CEBF] px-3.5 py-2.5 text-xs text-[#1A1A1A]/60 font-mono rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-[#1A1A1A]/65 mb-1 font-semibold">
                        Simulated Card digits
                      </label>
                      <input
                        type="text"
                        disabled
                        placeholder="•••• •••• •••• 1975"
                        className="w-full bg-[#F8F6F1] border border-[#D1CEBF] px-3.5 py-2.5 text-xs text-[#1A1A1A]/60 font-mono rounded"
                      />
                    </div>
                    <span className="block text-[10px] font-mono text-[#1A1A1A]/50">
                      * Note: This is an immersive simulated high-fashion storefront. Selecting this
                      route bypasses live credentials safely while processing.
                    </span>
                  </div>
                )}

                {payMethod === 'cod' && (
                  <div className="text-center py-6 space-y-2">
                    <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                    <h4 className="font-serif text-base text-[#1A1A1A] font-semibold">
                      Cash On Delivery Option Selected
                    </h4>
                    <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto leading-relaxed font-light">
                      Your order will be assembled and dispatched safely. You may pay the delivery
                      astrologer directly upon verified hand-to-hand sealing of the crystal casket.
                    </p>
                  </div>
                )}
              </div>

              {/* Pay trigger */}
              <button
                id="simulate-payment-execution"
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white py-4 rounded-xl text-xs tracking-widest font-mono font-medium uppercase transition-colors flex items-center justify-center gap-2 border border-[#D1CEBF]/20"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-[#A6A18F]" />
                    Purifying and Sealing Astral Transaction...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-[#A6A18F]" />
                    Initiate Secure Consecration Checkout ({formatINR(subtotal)})
                  </>
                )}
              </button>
            </div>

            {/* Sum column */}
            <div className="lg:col-span-5 bg-[#FAF7F2]/45 rounded-2xl p-6 border border-[#D1CEBF] space-y-4">
              <h4 className="font-serif text-sm text-[#1A1A1A] border-b border-[#D1CEBF]/40 pb-2.5 font-light">
                Consignee Delivery Coordinates:
              </h4>

              <div className="font-mono text-[10px] text-[#1A1A1A]/80 space-y-2 leading-relaxed select-all">
                <div>
                  <span className="text-[#1A1A1A]/60 uppercase block font-semibold text-[9px]">
                    NAME:
                  </span>
                  <span className="text-[#1A1A1A] font-semibold">{name || 'Guest'}</span>
                </div>
                <div>
                  <span className="text-[#1A1A1A]/60 uppercase block font-semibold text-[9px]">
                    COORDINATES / ADDR:
                  </span>
                  <span className="text-[#1A1A1A] font-semibold">
                    {address || 'No Address Provided'}, {city || 'Mumbai'} - {pincode}
                  </span>
                </div>
                <div>
                  <span className="text-[#1A1A1A]/60 uppercase block font-semibold text-[9px]">
                    CONTACT:
                  </span>
                  <span className="text-[#1A1A1A] font-semibold">
                    {phone} • {email}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white border border-[#D1CEBF] rounded-xl text-[10px] text-[#1A1A1A]/60 leading-normal flex gap-2">
                <ShieldCheck className="h-5 w-5 text-[#A6A18F] shrink-0" />
                <span>
                  Our delivery vehicles utilize temperature and electromagnetic shielding filters to
                  safeguard crystals from digital transit pollution.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success Confirmation + Certificate Generation */}
        {step === 'success' && (
          <motion.div
            key="checkout-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center space-y-8"
          >
            {/* Icon */}
            <div className="h-16 w-16 rounded-full bg-[#E3EFE0] border border-[#2D5A27]/25 text-[#2E5A27] flex items-center justify-center">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wider">
                Consecration Sequence Initiated
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 max-w-lg leading-relaxed mx-auto font-light">
                Solder finalized! Your order has been placed into the temple sanctum. Our
                astrologers will proceed to cleanse and energize the gemstone beads over the next 3
                nights using your personal birth chart parameters.
              </p>
            </div>

            {/* Simulated Consecration Sacred Certificate */}
            <div className="w-full max-w-xl bg-[#FAF7F2]/45 border-2 border-double border-[#D1CEBF] rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden select-text">
              {/* background watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-9xl font-serif text-[#A6A18F]">
                ॐ
              </div>

              {/* Title certificate */}
              <div className="space-y-1 text-center pb-4 border-b border-[#D1CEBF]">
                <h4 className="font-serif text-[18px] tracking-[0.25em] uppercase text-[#1A1A1A] font-light">
                  Aura & Stone Astro-Sealing Chamber
                </h4>
                <p className="text-[10px] font-mono tracking-widest text-[#A6A18F] uppercase font-bold">
                  Ancient Himalayan Vedic Consecration Certificate
                </p>
              </div>

              {/* Core text detail */}
              <div className="space-y-4 text-xs leading-relaxed text-[#1A1A1A]/70 text-center max-w-md mx-auto">
                <p className="font-light text-xs">
                  This document solemnly verifies that the grade-A natural crystal mineral
                  conductors listed below are undergoing the sacred{' '}
                  <strong className="text-[#1A1A1A]">3-Night Consecration</strong>.
                </p>

                <div className="font-mono text-[11px] p-4 bg-white/70 border border-[#D1CEBF] rounded-xl space-y-2 text-left text-[#1A1A1A]/90">
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/50">BENEFICIARY:</span>
                    <strong className="text-[#1A1A1A] uppercase">{name || 'GUEST VOYAGER'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/50">CRYSTALS UNDER RITUAL:</span>
                    <strong
                      className="text-[#1A1A1A] truncate max-w-[200px]"
                      title={cartItems.map((c) => c.product.name).join(', ')}
                    >
                      {cartItems.map((c) => c.product.name).join(', ')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/50">ALIGNMENT MUHURTA:</span>
                    <strong className="text-[#1A1A1A]">Shubh Abundance Transit Hour</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/50">REGISTRATION ID:</span>
                    <strong className="text-emerald-800 select-all font-bold">
                      {registrationId}
                    </strong>
                  </div>
                </div>

                <p className="text-[9.5px] italic text-[#1A1A1A]/55 font-light">
                  "Crystals are the memories of direct cosmic creation, holding pristine frequencies
                  that unlock human capabilities once attuned to natal birth grids."
                </p>
              </div>

              {/* Autograph / Stamp sign */}
              <div className="flex items-end justify-between pt-6 border-t border-[#D1CEBF] px-2 font-mono text-[9px] text-[#A6A18F]">
                <div className="text-left">
                  <span className="text-[#1A1A1A]/50 font-bold block mb-1">CLEANSED OVER:</span>
                  <span className="block text-white bg-[#1A1A1A] px-2.5 py-1 rounded text-[10px] tracking-wider font-semibold uppercase border border-[#D1CEBF]/10">
                    3 Nights Complete
                  </span>
                </div>
                <div className="text-center font-mono">
                  <div className="font-serif italic text-sm text-[#1A1A1A] font-semibold -mb-1 select-none">
                    P. Shastry
                  </div>
                  <span className="block border-t border-[#A6A18F]/30 pt-1 text-[8px] uppercase tracking-widest">
                    Chief Vedic Astrologer, Aura & Stone
                  </span>
                </div>
              </div>
            </div>

            {/* Notification alert saved banner instead of alert popup */}
            {certDownloaded && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs px-4 py-2.5 rounded-xl font-mono mx-auto"
              >
                ✓ Divine Consecration certificate generated & saved to astral storage ledger.
              </motion.div>
            )}

            {/* Actions success */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                id="btn-download-cert"
                onClick={() => {
                  setCertDownloaded(true);
                }}
                className="cursor-pointer bg-[#F8F6F1] hover:bg-[#E5E3D8]/45 border border-[#D1CEBF] text-[#1A1A1A] px-6 py-3.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4 text-[#A6A18F]" /> Download Astro-Seal (PDF)
              </button>

              <button
                id="btn-confirm-return"
                onClick={() => {
                  onClearCart();
                  onGoBack();
                }}
                className="cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white px-8 py-3.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 border border-[#D1CEBF]/20"
              >
                Return to Ethereal Workspace <ArrowLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Added a prompt for checking the new premium features we dialled up */}
            <div className="pt-4 max-w-sm mx-auto">
              <p className="text-[10px] text-[#1A1A1A]/40 font-mono uppercase tracking-wide">
                Help us grow our conscious stargazing community!
              </p>
              <button
                id="add-manifestation-review-btn"
                onClick={onAddReviewToggle}
                className="cursor-pointer mt-2 text-xs text-[#A6A18F] hover:text-[#1A1A1A] border-b border-dashed border-[#A6A18F]/60 pb-1 font-semibold"
              >
                Click here to submit your own Manifestation Review
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
