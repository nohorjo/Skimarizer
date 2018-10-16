const express = require('express');
const os = require('os');
const path = require('path');
const cluster = require('cluster');
const { JSDOM } = require('jsdom');

const cpus = os.cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
} else {
    const app = express();

    app.get('/page', async (req, resp) => {
        const { window: { document } } = JSDOM.fromURL(req.query.url);
        resp.send(Array.from(document.querySelectorAll('p')).reduce((text, p) => text + p.innerText, ''));
    });
    app.get(['/', ''], (req, res) => res.redirect('/index.html'));
    app.use(express.static(path.join(__dirname, 'static')));

    const port = process.env.PORT || 80;
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}
