const URL = "https://teachablemachine.withgoogle.com/models/G1xHPJeWy/";
let lastPrediction = "";

async function createModel() {
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    const recognizer = speechCommands.create("BROWSER_FFT", undefined, checkpointURL, metadataURL);
    await recognizer.ensureModelLoaded();
    return recognizer;
}

async function init() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels();

    recognizer.listen(result => {
        const scores = result.scores;
        const maxScoreIndex = scores.indexOf(Math.max(...scores));
        const prediction = classLabels[maxScoreIndex];

        // Only update if different
        if (prediction !== lastPrediction && scores[maxScoreIndex] > 0.75) {
            lastPrediction = prediction;
            document.getElementById("current-command").innerText = `Detected: ${prediction}`;
        }
    }, {
        includeSpectrogram: false,
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: false,
        overlapFactor: 0.5
    });
}
