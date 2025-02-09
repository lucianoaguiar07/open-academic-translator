// src/stt/deepspeech.js
export class STTProcessor {
  constructor() {
    this.model = null;
    this.scorer = null;
    this.isReady = false;
  }

  async init() {
    if (this.isReady) return;

    // Carrega o WASM primeiro
    const wasmPath = chrome.runtime.getURL('public/models/deepspeech.wasm');
    const { DeepSpeech } = await import(wasmPath);

    // Caminhos absolutos usando chrome.runtime
    const modelPath = chrome.runtime.getURL('public/models/deepspeech-0.9.3-models.pbmm');
    const scorerPath = chrome.runtime.getURL('public/models/deepspeech-0.9.3-models.scorer');

    // Inicializa o modelo
    this.model = new DeepSpeech.Model(modelPath);
    this.model.enableExternalScorer(scorerPath);
    
    this.isReady = true;
  }

  async process(audioBuffer) {
    if (!this.isReady) await this.init();
    
    return new Promise((resolve, reject) => {
      try {
        const text = this.model.stt(audioBuffer);
        resolve(text);
      } catch (error) {
        reject(`Erro na transcrição: ${error.message}`);
      }
    });
  }
}