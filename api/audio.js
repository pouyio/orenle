require("dotenv").config();
const fs = require("fs");
const path = require("path");
const textToSpeech = require("@google-cloud/text-to-speech");
const credentials = require("./assets/credentials");
const client = new textToSpeech.TextToSpeechClient({ credentials });
const today = require("./src/util");

const readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = async (req, res) => {
  try {
    res.setHeader("Content-Type", "audio/mpeg");
    const q = req.query.q || today();

    const promises = [
      readFilePromise(path.resolve(__dirname + "/assets/orenle.mp3")),
      client.synthesizeSpeech({
        input: { text: q },
        voice: { languageCode: "es-ES", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3", sampleRateHertz: 44100 },
      }),
      readFilePromise(path.resolve(__dirname + "/assets/yeah.mp3")),
    ];

    const [orenleBuffer, [response], yeahBuffer] = await Promise.all(promises);

    res.setHeader(
      "Content-Length",
      orenleBuffer.length + response.audioContent.length + yeahBuffer.length
    );

    const bigBuffer = Buffer.concat([
      orenleBuffer,
      response.audioContent,
      yeahBuffer,
    ]);

    res.end(bigBuffer);
  } catch (error) {
    res.send("error");
  }
};
