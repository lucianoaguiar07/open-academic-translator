export class LibreTranslator {
    constructor(endpoint = 'http://localhost:5000') {
      this.endpoint = endpoint;
    }
  
    async translate(text, targetLang) {
      const response = await fetch(`${this.endpoint}/translate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: targetLang,
          format: "text"
        })
      });
      
      return response.json().translatedText;
    }
  }