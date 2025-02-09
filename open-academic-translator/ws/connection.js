export class WSConnection {
    constructor() {
      this.ws = new WebSocket('ws://localhost:3000');
      this.buffer = new CircularBuffer(10); // Armazena últimos 10 segmentos
    }
  
    sendTranslation(translation) {
      this.ws.send(JSON.stringify({
        text: translation,
        timestamp: Date.now()
      }));
    }
  
    async receiveTranslations() {
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.buffer.push(data);
      };
    }
  }
  
  class CircularBuffer {
    constructor(size) {
      this.size = size;
      this.buffer = [];
    }
  
    push(item) {
      if (this.buffer.length >= this.size) this.buffer.shift();
      this.buffer.push(item);
    }
  }