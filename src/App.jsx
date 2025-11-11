import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Volume2, VolumeX, ChevronDown } from 'lucide-react'

// Inline music player (ambient lofi). Toggle only on user interaction.
function MusicPlayer() {
  const audioRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const TRACK_URL = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_a2cfa9d4a9.mp3?filename=lofi-study-112191.mp3'

  useEffect(() => {
    const audio = new Audio(TRACK_URL)
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio
    const onCanPlay = () => setReady(true)
    audio.addEventListener('canplay', onCanPlay)
    return () => {
      audio.pause()
      audio.removeEventListener('canplay', onCanPlay)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (enabled) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [enabled])

  return (
    <button
      onClick={() => setEnabled((v) => !v)}
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white shadow-lg ring-1 ring-white/20 hover:bg-white/20 transition-colors"
      aria-label={enabled ? 'Pause ambient music' : 'Play ambient music'}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span className="hidden sm:inline">{enabled ? 'Playing' : (ready ? 'Sound' : 'Loading')}</span>
    </button>
  )
}

// Soft dust-like particles floating
function ParticleField({ className = '' }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    const createParticles = () => {
      const count = Math.floor((w * h) / 35000)
      particlesRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.35 + 0.15,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      }))
    }

    createParticles()
    const onResize = () => {
      handleResize()
      createParticles()
    }
    window.addEventListener('resize', onResize)

    const loop = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 230, 200, ${p.a})`
        ctx.shadowColor = 'rgba(255, 200, 120, 0.35)'
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

// Simple typewriter line-by-line
function Typewriter({ lines = [], speed = 35, className = '' }) {
  const [display, setDisplay] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let i = 0
    let joined = lines.join('\n')
    setDisplay('')
    const id = setInterval(() => {
      if (i >= joined.length) {
        clearInterval(id)
      } else {
        setDisplay((d) => d + joined[i])
        i++
      }
    }, speed)
    return () => clearInterval(id)
  }, [lines, speed])

  useEffect(() => {
    setIndex((v) => v + 1)
  }, [lines])

  return (
    <pre key={index} className={`whitespace-pre-wrap ${className}`}>{display}</pre>
  )
}

function Separator() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-16" />
}

function OpeningScene() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])

  return (
    <section className="relative min-h-[95vh] w-full overflow-hidden text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qMOKV671Z1CM9yS7/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b12]/60 via-[#0a0b12]/50 to-[#0a0b12]/80 pointer-events-none" />
      <ParticleField />

      <motion.div style={{ y }} className="relative z-10 max-w-3xl mx-auto px-6 pt-28 sm:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-white/80"
        >
          Sometimes silence speaks louder than noise.
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 text-4xl sm:text-6xl font-serif tracking-tight"
        >
          Hi. I’m <span className="text-amber-300">Girichandran</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.8 }}
          className="mt-6 text-white/70 max-w-prose"
        >
          A quiet space to linger. Breathe in. Scroll slowly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1.5 }}
          className="mt-16 flex items-center gap-2 text-white/60"
        >
          <ChevronDown className="animate-bounce" size={18} />
          <span>Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

function WhoIAm() {
  const { scrollYProgress } = useScroll()
  const bg = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#0b1020', '#1a1330', '#211a35']
  )

  return (
    <section className="relative w-full">
      <motion.div style={{ backgroundColor: bg }} className="absolute inset-0 -z-10" />
      <div className="max-w-4xl mx-auto px-6 py-28 sm:py-36 text-white">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2 }}
          className="font-serif text-3xl sm:text-5xl"
        >
          Who I am
        </motion.h2>
        <Separator />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.6 }}
          className="text-lg sm:text-xl leading-relaxed text-white/80"
        >
          A mind that sees stories in shadows. A heart that finds rhythm in chaos. Someone who turns quiet moments into art.
        </motion.p>
        <p className="mt-8 text-white/60 max-w-prose">
          Colors drift from night hues to the first warmth of sunrise as you move, like thoughts finding their way to light.
        </p>
      </div>
    </section>
  )
}

const collageItems = [
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop', caption: 'This was the day I learned silence is powerful.' },
  { src: 'https://images.unsplash.com/photo-1679072765523-2ec3657a9185?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxUaGlzJTIwd2FzJTIwdGhlJTIwZGF5fGVufDB8MHx8fDE3NjI4NjQ5NzF8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80', caption: 'Headphones on. The world softens.' },
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', caption: 'Rain writes its own poetry.' },
  { src: 'https://images.unsplash.com/photo-1679072765523-2ec3657a9185?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxUaGlzJTIwd2FzJTIwdGhlJTIwZGF5fGVufDB8MHx8fDE3NjI4NjQ5NzF8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80', caption: 'Code windows, inner windows.' },
  { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop', caption: 'The gym — where my mind stops talking.' },
  { src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1600&auto=format&fit=crop', caption: 'City lights, soft focus feelings.' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop', caption: 'Sunsets that teach gentle endings.' },
]

function MyWorld() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#211a35] to-[#0e1222] text-white">
      <div className="max-w-6xl mx-auto px-6 py-28 sm:py-36">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2 }}
          className="font-serif text-3xl sm:text-5xl"
        >
          My world
        </motion.h2>
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {collageItems.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-xl ring-1 ring-white/10 shadow-lg"
            >
              <img src={it.src} alt="" className="h-56 w-full object-cover transition-transform duration-[2500ms] group-hover:scale-110" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e1222] via-transparent to-transparent opacity-70" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                “{it.caption}”
              </figcaption>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ring-1 ring-amber-200/20" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

const journalEntries = [
  {
    title: 'On the calm between two rainfalls',
    lines: [
      'The world holds its breath.',
      'Windows remember the last touch of water.',
      'I walk slower, so my thoughts can catch up.'
    ],
  },
  {
    title: 'Heartbeats at the gym',
    lines: [
      'Iron, breath, focus.',
      'The noise fades until there is only rhythm.',
      'I leave lighter than I arrived.'
    ],
  },
  {
    title: 'A page in the dark',
    lines: [
      'Sometimes I write to see my own face in the mirror of words.',
      'Sometimes I close the book and let the silence speak.'
    ],
  },
]

function Journal() {
  const [index, setIndex] = useState(0)
  const entry = journalEntries[index]

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0e1222] to-[#05070f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-28 sm:py-36">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2 }}
          className="font-serif text-3xl sm:text-5xl"
        >
          The journal
        </motion.h2>
        <Separator />

        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <h3 className="font-serif text-2xl sm:text-3xl text-amber-200/90">{entry.title}</h3>
          <div className="mt-4 text-white/80 text-lg leading-relaxed min-h-[8rem]">
            <Typewriter key={index} lines={entry.lines} speed={30} />
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-white/60">
            <button
              onClick={() => setIndex((i) => (i - 1 + journalEntries.length) % journalEntries.length)}
              className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {journalEntries.map((_, i) => (
                <span key={i} className={`h-2 w-2 rounded-full ${i === index ? 'bg-amber-300' : 'bg-white/30'}`} />
              ))}
            </div>
            <button
              onClick={() => setIndex((i) => (i + 1) % journalEntries.length)}
              className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Outro() {
  return (
    <section className="relative w-full min-h-[70vh] text-white bg-gradient-to-b from-[#05070f] to-[#03040a] flex items-center">
      <ParticleField className="opacity-60" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-xl sm:text-2xl font-serif text-white/90"
        >
          “This space isn’t built to impress. It’s built to breathe.”
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-6 text-white/70"
        >
          “If you’ve felt something while scrolling… that’s all I ever wanted.”
        </motion.p>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#0a0b12] text-white selection:bg-amber-300/30 selection:text-white">
      <OpeningScene />
      <WhoIAm />
      <MyWorld />
      <Journal />
      <Outro />

      <MusicPlayer />
    </div>
  )
}
