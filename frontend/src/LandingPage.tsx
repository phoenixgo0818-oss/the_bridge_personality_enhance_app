import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const MINDSET_PAIRS: { negative: { emoji: string; text: string }; positive: { emoji: string; text: string } }[] = [
  { negative: { emoji: '😰', text: 'I am afraid to try.' }, positive: { emoji: '🦁', text: 'I am brave enough to start.' } },
  { negative: { emoji: '😔', text: "I don't think I'm good enough." }, positive: { emoji: '🌱', text: 'I am growing every day.' } },
  { negative: { emoji: '😯', text: 'I keep doubting myself.' }, positive: { emoji: '💪', text: 'I trust my ability to improve.' } },
  { negative: { emoji: '🧱', text: 'I feel stuck in my life.' }, positive: { emoji: '🚶', text: 'I move forward step by step.' } },
  { negative: { emoji: '⏳', text: 'I keep procrastinating.' }, positive: { emoji: '⚡', text: 'I take action today.' } },
  { negative: { emoji: '🌪️', text: 'Everything feels overwhelming.' }, positive: { emoji: '🎯', text: 'I focus on one thing at a time.' } },
  { negative: { emoji: '😨', text: "I'm scared of failing." }, positive: { emoji: '📚', text: 'I learn from every attempt.' } },
  { negative: { emoji: '👀', text: 'I compare myself to others.' }, positive: { emoji: '📈', text: 'I focus on my own progress.' } },
  { negative: { emoji: '🧭', text: 'I feel lost and without direction.' }, positive: { emoji: '🛤️', text: 'I am building my path day by day.' } },
  { negative: { emoji: '⌛', text: "I think it's too late for me." }, positive: { emoji: '🌅', text: 'Today is a new beginning.' } },
  { negative: { emoji: '🧠', text: 'I overthink everything.' }, positive: { emoji: '👣', text: 'I take the next small step.' } },
  { negative: { emoji: '😴', text: "I don't feel motivated." }, positive: { emoji: '🔁', text: 'I build discipline with small actions.' } },
  { negative: { emoji: '😟', text: "I'm afraid of what people think." }, positive: { emoji: '🧍', text: 'I stay true to myself.' } },
  { negative: { emoji: '🥀', text: 'I feel weak and discouraged.' }, positive: { emoji: '🌳', text: 'I grow stronger every day.' } },
  { negative: { emoji: '🏳️', text: 'I give up too easily.' }, positive: { emoji: '🏔️', text: "I keep going even when it's hard." } },
  { negative: { emoji: '🌫️', text: 'Nothing seems to change.' }, positive: { emoji: '🔨', text: 'I create change through my actions.' } },
  { negative: { emoji: '⏱️', text: 'I wait for the perfect moment.' }, positive: { emoji: '🚀', text: 'I start now with what I have.' } },
  { negative: { emoji: '🐢', text: "I feel like I'm falling behind." }, positive: { emoji: '🛤️', text: 'I move at my own pace.' } },
  { negative: { emoji: '🔗', text: 'My bad habits control me.' }, positive: { emoji: '🧱', text: 'I build better habits daily.' } },
  { negative: { emoji: '📉', text: "I feel like I'm not progressing." }, positive: { emoji: '🧱', text: 'I grow one brick at a time.' } },
  { negative: { emoji: '🫥', text: 'I feel small compared to others.' }, positive: { emoji: '✨', text: 'My potential is real.' } },
  { negative: { emoji: '❌', text: "I don't believe I can succeed." }, positive: { emoji: '🏆', text: 'Success is built day by day.' } },
  { negative: { emoji: '😬', text: "I'm afraid of change." }, positive: { emoji: '🌿', text: 'Growth begins with change.' } },
  { negative: { emoji: '🪫', text: 'I feel powerless in my life.' }, positive: { emoji: '🔋', text: 'I take control of my future.' } },
  { negative: { emoji: '🌑', text: 'I doubt my future.' }, positive: { emoji: '🌟', text: 'I build my future one brick at a time.' } },
]

/** Part 1: full "Are you feeling..." block. Part 2: full "Why Uphuman?" block. Type → 5s static → delete → switch part → repeat. */
const INTRO_FULL_TEXT =
  "Are you feeling stuck, unmotivated, or overwhelmed?\nBuild yourself one brick at a time with Uphuman.\nLay daily bricks of growth, track them throughout the day, and watch yourself become stronger."
const WHY_FULL_TEXT =
  "Why Uphuman?\nThere are thousands of apps about productivity and motivation.\nBut Uphuman was created from real struggle and a genuine desire to help people grow.\nInstead of generic advice, Uphuman focuses on understanding you and helping you build yourself — one small brick at a time."

const CHAR_DELAY_MS = 22
const STATIC_MS = 5000

