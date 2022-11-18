const { resolve } = require("path");
const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

const chunkRegExp = new RegExp("chunk\\.(js|css)(\\.|$)");
app.use(express.static("build", {
    setHeaders: (res, path) => {
        if (path.endsWith(".html")) {
            // All of the project's HTML files end in .html
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            res.setHeader("Expires", "0"); // Proxies.
        } else if (chunkRegExp.test(path)) {
            // All chunk files, cache for 1 month
            res.setHeader("Cache-Control", "max-age=2592000");
        }
    },
}));

app.get('/*', (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    res.sendFile(resolve("build", "index.html"));
});

app.listen(PORT, () => console.log(`RPG note server is running at http://localhost:${PORT}.`));
