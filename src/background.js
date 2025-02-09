import { AcademicAudioCapture } from './audio/capture.js';
import { StudentSTT } from './stt/deepspeech.js';
import { AcademicTranslator } from './translation/libretranslate.js';

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'START_TRANSLATION') {
    startTranslationPipeline(request.targetLang);
  }
});

async function startTranslationPipeline(targetLang) {
  const audioCapture = new AcademicAudioCapture();
  const sttEngine = new StudentSTT();
  const translator = new AcademicTranslator();
  
  await audioCapture.start();
  
  audioCapture.onAudioChunk = async (audioData) => {
    const text = await sttEngine.transcribe(audioData);
    const translation = await translator.translate(text, targetLang);
    
    chrome.tabs.query({ active: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: updateSubtitles,
        args: [translation]
      });
    });
  };
}

function updateSubtitles(text) {
  const subtitles = document.querySelector('educational-subtitles') || 
    document.createElement('educational-subtitles');
  subtitles.update(text);
  document.body.appendChild(subtitles);
}