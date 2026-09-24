'use client'

import React, { useState } from 'react'
import {
  Code2,
  Cpu,
  Layers,
  Check,
  Copy,
  Terminal,
  Sparkles,
  GitBranch,
  Database,
  ArrowRight
} from 'lucide-react'

export function PythonMlArchitecture() {
  const [activeCodeTab, setActiveCodeTab] = useState<'classifier' | 'ela' | 'audio' | 'pipeline'>('classifier')
  const [copied, setCopied] = useState(false)

  const CODE_SNIPPETS = {
    classifier: `# 1. PassiveAggressiveClassifier with TF-IDF Vectorizer
# As taught in the Founderz AI Engineering Curriculum

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

# Load dataset (True/Fake labeled news)
df = pd.read_csv('news_dataset.csv')
labels = df.label  # 'REAL' or 'FAKE'

# Train/Test Split (80/20)
x_train, x_test, y_train, y_test = train_test_split(
    df['text'], labels, test_size=0.2, random_state=42
)

# Initialize TfidfVectorizer with English stop words & max document frequency
tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_df=0.7)
tfidf_train = tfidf_vectorizer.fit_transform(x_train)
tfidf_test = tfidf_vectorizer.transform(x_test)

# Train PassiveAggressiveClassifier (Optimal for real-time streaming data)
pac = PassiveAggressiveClassifier(max_iter=50, C=0.5)
pac.fit(tfidf_train, y_train)

# Predict & Evaluate Accuracy
y_pred = pac.predict(tfidf_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Precision: {accuracy * 100:.2f}%")
print("Confusion Matrix:\\n", confusion_matrix(y_test, y_pred))`,

    ela: `# 2. Error Level Analysis (ELA) Image Forensics in Python
from PIL import Image, ImageChops, ImageEnhance
import numpy as np

def compute_ela(image_path, quality=75, scale=20):
    """
    Computes Error Level Analysis to detect image splicing & diffusion infill.
    """
    original = Image.open(image_path).convert('RGB')
    
    # Save as temporary lossy JPEG baseline
    resaved_path = 'temp_ela_resaved.jpg'
    original.save(resaved_path, 'JPEG', quality=quality)
    resaved = Image.open(resaved_path)
    
    # Calculate pixel-by-pixel difference
    ela_image = ImageChops.difference(original, resaved)
    
    # Amplify difference to visualize manipulated compression blocks
    extrema = ela_image.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    scale_factor = scale if max_diff == 0 else 255.0 / max_diff
    
    enhancer = ImageEnhance.Brightness(ela_image)
    ela_amplified = enhancer.enhance(scale_factor)
    return ela_amplified`,

    audio: `# 3. Acoustic Spectrogram & 16.0 kHz Neural Vocoder Cutoff
import librosa
import numpy as np

def detect_voice_clone_cutoff(audio_path):
    """
    Detects the 16.0 kHz brickwall cutoff typical of ElevenLabs / VALL-E models.
    """
    # Load audio at native sampling rate
    y, sr = librosa.load(audio_path, sr=None)
    
    # Compute Short-Time Fourier Transform (STFT)
    stft = np.abs(librosa.stft(y))
    freqs = librosa.fft_frequencies(sr=sr)
    
    # Find spectral power above 16.0 kHz
    cutoff_idx = np.where(freqs >= 16000)[0][0]
    high_freq_power = np.mean(stft[cutoff_idx:, :])
    low_freq_power = np.mean(stft[:cutoff_idx, :])
    
    ratio = high_freq_power / (low_freq_power + 1e-6)
    is_synthetic = ratio < 0.015  # Synthetic speech exhibits abrupt void
    
    return {
        "is_synthetic_clone": is_synthetic,
        "high_freq_ratio": float(ratio),
        "cutoff_threshold_hz": 16000
    }`,

    pipeline: `# 4. Complete Multimodal Fusion Triage Pipeline
class TruthLensTriageEngine:
    def __init__(self, nlp_model, ifcn_registry):
        self.nlp = nlp_model
        self.registry = ifcn_registry

    def triage_content(self, raw_input, modality='text'):
        # Step 1: Feature Extraction
        # Step 2: Classifier Inference
        # Step 3: IFCN Fact-Checking Cross-Verification
        # Step 4: Human-in-the-Loop Threshold Check
        pass`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeCodeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-400">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Founderz Technical Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          The Python Machine Learning Architecture
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          How to build the core AI detection layers described in the Founderz curriculum: from scikit-learn TF-IDF classifiers to Error Level Analysis and acoustic spectral filters.
        </p>
      </div>

      {/* 4-Step Visual Flowchart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { step: '01', title: 'Data Ingestion & Tokenization', desc: 'Tokenizing article corpora, cleaning punctuation, and mapping linguistic tokens.' },
          { step: '02', title: 'TF-IDF Vectorization', desc: 'Extracting n-gram word frequency matrices and penalizing common stopwords.' },
          { step: '03', title: 'Passive-Aggressive Classifier', desc: 'Training online linear models that adapt to emerging clickbait syntax without retraining.' },
          { step: '04', title: 'Multimodal Fusion & Registry', desc: 'Fusing ELA image maps and IFCN wire corroboration into a unified confidence score.' },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono font-black text-amber-400">STAGE {item.step}</span>
            <h4 className="text-xs font-bold text-white">{item.title}</h4>
            <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive Code Console */}
      <div className="rounded-3xl bg-[#090e1a] border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Code Tabs Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'classifier', label: '1. Scikit-Learn PAC' },
              { id: 'ela', label: '2. Python ELA Forensics' },
              { id: 'audio', label: '3. Spectrogram 16kHz' },
              { id: 'pipeline', label: '4. Triage Pipeline' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeCodeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Python</span>
              </>
            )}
          </button>
        </div>

        {/* Code View */}
        <div className="p-4 sm:p-6 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed bg-[#060a14]">
          <pre>
            <code>{CODE_SNIPPETS[activeCodeTab]}</code>
          </pre>
        </div>

      </div>

    </div>
  )
}
