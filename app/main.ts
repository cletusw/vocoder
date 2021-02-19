import { AudioVisualizer } from "./visualizer";
import "./visualizer"; // for side effects

console.clear();


// Control elements
const playButton: HTMLButtonElement = document.querySelector('.tape-controls-play');
const powerButton: HTMLButtonElement = document.querySelector('.control-power');
const volumeControl: HTMLInputElement = document.querySelector('[data-action="volume"]');

// Audio source
const audioElement = document.querySelector('audio');

// Audio context
const audioContext = new AudioContext();
const audioSource = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();


const analyser = audioContext.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
analyser.fftSize = 512;
var bufferLength = analyser.frequencyBinCount;

// connect our graph
audioSource
  .connect(analyser)
  .connect(gainNode)
  .connect(audioContext.destination);


// const bufferLength = analyser.frequencyBinCount;
// console.log('---', bufferLength);
// const dataArray = new Float32Array(bufferLength);

// function draw() {
//   setTimeout(() => {
//     // requestAnimationFrame(draw);
//   }, 1000);

//   analyser.getFloatFrequencyData(dataArray);
//   console.log(dataArray);
//   // var barHeight;
//   // for (const item of dataArray) {
//   //   console.log(item);
//   // }
//   // for(var i = 0; i < bufferLength; i++) {
//   //   barHeight = (dataArray[i] + 140)*2;
//   //   console.log
//   // }
// };

// draw();

console.log(bufferLength, 'aaa');
var dataArray = new Float32Array(bufferLength);

const visualizer = document.querySelector('.visualizer') as AudioVisualizer;

let counter = 0;

function draw() {
  requestAnimationFrame(draw);

  analyser.getFloatFrequencyData(dataArray);

  visualizer.render(dataArray);

  if (++counter > 60 * 5) {
    counter = 0;
    console.log(dataArray);

    const loudestFrequencyBinIndex = findLoudestFrequencyBin(dataArray);
    console.log(loudestFrequencyBinIndex, dataArray[loudestFrequencyBinIndex]);
  }
};

draw();

function findLoudestFrequencyBin(dataArray: Float32Array) {
  let maxValue = -Infinity;
  let maxIndex = -1;
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i] > maxValue) {
      maxValue = dataArray[i];
      maxIndex = i;
    }
  }
  return maxIndex;
}




// Control listeners

// play pause audio
playButton.addEventListener('click', () => {
  // check if context is in suspended state (autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
    powerButton.dataset.power = 'on';
  }

  if (playButton.dataset.playing === 'false') {
    audioElement.play();
    playButton.dataset.playing = 'true';
    // if track is playing pause it
  } else if (playButton.dataset.playing === 'true') {
    audioElement.pause();
    playButton.dataset.playing = 'false';
  }
});

// if track ends
audioElement.addEventListener('ended', () => {
  playButton.dataset.playing = 'false';
});

volumeControl.addEventListener('input', () => {
  gainNode.gain.value = Number(volumeControl.value);
});

powerButton.addEventListener('click', () => {
  if (powerButton.dataset.power === 'on') {
    audioContext.suspend();
    powerButton.dataset.power = 'off';
  } else if (powerButton.dataset.power === 'off') {
    audioContext.resume();
    powerButton.dataset.power = 'on';
  }
});

// Track credit: Outfoxing the Fox by Kevin MacLeod under Creative Commons 



