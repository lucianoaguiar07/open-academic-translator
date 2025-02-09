class EducationalSubtitles extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: fixed;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 1.2em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
            text-align: center;
          }
        </style>
        <div id="subtitle">🚀 Aprendendo sem fronteiras!</div>
      `;
    }
  
    update(text) {
      this.shadowRoot.getElementById('subtitle').textContent = text;
    }
  }
  
  customElements.define('educational-subtitles', EducationalSubtitles);