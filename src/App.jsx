import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Heart, Sun, Feather, Star, Sparkles, ChevronDown } from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * HAPPY BIRTHDAY — a premium, mobile-first greeting page
 * ─────────────────────────────────────────────────────────────────────────
 * Stack: React + Tailwind (core utility classes only) + Framer Motion +
 *        a small amount of hand-written CSS for keyframes Tailwind can't do.
 *
 * HOW TO CUSTOMIZE
 *  1. Edit the CONTENT object below — name, message, photos, reasons, song.
 *  2. Swap the picsum.photos URLs in `photos` for real photo URLs.
 *  3. Wire up a real audio file — see the <audio> tag inside <MusicPlayer/>.
 *  4. Everything else (motion, layout, palette) just works out of the box.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ─── CONTENT — edit this per client ─────────────────────────────────────
const CONTENT = {
  name: "Amara",
  eyebrow: "A Birthday, Just For",
  subline: "May every candle get its wish.",
  letterEyebrow: "A Little Letter For You",
  letterHeading: "Happy Birthday",
  message: `Another year of you being exactly, wonderfully you. I hope today wraps you in the same warmth you give to everyone else — slow mornings, good light, and people who love you loudly.

Here's to the year ahead: softer where you need soft, bigger where you dream big.

I'm so glad you were born.`,
  photos: [
    { src: "https://picsum.photos/seed/birthday-mem-1/500/640", caption: "That afternoon by the water" },
    { src: "https://picsum.photos/seed/birthday-mem-2/500/640", caption: "Your favorite kind of chaos" },
    { src: "https://picsum.photos/seed/birthday-mem-3/500/640", caption: "The trip we almost cancelled" },
    { src: "https://picsum.photos/seed/birthday-mem-4/500/640", caption: "Just an ordinary, perfect day" },
  ],
  reasonsEyebrow: "A Few (Of Many) Reasons",
  reasonsHeading: "Why You",
  reasons: [
    { icon: Sparkles, title: "Your Laughter", body: "It fills every room and makes even ordinary days feel like a celebration." },
    { icon: Heart, title: "Your Kindness", body: "The way you show up for everyone around you, quietly, without asking for anything back." },
    { icon: Sun, title: "Your Warmth", body: "Being near you feels like standing in sunlight — easy, comforting, alive." },
    { icon: Feather, title: "Your Grace", body: "How you carry hard days with a lightness that inspires the rest of us." },
    { icon: Star, title: "Your Spark", body: "That unmistakable something that makes you, you — impossible to replace." },
  ],
  song: { title: "Made For You", artist: "Your Birthday Playlist", src: "" }, // add an mp3 url to `src`
};

