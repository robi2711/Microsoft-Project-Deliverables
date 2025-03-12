import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const app = next({ dev: false });
const handle = app.getRequestHandler();
const port = process.env.PORT || 8080;

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, () => {
        console.log(`> Ready on port ${port}`);
    });
});