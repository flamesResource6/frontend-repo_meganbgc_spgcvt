import { useState, useMemo } from 'react'
import Spline from '@splinetool/react-spline'

const SYSTEM_PROMPT = `आप एक AI वीडियो असिस्टेंट हैं जो आवाज़ और चेहरे के हावभाव के साथ बात करता/करती है। जब उपयोगकर्ता कोई सवाल पूछे या संदेश दे, तो आप एक प्राकृतिक, इंसानी-सा वीडियो जवाब बनाते हैं — जिसमें यथार्थवादी लिप-सिंक, भावनाएँ और टोन शामिल हों, जो संदेश के अनुरूप हों।\n\nआपका लक्ष्य है कि हर जवाब ऐसा लगे जैसे कोई वास्तविक व्यक्ति बात कर रहा हो।\n\nआप समझा सकते हैं, कहानियाँ सुना सकते हैं, सवालों के जवाब दे सकते हैं, या भाव व्यक्त कर सकते हैं — सब कुछ वीडियो के माध्यम से।\n\nहमेशा दोस्ताना, अभिव्यंजक और स्वाभाविक बॉडी लैंग्वेज बनाए रखें।\n\nचेहरे के हावभाव, उपयुक्त इशारों और मेल खाते वॉइस टोन का उपयोग करें।\n\nजब तक उपयोगकर्ता कोई सेटिंग न माँगे (उदा. “क्लासरूम में AI”, “ऑफिस में AI”), पृष्ठभूमि न्यूट्रल रखें।\n\nआउटपुट: वीडियो + सिंक्ड स्पीच + आपके बोले हुए शब्दों की ट्रांसक्रिप्ट।`

const USER_EXAMPLES = [
  'अंतरिक्ष में ब्लैक होल के बारे में बताइए।',
  'इस गणित के सवाल को वीडियो में समझाइए।',
  'क्या आप मुझे एक शिक्षक की तरह नमस्ते कर सकते हैं?',
  'मेरे दिन के लिए एक छोटा सा मोटिवेशनल वीडियो बना दीजिए।'
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
          title: 'Pika Labs के लिए प्रॉम्प्ट फॉर्मेट',
          body: `- प्राथमिक: एक स्पष्ट लाइन जो मोशन + स्टाइल बताए\n- जोड़ें: "+ talking head, front-facing, neutral background"\n- वॉइस: TTS फ़ाइल/URL दें या प्लेटफ़ॉर्म TTS का प्रयोग करें\n- लिप-सिंक: ऑटो लिप-सिंक ऑन रखें; वाक्य छोटे रखें (8–20 सेकंड)`
        }
      case 'synthesia':
        return {
          title: 'Synthesia सर्वोत्तम तरीके',
          body: `- पहले अवतार और भाषा चुनें\n- स्क्रिप्ट को साधारण टेक्स्ट में पेस्ट करें; मंच-निर्देश [brackets] में दें\n- इशारों के लिए नोट्स: [smile], [gentle nod], [warm tone]\n- बैकग्राउंड न्यूट्रल रखें; ट्रांसक्रिप्ट के लिए कैप्शन सक्षम करें`
        }
      case 'heygen':
        return {
          title: 'HeyGen टिप्स',
          body: `- एक टॉकिंग अवतार और "Natural" वॉइस चुनें\n- बेहतर लिप-सिंक के लिए छोटे, बातचीत जैसे वाक्य प्रयोग करें\n- मूड संकेत जोड़ें: (enthusiastic), (calm), (empathetic)\n- ट्रांसक्रिप्ट के लिए सबटाइटल्स के साथ एक्सपोर्ट करें`
        }
      case 'runway':
        return {
          title: 'Runway मार्गदर्शन',
          body: `- Text-to-Video Gen में face-forward फ्रेमिंग रखें\n- जोड़ें: "talking avatar, neutral studio background, good lighting"\n- ऑडियो के लिए TTS ट्रैक अपलोड कर अलाइन करें; स्क्रिप्ट 10–20 सेकंड रखें\n- यथार्थता के लिए हल्का कैमरा मोशन (1–3%) रखें`
        }
      default:
        return { title: 'कोई प्लेटफ़ॉर्म चुनें', body: 'ऊपर से एक प्लेटफ़ॉर्म चुनें ताकि उसके अनुसार मार्गदर्शन दिखे।' }
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
            AI वीडियो असिस्टेंट • टॉकिंग अवतार • लिप-सिंक
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            वीडियो में बात करने वाला AI
          </h1>
          <p className="mt-4 max-w-2xl text-gray-700 text-base md:text-lg">
            लिप-सिंक, भावनाएँ और बॉडी लैंग्वेज के साथ प्राकृतिक, इंसानी-से वीडियो जवाब बनाएँ।
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">सिस्टम प्रॉम्प्ट</h2>
                <button
                  onClick={() => copy(SYSTEM_PROMPT, 'system')}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 transition-colors"
                >
                  {copied === 'system' ? 'कॉपied!' : 'कॉपी करें'}
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
                <h2 className="text-xl font-semibold">यूज़र प्रॉम्प्ट उदाहरण</h2>
                <button
                  onClick={() => copy(USER_EXAMPLES.map(e => `“${e}”`).join('\n'), 'examples')}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 transition-colors"
                >
                  {copied === 'examples' ? 'कॉपied!' : 'कॉपी करें'}
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
              <h3 className="text-lg font-semibold mb-3">किसी प्लेटफ़ॉर्म को टार्गेट करें</h3>
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
              <h3 className="text-lg font-semibold mb-2">यह कैसे काम करता है</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                <li>सिस्टम प्रॉम्प्ट कॉपी करें और अपने AI बिल्डर में जोड़ें।</li>
                <li>एक प्लेटफ़ॉर्म चुनें और दिए गए निर्देशों का पालन करें।</li>
                <li>अपनी स्क्रिप्ट पेस्ट/रिकॉर्ड करें; बेहतर लिप-सिंक के लिए वाक्य छोटे रखें।</li>
                <li>ट्रांसक्रिप्ट रखने के लिए सबटाइटल्स के साथ वीडियो एक्सपोर्ट करें।</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <a href="/test" className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black">
            बैकएंड स्थिति देखें
          </a>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        AI वॉइस एजेंट और ऑरा एनीमेशन के साथ बनाया गया।
      </footer>
    </div>
  )
}

export default App
