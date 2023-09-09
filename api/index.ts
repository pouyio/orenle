import pug from "pug";
import path from "path";
import today from "./src/util";
import { handler } from "./audio.js";

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      const day = new URL(req.url).searchParams.get("q") ?? today();
      return new Response(
        pug.renderFile(path.join(__dirname, "/assets/template.pug"), {
          day,
        }),
        { headers: { "Content-Type": "text/html" } }
      );
    }
    if (url.pathname === "/audio") {
      return handler(req);
    }
    return new Response(`404!`);
  },
});
