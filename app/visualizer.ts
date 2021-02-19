const template = document.getElementById('audio-visualizer-template') as HTMLTemplateElement;

export class AudioVisualizer extends HTMLElement {
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.canvas = shadowRoot.querySelector('.visualizer');
    this.canvasContext = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  connectedCallback() {
    this.canvasContext.clearRect(0, 0, this.width, this.height);
  }

  render(dataArray: Float32Array) {
    // if (count++ > 100) {
    //   count = 0;
    //   console.log('f');
    // }
    const bufferLength = dataArray.length;
    this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
    this.canvasContext.fillRect(0, 0, this.width, this.height);

    let numBarsToShow = bufferLength / 3; // We only show bars for the low frequency bins since the higher ones usually don't contain useful data
    var barWidth = this.width / numBarsToShow - 1; // Leave 1 px space between bars
    var barHeight;
    var x = 0;

    for(var i = 0; i < numBarsToShow; i++) {
      barHeight = (dataArray[i] + 140)*2;
      
      this.canvasContext.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
      this.canvasContext.fillRect(x,this.height-barHeight/2,barWidth,barHeight/2);

      x += barWidth + 1;
    }
  }
}

customElements.define('audio-visualizer', AudioVisualizer);
