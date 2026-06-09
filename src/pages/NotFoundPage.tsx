import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #1C1917 0%, #292524 40%, #1C1917 100%)',
      }}
    >
      <div className="text-center max-w-lg space-y-8">
        {/* Cosmic 404 number */}
        <div className="relative">
          <h1
            className="text-[8rem] font-serif font-bold leading-none tracking-tighter"
            style={{
              background: 'linear-gradient(180deg, #D4AF37 0%, #C5A880 60%, #857F75 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            404
          </h1>
          <div
            className="absolute inset-0 blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-xl font-serif tracking-widest uppercase" style={{ color: '#C5A880' }}>
            Lost in the Cosmos
          </h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: '#A8A29E' }}>
            The celestial coordinates you seek do not align with any known astral path. The stars
            suggest returning to safer ground.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16" style={{ background: '#D4AF37' }} />
          <div className="w-2 h-2 rotate-45" style={{ background: '#D4AF37' }} />
          <div className="h-px w-16" style={{ background: '#D4AF37' }} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="not-found-home-btn"
            onClick={() => navigate('/')}
            className="px-8 py-3 text-xs font-mono tracking-[0.2em] uppercase rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #C5A880 100%)',
              color: '#1C1917',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
            }}
          >
            Return Home
          </button>
          <button
            id="not-found-back-btn"
            onClick={() => navigate(-1)}
            className="px-8 py-3 text-xs font-mono tracking-[0.2em] uppercase rounded-full transition-all duration-300 hover:scale-105"
            style={{
              border: '1px solid #D4AF37',
              color: '#C5A880',
              background: 'transparent',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
