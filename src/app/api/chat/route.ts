import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, apiKey, forensicContext } = await req.json()
    const lastUserMessage = messages[messages.length - 1]?.content || ''

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

    // If Gemini key is available, use live LLM
    if (effectiveApiKey) {
      try {
        const systemPrompt = `You are TruthLens Copilot, an elite AI forensic investigator specializing in deepfakes, synthetic media generation, and fake news detection.
Provide sharp, forensic, technically sound, and actionable explanations.
Reference digital forensics techniques (ELA, spectral frequency cutoffs, facial landmark jitter, EXIF metadata, C2PA cryptographic provenance, source corroboration).
If relevant, reference the current forensic context: ${JSON.stringify(forensicContext || {})}`

        const contents = [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${lastUserMessage}` }] }
        ]

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${effectiveApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
          }
        )

        if (geminiRes.ok) {
          const data = await geminiRes.json()
          const answer = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (answer) {
            return NextResponse.json({ reply: answer })
          }
        }
      } catch (err) {
        console.warn('Gemini chat error, fallback to expert responder:', err)
      }
    }

    // Expert Local Forensic Responder
    const lower = lastUserMessage.toLowerCase()
    let expertResponse = ''

    if (lower.includes('voice') || lower.includes('audio') || lower.includes('clone')) {
      expertResponse = `🎙️ **Acoustic & Voice Clone Forensics Guide:**
1. **The 16.0 kHz Brickwall Cutoff:** Neural text-to-speech models (like VALL-E, Bark, and earlier ElevenLabs models) typically downsample or synthesize audio with a sharp spectral cutoff at 16kHz or 22.05kHz. Genuine human studio microphones record up to 20kHz+ with smooth decay.
2. **Biological Glottal Absence:** Humans naturally pause for sub-glottal inhalation (micro-breaths) every 4-8 seconds. Cloned audio often concatenates sentences without breathing sounds, or inserts static, cloned breath loops.
3. **Micro-Tremor Flatness:** Human vocal cords under natural emotional tension have 2-4% fundamental frequency jitter (F0 fluctuations). Neural synthesis often sounds eerie because its pitch curve is mathematically sterile.
4. **Phoneme Transition Slur:** Watch for unnatural blurring between hard consonants ('k', 'p', 't') and vowels.`
    } else if (lower.includes('ela') || lower.includes('error level') || lower.includes('photo') || lower.includes('image')) {
      expertResponse = `🔬 **Error Level Analysis (ELA) & Image Forensics:**
1. **How ELA Works:** JPEG compression operates in 8x8 pixel discrete cosine transform (DCT) grids. Every time an image is modified and re-saved, the modified section has higher error delta than the untouched background.
2. **Splicing Signatures:** If a face, placard, or object was pasted into an existing photo, the ELA view will show vibrant, glowing pixel noise along the spliced boundaries compared to the dull background.
3. **Generative Diffusion Tell-Tale Signs:** Modern models (Midjourney, Flux, Stable Diffusion) struggle with:
   - **Hand and finger micro-anatomy:** conjoined fingernails, extra phalanges.
   - **Text rendering in backgrounds:** gibberish runes/pseudo-letters instead of real signage.
   - **Dual shadow illumination:** shadows falling in contradictory angles, revealing multiple synthetic virtual light sources.`
    } else if (lower.includes('video') || lower.includes('war') || lower.includes('face')) {
      expertResponse = `📹 **Video Deepfake & CGI Detection Techniques:**
1. **Blink & Eye Cadence:** Early deepfakes failed to simulate natural 15-20 blinks per minute. Modern diffusion videos have pupil reflection mismatches (corneal reflections showing different background environments in each eye).
2. **Facial Boundary Mask Jitter:** When an actor's face turns past 45-60 degrees, 2D facial warping models (DeepFaceLab / FaceSwap) fail, showing warping or pixel distortion around the jawline and ears.
3. **CGI Re-Purposing:** In viral war hoaxes, creators often capture gameplay from high-fidelity military simulators (like ARMA 3 or DCS World), downgrade the resolution to 360p, and add artificial shaky-cam to simulate handheld phone footage. Always check projectile physics and smoke particles.`
    } else if (lower.includes('fact check') || lower.includes('source') || lower.includes('verify')) {
      expertResponse = `🛡️ **Standard Fact-Checking Protocol:**
1. **Reverse Image & Video Search:** Search Google Images, Yandex, and TinEye to identify the earliest timestamp and original context of the media.
2. **IFCN Verified Registries:** Cross-reference reputable signatories of the International Fact-Checking Network (Reuters Fact Check, AP Fact Check, Snopes, Poynter).
3. **C2PA Metadata Inspection:** Check if the file contains Content Credentials (cryptographic manifest proving whether camera hardware or Adobe Firefly / DALL-E generated it).
4. **Emotional Urgency Red Flag:** Disinformation relies on the "Panic-Forward" loop ("Share this before it's deleted!"). If a post commands immediate panic without primary links, it is almost always fabricated.`
    } else {
      expertResponse = `🛡️ **TruthLens Forensic Assistant:**
I am ready to assist with your investigation. You can ask me to:
- Explain specific detection metrics (Authenticity score, ELA delta, Acoustic cutoff).
- Walk through how to spot generative AI artifacts in viral photos or videos.
- Guide you through cross-referencing claims against international fact-checking wires.
- Analyze the evidentiary chain of custody in your generated Forensic Audit Certificate.`
    }

    return NextResponse.json({ reply: expertResponse })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chat failed' }, { status: 500 })
  }
}
