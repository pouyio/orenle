require("dotenv").config();
const fs = require("fs");
const path = require("path");
const today = require("./src/util");

const URL = "https://play.ht/api/v2/tts";

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

export default async function handler(req, res) {
  try {
    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      AUTHORIZATION: process.env.AUTHORIZATION,
      "X-USER-ID": process.env.USER_ID,
    };

    const q = req.query.q || today();

    const promises = [
      readFilePromise(path.resolve(__dirname + "/assets/orenle.mp3")),
      readFilePromise(path.resolve(__dirname + "/assets/yeah.mp3")),
      fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: q,
          voice: process.env.VOICE_ID_JSON,
          quality: "medium",
          output_format: "mp3",
          speed: 1,
          sample_rate: 24000,
        }),
      })
        .then((res) => res.json())
        .then(
          (json) =>
            json._links.find((l) => l.contentType === "audio/mpeg")?.href
        ),
    ];

    const [orenleBuffer, yeahBuffer, ttsJobAudioUrl] = await Promise.all(
      promises
    );

    const response = await fetch(ttsJobAudioUrl, {
      headers,
    });

    const audioData = await response.arrayBuffer();

    const bigBuffer = Buffer.concat([
      orenleBuffer,
      Buffer.from(audioData),
      yeahBuffer,
    ]);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", bigBuffer.length);

    res.end(bigBuffer);
  } catch (error) {
    console.log(error);
    res.send("There was an error");
  }
}
