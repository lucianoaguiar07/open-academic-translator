import { DeepSpeech } from './deepspeech.wasm';

export class STTProcessor {
  constructor() {
    this.model = new DeepSpeech('./public/models/deepspeech-0.9.3-models.pbmm');
    this.model.enableExternalScorer('./public/models/deepspeech-0.9.3-models.scorer');
  }

  async process(audioBuffer) {
    return new Promise((resolve) => {
      const text = this.model.stt(audioBuffer);
      resolve(text);
    });
  }
}