// ─── SHARED: fonts + keyframes (kept out of Tailwind since it needs no compiler) ──
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600&family=Inter:wght@400;500;600;700&display=swap');

    .font-display { font-family: 'Playfair Display', Georgia, serif; }
    .font-body { font-family: 'Inter', system-ui, sans-serif; }

    @keyframes flicker {
      0%, 100% { transform: scaleY(1) scaleX(1) translateY(0); opacity: 1; }
      25% { transform: scaleY(1.08) scaleX(0.95) translateY(-1px); opacity: 0.92; }
      50% { transform: scaleY(0.95) scaleX(1.05) translateY(0.5px); opacity: 1; }
      75% { transform: scaleY(1.05) scaleX(0.97) translateY(-0.5px); opacity: 0.95; }
    }
    .animate-flicker { animation: flicker 2.2s ease-in-out infinite; transform-origin: bottom center; }

    @keyframes glow-breathe {
      0%, 100% { opacity: 0.55; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.08); }
    }
    .animate-glow-breathe { animation: glow-breathe 4s ease-in-out infinite; }

    @keyframes drift {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      10% { opacity: 0.9; }
      90% { opacity: 0.7; }
      100% { transform: translateY(-14px) translateX(6px); opacity: 0; }
    }
    .animate-drift { animation: drift 3.5s ease-out infinite; }

    @keyframes fall {
      0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
      8% { opacity: 1; }
      100% { transform: translateY(110vh) translateX(var(--drift, 20px)) rotate(360deg); opacity: 0.9; }
    }

    @keyframes burst {
      0% { transform: translate(-50%, -50%) rotate(var(--r, 0deg)) translateY(0) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -50%) rotate(var(--r, 0deg)) translateY(var(--dist, -140px)) scale(0.6); opacity: 0; }
    }

    @keyframes rise-fade {
      0% { transform: translateY(0) scale(1); opacity: 0.5; }
      100% { transform: translateY(-40px) scale(2.2); opacity: 0; }
    }

    @keyframes bar-bounce {
      0%, 100% { height: 30%; }
      50% { height: 100%; }
    }

    @keyframes shimmer-text {
      0%, 100% { filter: drop-shadow(0 0 18px rgba(252, 211, 77, 0.35)); }
      50% { filter: drop-shadow(0 0 30px rgba(252, 211, 77, 0.6)); }
    }
    .animate-shimmer-text { animation: shimmer-text 3.5s ease-in-out infinite; }

    @media (prefers-reduced-motion: reduce) {
      .animate-flicker, .animate-glow-breathe, .animate-drift, .animate-shimmer-text {
        animation-duration: 0.001ms !important;
      }
    }

    /* hides the native scrollbar so the carousel reads as a deliberate
       swipe gesture instead of a raw overflow box */
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  `}</style>
);

// ─── Small ornamental divider used between eyebrow / headings ───────────
const GoldDivider = ({ className = "" }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/70" />
    <span className="h-1.5 w-1.5 rotate-45 bg-amber-400/80" />
    <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/70" />
  </div>
);

const Eyebrow = ({ children }) => (
  <p className="font-body text-[11px] sm:text-xs tracking-[0.35em] uppercase text-amber-300/80 text-center mb-3">
    {children}
  </p>
);

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// ─── Ambient falling confetti (hero background) ──────────────────────────
const AMBIENT_COLORS = ["#fcd34d", "#fef3c7", "#fda4af", "#c4b5fd", "#fbbf24"];

const AmbientConfetti = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 6,
        color: AMBIENT_COLORS[i % AMBIENT_COLORS.length],
        duration: 7 + Math.random() * 6,
        delay: Math.random() * 8,
        drift: `${(Math.random() - 0.5) * 80}px`,
        round: Math.random() > 0.5,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 1.8),
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
            "--drift": p.drift,
          }}
        />
      ))}
    </div>
  );
};

// ─── Burst confetti (fires when the candle is blown out) ─────────────────
const BurstConfetti = ({ burstKey }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, i) => ({
        id: `${burstKey}-${i}`,
        angle: Math.random() * 360,
        dist: 90 + Math.random() * 130,
        size: 5 + Math.random() * 6,
        color: AMBIENT_COLORS[i % AMBIENT_COLORS.length],
        delay: Math.random() * 0.15,
        duration: 0.9 + Math.random() * 0.6,
        round: Math.random() > 0.4,
      })),
    [burstKey]
  );

  if (!burstKey) return null;

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            width: p.size,
            height: p.size * (p.round ? 1 : 1.8),
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            left: 0,
            top: 0,
            "--r": `${p.angle}deg`,
            "--dist": `-${p.dist}px`,
            animation: `burst ${p.duration}s cubic-bezier(0.22,1,0.36,1) ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

