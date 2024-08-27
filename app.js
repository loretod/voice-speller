// Initialize Google Cloud API client
gapi.load('client', initClient);

let lastSynthesizedText = '';

function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyCpK_xdcXQOnwNsZzr2Sb3uJN3I_qR-Nf8',
        discoveryDocs: [
            'https://speech.googleapis.com/$discovery/rest?version=v1',
            'https://texttospeech.googleapis.com/$discovery/rest?version=v1'
        ],
    }).then(() => {
        document.getElementById('startButton').addEventListener('click', startDictation);
        document.getElementById('repeatButton').addEventListener('click', () => synthesizeSpeech(lastSynthesizedText));
    });
}

function startDictation() {
    const startButton = document.getElementById('startButton');
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    startButton.classList.add('active');
    startButton.textContent = 'Listening...';
    recognition.start();

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        document.getElementById('output').textContent = speechResult;
        synthesizeSpeech(speechResult);
        lastSynthesizedText = speechResult;
        document.getElementById('repeatButton').style.display = 'inline-block';
    };

    recognition.onend = () => {
        startButton.classList.remove('active');
        startButton.textContent = 'Start Dictation';
    };
}

function synthesizeSpeech(text) {
    gapi.client.texttospeech.text.synthesize({
        input: { text: text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    }).then((response) => {
        const audio = new Audio(`data:audio/mp3;base64,${response.result.audioContent}`);
        audio.play();
    });
}
