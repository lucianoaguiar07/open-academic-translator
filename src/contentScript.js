// contentScript.js
class YouTubeTranslator {
    constructor() {
      this.subtitleContainer = null;
      this.init();
    }
  
    init() {
      // Criar container de legendas
      this.createSubtitleContainer();
      
      // Monitorar alterações no player
      const observer = new MutationObserver(this.handlePlayerChanges.bind(this));
      observer.observe(document, { childList: true, subtree: true });
    }
  
    createSubtitleContainer() {
      this.subtitleContainer = document.createElement('div');
      Object.assign(this.subtitleContainer.style, {
        position: 'fixed',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '24px',
        textShadow: '2px 2px 4px black',
        zIndex: 9999
      });
      document.body.appendChild(this.subtitleContainer);
    }
  
    async handlePlayerChanges() {
      const video = document.querySelector('video');
      if (!video) return;
  
      // Capturar áudio
      const audioStream = video.captureStream();
      const audioProcessor = new AudioProcessor();
      const transcribedText = await audioProcessor.process(audioStream);
      
      // Traduzir texto
      const translated = await this.translateText(transcribedText);
      
      // Atualizar legendas
      this.subtitleContainer.textContent = translated;
    }
  
    async translateText(text) {
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
        console.error('Erro na tradução:', error);
        return "Tradução indisponível";
      }
    }
  }
  
  class AudioProcessor {
    async process(stream) {
      // Implementação do processamento de áudio com DeepSpeech
      // (Requer integração com o modelo STT)
      return "Texto transcrito do áudio"; // Placeholder
    }
  }
  
  // Iniciar quando a página carregar
  new YouTubeTranslator();