// ─── The interactive candle — the page's signature moment ────────────────
const Candle = () => {
  const [lit, setLit] = useState(true);
  const [wishShown, setWishShown] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const handleBlow = useCallback(() => {
    if (!lit) return;
    setLit(false);
    setBurstKey((k) => k + 1);
    clearTimers();
    const t1 = setTimeout(() => setWishShown(true), 350);
    const t2 = setTimeout(() => setWishShown(false), 3600);
    const t3 = setTimeout(() => setLit(true), 4200);
    timeoutsRef.current = [t1, t2, t3];
  }, [lit]);

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={handleBlow}
        aria-label="Tap the flame to make a wish"
        className="relative flex flex-col items-center outline-none active:scale-95 transition-transform"
        style={{ touchAction: "manipulation" }}
      >
        {/* warm glow behind flame */}
        {lit && (
          <span
            className="animate-glow-breathe pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(252,211,77,0.55), transparent 70%)" }}
          />
        )}

        {/* flame */}
        <span className="relative h-10 mb-[-2px] flex items-end justify-center" style={{ width: 20 }}>
          <AnimatePresence>
            {lit && (
              <motion.span
                key="flame"
                initial={{ opacity: 0, scaleY: 0.4 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0.1, transition: { duration: 0.35 } }}
                className="animate-flicker block h-8 w-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
                style={{
                  background: "linear-gradient(to top, #f59e0b, #fcd34d 55%, #fef9c3 90%)",
                  boxShadow: "0 0 14px 2px rgba(252,211,77,0.55)",
                }}
              />
            )}
          </AnimatePresence>

          {/* smoke wisp on blow-out */}
          <AnimatePresence>
            {!lit && (
              <motion.span
                key="smoke"
                initial={{ opacity: 0.5, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -30, scale: 2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute bottom-2 block h-3 w-2 rounded-full bg-slate-300/60 blur-[2px]"
              />
            )}
          </AnimatePresence>
        </span>

        {/* wick */}
        <span className="h-2 w-[3px] bg-slate-800 rounded-full" />

        {/* candle body */}
        <span
          className="h-16 w-4 rounded-sm relative"
          style={{ background: "linear-gradient(to bottom, #fefce8, #fde68a)" }}
        >
          <span className="absolute inset-x-0 top-2 h-px bg-amber-600/30" />
          <span className="absolute inset-x-0 top-5 h-px bg-amber-600/30" />
          <span className="absolute inset-x-0 top-8 h-px bg-amber-600/30" />
        </span>

        {/* base plate */}
        <span
          className="mt-1 h-2 w-14 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(252,211,77,0.35), transparent 75%)" }}
        />

        <BurstConfetti burstKey={burstKey} />
      </button>

      <p className="font-body text-[11px] sm:text-xs tracking-widest uppercase text-amber-200/60 mt-5">
        {lit ? "tap the flame to make a wish" : "  "}
      </p>

      <AnimatePresence>
        {wishShown && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="font-display italic text-amber-200/90 text-sm sm:text-base mt-5 text-center"
          >
            wish granted. ✦
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── 1. HERO ───────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-6 py-20">
    {/* ambient radial glow */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(196,181,253,0.12), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 85%, rgba(252,211,77,0.10), transparent 60%)",
      }}
    />
    <AmbientConfetti />

    <div className="relative z-10 flex flex-col items-center text-center">
      <Eyebrow>{CONTENT.eyebrow}</Eyebrow>
      <GoldDivider className="mb-6" />

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-3xl sm:text-5xl text-stone-100 mb-1"
      >
        It's your day,
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="animate-shimmer-text font-display italic font-bold text-5xl sm:text-7xl leading-tight bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent py-2"
      >
        {CONTENT.name}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="font-body text-stone-300/80 text-sm sm:text-base mt-4 mb-14 max-w-xs sm:max-w-sm"
      >
        {CONTENT.subline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7 }}
      >
        <Candle />
      </motion.div>
    </div>

    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-amber-200/50"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <ChevronDown size={22} />
    </motion.div>
  </section>
);

