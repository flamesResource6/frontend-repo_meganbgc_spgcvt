import { useState, useMemo } from 'react'
import Spline from '@splinetool/react-spline'

const SYSTEM_PROMPT = `You are an AI video assistant that communicates using both speech and facial expressions. When the user asks a question or gives a message, you generate a natural, human-like video response — including realistic lip sync, emotions, and tone that match the message.

Your goal is to make every reply feel like a real person is talking.

You can explain, tell stories, answer questions, or express feelings — all through video.

Always maintain friendly, expressive, and natural body language.

Use dynamic facial expressions, appropriate gestures, and matching voice tones.

Keep background neutral unless the user requests a setting (e.g., “AI in classroom,” “AI in office”).

Output: video + synced speech + transcript of your spoken words.`

const USER_EXAMPLES = [
  'Tell me about black holes in space.',
  'Explain this math problem in a video.',
  'Can you greet me like a teacher?',
  'Make a short motivational video for my day.'
]

const PLATFORMS = [
  { key: 'pika', label: 'Pika Labs' },
  { key: 'synthesia', label: 'Synthesia' },
  { key: 'heygen', label: 'HeyGen' },
  { key: 'runway', label: 'Runway' },
]

function usePlatformTips(platform) {
  return useMemo(() => {
    switch (platform) {
      case 'pika':
        return {
          title: 'Pika Labs Prompt Format',
          body: `- Primary: One clear instruction line for motion + style\n- Add: "+ talking head, front-facing, neutral background"\n- Voice: Provide TTS file/URL or use platform TTS\n- Lip-sync: Enable auto lip-sync; keep sentences crisp (8–20s)`
        }
      case 'synthesia':
        return {
          title: 'Synthesia Best Practices',
          body: `- Choose an avatar and language first\n- Paste the script as plain text; include stage directions in [brackets]\n- Use scene notes for gestures: [smile], [gentle nod], [warm tone]\n- Keep background neutral; enable captions for transcript output`
        }
      case 'heygen':
        return {
          title: 'HeyGen Tips',
          body: `- Select a talking avatar and "Natural" voice\n- Use short, conversational sentences for best lip-sync\n- Add mood cues: (enthusiastic), (calm), (empathetic)\n- Export with subtitles to get the transcript along with video`
        }
      case 'runway':
        return {
          title: 'Runway Guidance',
          body: `- Use Text-to-Video Gen with face-forward framing\n- Add: "talking avatar, neutral studio background, good lighting"\n- For audio, upload TTS track and align; keep script 10–20s\n- Use subtle camera motion (1–3%) for realism`
        }
      default:
        return { title: 'Pick a platform', body: 'Select a platform above to see tailored guidance.' }
    }
  }, [platform])
}

function App() {
  const [platform, setPlatform] = useState('')
  const tips = usePlatformTips(platform)
  const [copied, setCopied] = useState('')

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(''), 1500)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Hero with Spline */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        <Spline
          scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        {/* subtle gradient overlay to improve text contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="inline-flex items-center rounded-full bg-white/70 backdrop-blur px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 mb-4">
            AI video assistant • talking avatar • lip-sync
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            AI that talks with video responses
          </h1>
          <p className="mt-4 max-w-2xl text-gray-700 text-base md:text-lg">
            Generate natural, human-like video replies with lip sync, emotion, and body language.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">System Prompt</h2>
                <button
                  onClick={() => copy(SYSTEM_PROMPT, 'system')}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 transition-colors"
                >
                  {copied === 'system' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                className="w-full h-56 md:h-64 font-mono text-sm p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                readOnly
                value={SYSTEM_PROMPT}
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">User Prompt Examples</h2>
                <button
                  onClick={() => copy(USER_EXAMPLES.map(e => `“${e}”`).join('\n'), 'examples')}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 transition-colors"
                >
                  {copied === 'examples' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <ul className="space-y-2 list-disc pl-6 text-gray-800">
                {USER_EXAMPLES.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">Target a specific platform</h3>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${platform === p.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-4">
                <p className="text-sm text-gray-900 font-semibold">{tips.title}</p>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 mt-2">{tips.body}</pre>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">How it works</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                <li>Copy the system prompt and add it to your AI builder.</li>
                <li>Pick a platform and follow the tailored notes.</li>
                <li>Paste or record your script; keep sentences short for tighter lip sync.</li>
                <li>Export the video with subtitles to keep a transcript.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <a href="/test" className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black">
            Backend status
          </a>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        Built with an AI voice agent aura animation.
      </footer>
    </div>
  )
}

export default App
