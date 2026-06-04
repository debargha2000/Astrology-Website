import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

interface Props {
  authError: string;
  isAuthLoading: boolean;
  onLogin: () => void;
}

export function AuthGate({ authError, isAuthLoading, onLogin }: Props) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-transparent px-4 py-12 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-md w-full bg-cream border border-stone rounded-3xl p-8 md:p-10 shadow-xl space-y-8 hover:shadow-2xl transition-all duration-700"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-ink rounded-2xl text-paper shadow-md mb-2">
            <Sparkles className="h-6 w-6 text-gold-muted" />
          </div>
          <h2 className="font-serif text-2xl font-light text-ink tracking-wider">
            Sacred Gateway <br />
            <span className="font-semibold text-gold-muted">CMS Operations</span>
          </h2>
          <p className="text-xs text-ink/60 max-w-xs mx-auto leading-relaxed font-light">
            This portal is strictly reserved for authorized administrative staff. Verify your Google
            Identity to calibrate crystallographic supply chains.
          </p>
        </div>

        {authError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-[11px] font-mono leading-relaxed"
          >
            ⚠️ {authError}
          </motion.div>
        )}

        <div className="space-y-4">
          <button
            onClick={onLogin}
            disabled={isAuthLoading}
            className="w-full cursor-pointer bg-ink hover:bg-shadow disabled:bg-clay/50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-mono text-xs uppercase tracking-widest font-bold border border-stone/20 shadow-md transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isAuthLoading ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                className="h-4 w-4 mr-1 shrink-0"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path
                    d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.43c0,-0.64 -0.06,-1.25 -0.16,-1.84z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.91,0.61 -2.08,0.97 -3.3,0.97c-2.33,0 -4.31,-1.57 -5.02,-3.69H2.92v2.66C4.41,18.73 7.96,20.6 12,20.6z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.98,13.13C6.8,12.57 6.7,11.97 6.7,11.35c0,-0.62 0.1,-1.22 0.28,-1.78l-2.66,-2.66C3.47,8.21 3,9.72 3,11.35c0,1.63 0.47,3.14 1.32,4.44l2.66,-2.66z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12,5.18c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,2.44 14.42,1.6 12,1.6C7.96,1.6 4.41,3.47 2.92,6.47l2.66,2.66C6.29,7.01 8.27,5.18 12,5.18z"
                    fill="#EA4335"
                  />
                </g>
              </svg>
            )}
            <span>{isAuthLoading ? 'Verifying...' : 'Sign In with Google'}</span>
          </button>

          <div className="text-center font-mono text-[9px] text-clay uppercase tracking-widest pt-2">
            🔒 Standard Single Admin Enforced
          </div>
        </div>
      </motion.div>
    </div>
  );
}
