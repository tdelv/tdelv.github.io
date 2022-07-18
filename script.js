// create web audio api context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
const oscillator = audioCtx.createOscillator();

oscillator.type = 'square';
oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
oscillator.connect(audioCtx.destination);
// oscillator.start();

const playButton = document.querySelector('.tape-controls-play');

// play pause audio
playButton.addEventListener('click', function () {
    if (!audioCtx) {
        init();
    }

    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (this.dataset.playing === 'false') {
        oscillator.start();
        this.dataset.playing = 'true';
        // if track is playing pause it
    } else if (this.dataset.playing === 'true') {
        oscillator.stop();
        this.dataset.playing = 'false';
    }

    let state = this.getAttribute('aria-checked') === "true" ? true : false;
    this.setAttribute('aria-checked', state ? "false" : "true");

}, false);