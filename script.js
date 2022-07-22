// create web audio api context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function getFreq(note) {
    return 440 * Math.pow(2, note/12);
}

const addNoteButton = document.querySelector('.add-note');
const removeNoteButton = document.querySelector('.remove-note');
const notesDiv = document.querySelector('#notes');

const notes = [];

const gainNode = audioCtx.createGain();

const volumeControl = document.querySelector('#volume');
volumeControl.addEventListener('input', function () {
    gainNode.gain.value = this.value;
}, false);

const oscillators = [];

addNoteButton.addEventListener('click', function () {
    const newNote = document.createElement("input");
    newNote.setAttribute("type", "range");
    newNote.setAttribute("min", "0");
    newNote.setAttribute("max", "12");
    newNote.setAttribute("value", "0");
    newNote.setAttribute("step", "1");
    
    const oscillator = audioCtx.createOscillator();
    oscillators.push(oscillator);
    oscillator.start();
    oscillator.connect(gainNode).connect(audioCtx.destination);
    
    newNote.addEventListener('input', function () {
        for (const anOsc of oscillators) {
            anOsc.frequency.setValueAtTime(anOsc.frequency.value, audioCtx.currentTime);
        }
        oscillator.frequency.setValueAtTime(getFreq(this.value), audioCtx.currentTime);
    }, false);
    
    notesDiv.appendChild(newNote);
    // notes.push();
});


const analyser = audioCtx.createAnalyser();

// …

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

// draw an oscilloscope of the current audio source
const canvas = document.querySelector('.visualizer');
const canvasCtx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

function draw() {

    drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {

        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
};

removeNoteButton.addEventListener('click', draw);



// // create Oscillator node
// const oscillator = audioCtx.createOscillator();

// // oscillator.type = 'square';
// oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
// oscillator.start();

// const pannerControl = document.querySelector('[data-action="panner"]');
// pannerControl.addEventListener('input', function () {
//     oscillator.frequency.setValueAtTime(getFreq(this.value * 30), audioCtx.currentTime);
// }, false);


// // volume
// const gainNode = audioCtx.createGain();

// const volumeControl = document.querySelector('[data-action="volume"]');
// volumeControl.addEventListener('input', function () {
//     gainNode.gain.value = this.value;
// }, false);

// oscillator.connect(gainNode).connect(audioCtx.destination);

// // const playButton = document.querySelector('.tape-controls-play');

// // play pause audio
// // playButton.addEventListener('click', function () {
// //     if (!audioCtx) {
// //         init();
// //     }

// //     // check if context is in suspended state (autoplay policy)
// //     if (audioCtx.state === 'suspended') {
// //         audioCtx.resume();
// //     }

// //     if (this.dataset.playing === 'false') {
// //         oscillator.connect(audioCtx.destination);
// //         this.dataset.playing = 'true';
// //         // if track is playing pause it
// //     } else if (this.dataset.playing === 'true') {
// //         oscillator.disconnect(audioCtx.destination);
// //         this.dataset.playing = 'false';
// //     }

// //     let state = this.getAttribute('aria-checked') === "true" ? true : false;
// //     this.setAttribute('aria-checked', state ? "false" : "true");

// // }, false);