/** Renders visible substring with "Up" in amber where it appears in Uphuman. */
function TypedHeaderText({ text, length }: { text: string; length: number }) {
  const visible = text.slice(0, length)
  if (visible.includes('Uphuman')) {
    const [before, ...rest] = visible.split('Uphuman')
    const after = rest.join('Uphuman')
    return (
      <>
        {before}
        <span className="text-amber-400">Up</span>human{after}
      </>
    )
  }
  if (visible.endsWith('Up') && !visible.endsWith('Uphuman')) {
    const i = visible.lastIndexOf('Up')
    return (
      <>
        {visible.slice(0, i)}
        <span className="text-amber-400">Up</span>
      </>
    )
  }
  return <>{visible}</>
}

/**
 * Landing page: header (letter-by-letter typewriter), mindset cards strip, CTA.
 */
export function LandingPage() {
  const [contentToShow, setContentToShow] = useState<'intro' | 'why'>('intro')
  const [phase, setPhase] = useState<'typing' | 'static' | 'deleting'>('typing')
  const [visibleLength, setVisibleLength] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const currentText = contentToShow === 'intro' ? INTRO_FULL_TEXT : WHY_FULL_TEXT
  const targetLen = currentText.length

  // Typing: letter by letter until full, then static 5s
  useEffect(() => {
    if (phase !== 'typing') return
    const t = setInterval(() => {
      setVisibleLength((n) => {
        if (n >= targetLen - 1) {
          clearInterval(t)
          setPhase('static')
          return targetLen
        }
        return n + 1
      })
    }, CHAR_DELAY_MS)
    return () => clearInterval(t)
  }, [phase, contentToShow, targetLen])

  // Static: hold 5s then start deleting
  useEffect(() => {
    if (phase !== 'static') return
    const t = setTimeout(() => setPhase('deleting'), STATIC_MS)
    return () => clearTimeout(t)
  }, [phase])

  // Deleting: backspace until 0, then switch to other part and start typing
  useEffect(() => {
    if (phase !== 'deleting') return
    const t = setInterval(() => {
      setVisibleLength((n) => {
        if (n <= 1) {
          clearInterval(t)
          setContentToShow((c) => (c === 'intro' ? 'why' : 'intro'))
          setPhase('typing')
          return 0
        }
        return n - 1
      })
    }, CHAR_DELAY_MS)
    return () => clearInterval(t)
  }, [phase])

  const stripCards = [...MINDSET_PAIRS, ...MINDSET_PAIRS]

  const darkGradient =
    'linear-gradient(145deg, rgb(49 46 129) 0%, rgb(55 48 163) 18%, rgb(30 58 138) 38%, rgb(21 94 117) 58%, rgb(22 78 99) 75%, rgb(30 58 138) 90%, rgb(49 46 129) 100%)'

  return (
    <div className="min-h-screen w-full pt-14 md:pt-20" style={{ background: darkGradient }}>
      <header className="flex w-full items-center justify-center px-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 md:gap-10">
          <img
            src="/logo.png"
            alt="UpHuman"
            className="h-[300px] shrink-0 object-contain opacity-95 drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] md:h-[360px]"
          />
          <div className="relative flex min-h-[200px] w-[min(100%,960px)] min-w-[360px] shrink-0 flex-col justify-center overflow-hidden py-6 md:min-h-[220px] md:w-[960px]">
            <pre className="whitespace-pre-line font-sans text-lg leading-relaxed text-white/95 md:text-xl lg:text-2xl" style={{ fontFamily: 'inherit' }}>
              <TypedHeaderText text={currentText} length={visibleLength} />
              <span className="header-caret ml-0.5 inline-block h-[1em] w-0.5 shrink-0 align-baseline bg-amber-400" aria-hidden />
            </pre>
          </div>
        </div>
      </header>

      <div className="flex w-full justify-center py-5 md:py-7">
        <Link
          to="/dailybricks"
          className="whitespace-nowrap rounded-xl bg-indigo-500 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:bg-indigo-600 hover:shadow-indigo-500/25 active:scale-[0.98] md:px-10 md:py-3.5 md:text-lg"
        >
          Start Laying Your First Brick
        </Link>
      </div>

      {/* Mindset cards: float left to right; hover = pause strip and show positive */}
      <main className="w-full overflow-hidden py-4 md:py-6">
        <h2 className="mb-3 text-center text-xl font-semibold text-white/95 md:mb-4 md:text-2xl">
          Common things inside you that leads to Failure
        </h2>
        <div
          className={`mindset-strip flex gap-4 px-4 ${hoveredIndex !== null ? 'paused' : ''}`}
          style={{ width: 'max-content' }}
        >
          {stripCards.map((pair, i) => (
            <div
              key={`${i}-${pair.negative.text}`}
              className="flex h-[120px] w-[260px] shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-white/40 hover:bg-white/20 md:h-[130px] md:w-[280px]"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="text-2xl md:text-3xl">
                {hoveredIndex === i ? pair.positive.emoji : pair.negative.emoji}
              </span>
              <p className="text-center text-sm font-medium text-white/95 transition-opacity duration-300 md:text-base">
                {hoveredIndex === i ? pair.positive.text : pair.negative.text}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
