const express = require('express');
const os = require('os');
const path = require('path');
const cluster = require('cluster');
const { JSDOM } = require('jsdom');
const crawler = require('crawler-request');

const forks = process.env.FORKS || os.cpus().length;

if (forks > 1 && cluster.isMaster) {
    for (let i = 0; i < forks; i++) {
        cluster.fork();
    }
} else {
    const app = express();

    app.get('/page', async (req, resp) => {
        const { url } = req.query;
        let data;
        if (url.match(/\.pdf$/)) {
            data = (await crawler(url)).text;
        } else {
            const { window: { document } } = await JSDOM.fromURL(url);
            data = Array.from(document.querySelectorAll('p')).reduce((text, p) => text + p.innerHTML, '');
        }
        resp.send(data);
    });
    app.get(['/', ''], (req, res) => res.redirect('/index.html'));
    app.use(express.static(path.join(__dirname, 'static')));

    const port = process.env.PORT || 80;
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}
