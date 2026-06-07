import { X, Printer } from 'lucide-react';
import { motion } from 'motion/react';

import type { Invoice } from './types';

interface Props {
  invoice: Invoice;
  onClose: () => void;
}

export function InvoicePreviewModal({ invoice, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white text-ink border-4 border-double border-stone rounded-3xl p-6 sm:p-10 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto select-text font-serif space-y-6"
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-cream text-clay hover:text-ink"
        >
          <X className="h-5 w-5 font-bold" />
        </button>

        <div className="text-center space-y-1.5 border-b border-stone/40 pb-6">
          <span className="font-serif text-xl font-bold tracking-[0.2em] uppercase text-ink">
            AURA & STONE
          </span>
          <p className="text-[10px] font-mono tracking-widest text-gold-muted uppercase leading-none font-bold">
            HIMALAYAN PLANETARY ALIGNMENT LABORATORY CODEX INVOICE
          </p>
          <p className="text-[8px] font-mono text-clay uppercase pb-1 leading-none">
            ISO 9001:2015 MINERAL METADATA INTEGRITY CALIBRATION CERTIFICATE
          </p>
        </div>

        <div className="font-mono text-[10.5px] grid grid-cols-2 gap-4 pb-4 border-b border-cream text-ink/75">
          <div>
            <span className="block text-[8px] text-gold-muted uppercase font-bold leading-none mb-1">
              Voyager Client Ledger
            </span>
            <strong className="text-sm font-serif font-semibold text-ink">{invoice.client}</strong>
            <span className="block text-[9.5px] mt-1 text-clay">
              Ethereal Station Account Match
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[8px] text-gold-muted uppercase font-bold leading-none mb-1">
              Invoice Coordinates
            </span>
            <strong className="text-ink">{invoice.id}</strong>
            <span className="block text-[9.5px] mt-1 text-clay">REG DATE: {invoice.date}</span>
          </div>
        </div>

        <div className="space-y-4">
          <span className="block text-[8px] font-mono text-gold-muted uppercase tracking-widest font-bold">
            Consigned attunement services
          </span>
          <div className="border border-stone/50 rounded-xl overflow-hidden text-xs">
            <div className="bg-cream p-3 font-mono text-[9px] text-gold-muted font-bold uppercase tracking-wide grid grid-cols-12">
              <span className="col-span-8">Product specifications mapping</span>
              <span className="col-span-1 text-center">Qty</span>
              <span className="col-span-3 text-right">Attune Fee</span>
            </div>
            <div className="p-4 grid grid-cols-12 items-center text-ink">
              <div className="col-span-8 space-y-1">
                <strong className="font-serif text-sm font-light uppercase">{invoice.item}</strong>
                <span className="block text-[10px] font-mono text-gold-muted">
                  {invoice.alignment}
                </span>
              </div>
              <span className="col-span-1 text-center font-mono">1</span>
              <span className="col-span-3 text-right font-mono font-bold">
                ₹{invoice.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="px-4 py-2 border-t border-cream grid grid-cols-12 text-[10px] font-mono text-clay items-center bg-cream/20">
              <span className="col-span-9 uppercase">
                3-night lunar consecration bathing, Panchamrut cleanse, and signed paper cert
              </span>
              <span className="col-span-3 text-right font-bold text-emerald-800 uppercase">
                Gratis (Inc.)
              </span>
            </div>
          </div>
        </div>

        <div className="font-mono text-xs flex justify-between items-center bg-cream p-4 rounded-xl border border-double border-stone text-right font-bold text-ink">
          <div className="text-left">
            <span className="block text-[8px] text-gold-muted uppercase font-bold leading-none mb-1">
              Ledger Status
            </span>
            <span
              className={`inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded leading-none ${
                invoice.status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {invoice.status}
            </span>
          </div>
          <div>
            <span className="block text-[8.5px] text-gold-muted uppercase leading-none mb-1">
              Grand Total
            </span>
            <span className="text-base font-serif font-bold text-ink">
              ₹{invoice.amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-6 border-t border-stone/40 font-mono text-[9px] text-gold-muted">
          <div>
            <p className="font-sans font-light leading-relaxed max-w-[250px] text-[8.5px]">
              "Certified natural crystal grids, physically verified by Indian Sceptred Geology
              Laboratory standard protocols."
            </p>
          </div>
          <div className="text-center">
            <span className="block font-serif font-bold italic text-xs text-ink leading-none mb-1">
              P. Shastry
            </span>
            <span className="block border-t border-gold-muted/40 pt-1 text-[8px] uppercase tracking-widest font-semibold">
              Chief Astrologer seal
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-end font-mono text-[10px] pt-4">
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank', 'width=800,height=600');
              if (printWindow) {
                const content = document.querySelector('.fixed.inset-0.z-50 > div:last-child');
                if (content) {
                  printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>Invoice ${invoice.id}</title>
                      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,705;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
                      <style>
                        body { font-family: 'Inter', sans-serif; margin: 0; padding: 20mm; color: #1A1A1A; }
                        .font-serif { font-family: 'Cormorant Garamond', serif; }
                        .font-mono { font-family: 'JetBrains Mono', monospace; }
                      </style>
                    </head>
                    <body>${content.innerHTML}</body>
                    </html>
                  `);
                  printWindow.document.close();
                  setTimeout(() => {
                    printWindow.print();
                  }, 500);
                }
              }
            }}
            className="cursor-pointer bg-cream hover:bg-mist/50 border border-stone text-ink font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1"
          >
            <Printer className="h-4.5 w-4.5 text-gold-muted" /> Download PDF
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer bg-ink hover:bg-shadow text-white font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider"
          >
            Close View
          </button>
        </div>
      </motion.div>
    </div>
  );
}