// ─── 2. PERSONAL MESSAGE ───────────────────────────────────────────────
const MessageSection = () => (
  <section className="relative bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-20 sm:py-28">
    <div className="max-w-xl mx-auto">
      <Reveal>
        <Eyebrow>{CONTENT.letterEyebrow}</Eyebrow>
        <h3 className="font-display text-3xl sm:text-4xl text-center text-stone-100 mb-10">
          {CONTENT.letterHeading}
        </h3>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="relative rounded-3xl border border-amber-200/15 bg-white/[0.04] backdrop-blur-xl px-7 py-10 sm:px-12 sm:py-12 shadow-2xl overflow-hidden"
        >
          <span
            className="font-display absolute -top-6 left-4 text-amber-300/15 text-[9rem] leading-none select-none pointer-events-none"
            aria-hidden="true"
          >
            "
          </span>
          <p className="relative font-body text-stone-200/90 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {CONTENT.message}
          </p>
          <div className="relative mt-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent" />
            <span className="font-display italic text-amber-300/80 text-sm">with love</span>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ─── 3. MEMORY GALLERY ─────────────────────────────────────────────────
const Gallery = () => {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track which card is centered as the user swipes, so the dots below
  // stay in sync instead of exposing a raw browser scrollbar.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const cardCenter = el.offsetLeft + el.clientWidth / 2;
          const dist = Math.abs(cardCenter - trackCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
        ticking = false;
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = (i) => {
    const el = cardRefs.current[i];
    if (el && trackRef.current) {
      trackRef.current.scrollTo({
        left: el.offsetLeft - (trackRef.current.clientWidth - el.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-20 sm:py-28">
      <div className="px-6 max-w-xl mx-auto">
        <Reveal>
          <Eyebrow>The Memory Wall</Eyebrow>
          <h3 className="font-display text-3xl sm:text-4xl text-center text-stone-100 mb-10">
            Moments Worth Keeping
          </h3>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="relative">
          {/* edge fades hint that the strip continues, without a visible scrollbar */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-slate-900 to-transparent sm:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-slate-950 to-transparent sm:hidden" />

          <div
            ref={trackRef}
            className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-2 sm:justify-center sm:flex-wrap sm:overflow-visible"
          >
            {CONTENT.photos.map((photo, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className="snap-center shrink-0 w-64 sm:w-60"
                style={{ transform: `rotate(${i % 2 === 0 ? -2.5 : 2.5}deg)` }}
              >
                <div className="group bg-stone-50 rounded-md p-3 pb-6 shadow-xl transition-transform duration-300 active:scale-95 sm:hover:-translate-y-2 sm:hover:rotate-0">
                  <div className="overflow-hidden rounded-sm">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-72 object-cover transition-transform duration-500 sm:group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-display italic text-slate-600 text-sm text-center mt-3">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* dot indicators — replaces the native scrollbar as the "you are here" cue */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:hidden">
          {CONTENT.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className="p-1.5 -m-1.5"
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: activeIndex === i ? 18 : 6,
                  height: 6,
                  backgroundColor: activeIndex === i ? "#fbbf24" : "rgba(251,191,36,0.25)",
                }}
              />
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

// ─── 4. REASONS YOU'RE SPECIAL ─────────────────────────────────────────
const ReasonsSection = () => (
  <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-20 sm:py-28">
    <div className="max-w-xl mx-auto">
      <Reveal>
        <Eyebrow>{CONTENT.reasonsEyebrow}</Eyebrow>
        <h3 className="font-display text-3xl sm:text-4xl text-center text-stone-100 mb-12">
          {CONTENT.reasonsHeading}
        </h3>
      </Reveal>

      <div className="flex flex-col gap-4">
        {CONTENT.reasons.map((reason, i) => {
          const Icon = reason.icon;
          return (
            <Reveal key={reason.title} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-2xl border border-amber-100/10 bg-white/[0.03] px-5 py-5 backdrop-blur-sm transition-colors sm:hover:bg-white/[0.06]">
                <span className="flex-none h-11 w-11 rounded-full flex items-center justify-center border border-amber-300/30 bg-gradient-to-b from-amber-400/15 to-transparent">
                  <Icon size={19} className="text-amber-300" strokeWidth={1.75} />
                </span>
                <div>
                  <h4 className="font-display text-lg text-stone-100 mb-1">{reason.title}</h4>
                  <p className="font-body text-stone-400 text-sm leading-relaxed">{reason.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── FOOTER ────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-slate-950 px-6 pt-4 pb-32 text-center">
    <GoldDivider className="mb-5" />
    <p className="font-body text-stone-500 text-xs tracking-wide">
      made with love, for {CONTENT.name}'s day
    </p>
  </footer>
);

// ─── 5. STICKY MUSIC PLAYER ─────────────────────────────────────────────
const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggle = () => {
    setPlaying((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio && audio.src) {
        next ? audio.play().catch(() => {}) : audio.pause();
      }
      return next;
    });
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {/* Replace `src` with your own hosted mp3 to enable real playback */}
      <audio ref={audioRef} src={CONTENT.song.src} loop />

      <div className="w-full max-w-sm flex items-center gap-3 rounded-full border border-amber-200/15 bg-slate-900/85 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause background music" : "Play background music"}
          className="flex-none h-11 w-11 rounded-full flex items-center justify-center text-slate-900 active:scale-90 transition-transform"
          style={{
            background: "linear-gradient(135deg, #fde68a, #f59e0b)",
            boxShadow: "0 0 16px rgba(245,158,11,0.45)",
          }}
        >
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="font-body text-stone-100 text-sm font-medium truncate">{CONTENT.song.title}</p>
          <p className="font-body text-stone-400 text-xs truncate">{CONTENT.song.artist}</p>
        </div>

        <div className="flex-none flex items-end gap-[3px] h-5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-amber-300"
              style={{
                height: playing ? undefined : "20%",
                animation: playing ? `bar-bounce ${0.6 + i * 0.15}s ease-in-out ${i * 0.1}s infinite` : "none",
                opacity: playing ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="font-body min-h-screen">
      <GlobalStyle />
      <Hero />
      <MessageSection />
      <Gallery />
      <ReasonsSection />
      <Footer />
      <MusicPlayer />
    </div>
  );
}

