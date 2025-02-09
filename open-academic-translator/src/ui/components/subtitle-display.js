customElements.define('subtitle-display', class extends HTMLElement {
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
            font-size: 1.5em;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
            max-width: 80%;
            text-align: center;
          }
        </style>
        <div part="text"></div>
      `;
    }
  
    set text(content) {
      this.shadowRoot.querySelector('div').textContent = content;
    }
  });