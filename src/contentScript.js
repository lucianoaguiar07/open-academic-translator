// contentScript.js
import { STTProcessor } from './stt/deepspeech.js';

class YouTubeTranslator {
  constructor() {
    this.subtitleContainer = null;
    this.stt = new STTProcessor();
    this.audioContext = null;
    this.init();
  }

  init() {
    this.createSubtitleContainer();
    this.setupAudioPipeline();
    this.observeVideoPlayer();
  }

  createSubtitleContainer() {
    this.subtitleContainer = document.createElement('div');
    Object.assign(this.subtitleContainer.style, {
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      fontSize: '24px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: 10000,
      maxWidth: '80%',
      textAlign: 'center'
    });
    document.body.appendChild(this.subtitleContainer);
  }

  setupAudioPipeline() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  observeVideoPlayer() {
    const observer = new MutationObserver((mutations) => {
      const video = document.querySelector('video');
      if (video && !video.dataset.listenerAdded) {
        this.setupAudioProcessing(video);
        video.dataset.listenerAdded = 'true';
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupAudioProcessing(video) {
    const stream = video.captureStream();
    const source = this.audioContext.createMediaStreamSource(stream);
    
    const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    source.connect(processor);
    processor.connect(this.audioContext.destination);

    let buffer = [];
    const BUFFER_DURATION = 2000; // 2 segundos de buffer

    processor.onaudioprocess = async (e) => {
      const audioData = e.inputBuffer.getChannelData(0);
      buffer = buffer.concat(Array.from(audioData));

      // Processar a cada 2 segundos de áudio
      if (buffer.length >= this.audioContext.sampleRate * (BUFFER_DURATION / 1000)) {
        const audioBuffer = new Float32Array(buffer);
        buffer = []; // Reset buffer
        
        try {
          const text = await this.stt.process(audioBuffer);
          const translated = await this.translateText(text);
          this.updateSubtitles(translated);
        } catch (error) {
          console.error('Processing error:', error);
        }
      }
    };
  }

  async translateText(text) {
    if (!text.trim()) return '';
    
    try {
      const response = await fetch('http://localhost:5000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: "pt",
          format: "text"
        })
      });
      
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return "🚫 Erro na tradução";
    }
  }

  updateSubtitles(text) {
    this.subtitleContainer.textContent = text;
    this.subtitleContainer.style.display = 'block';
    
    // Fade-out automático após 5 segundos
    clearTimeout(this.fadeTimer);
    this.fadeTimer = setTimeout(() => {
      this.subtitleContainer.style.display = 'none';
    }, 5000);
  }
}

// Inicialização segura
document.addEventListener('yt-navigate-finish', () => {
  if (!document.querySelector('#yt-translator-subtitles')) {
    new YouTubeTranslator();
  }
});