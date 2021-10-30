const pug = require("pug");
const path = require("path");
const today = require("./src/util");

module.exports = (req, res) => {
  const {
    query: { q = today() },
  } = req;

  res.send(
    pug.renderFile(path.join(__dirname, "/assets/template.pug"), {
      day: q,
    })
  );
};
