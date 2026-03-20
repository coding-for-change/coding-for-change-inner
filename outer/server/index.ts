const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 8080;

const CMS_URL = process.env.CMS_URL || 'http://cms:3000';
const INNER_URL = process.env.INNER_URL || 'http://inner:80';

app.use(cors());
app.use(compression());

// Proxy: Payload CMS (admin, API, assets, media)
app.use(
    ['/admin', '/api', '/_next', '/media'],
    createProxyMiddleware({
        target: CMS_URL,
        changeOrigin: true,
        // Preserve the original path (don't strip the mount prefix)
        pathRewrite: (reqPath, req) => req.originalUrl,
    })
);

// Proxy: Inner site (iframe content) — strip /inner/ prefix
app.use(
    '/inner',
    createProxyMiddleware({
        target: INNER_URL,
        changeOrigin: true,
        pathRewrite: (reqPath, req) => req.originalUrl.replace(/^\/inner/, ''),
    })
);

// Serve static files for the outer 3D site
app.use(express.static(path.resolve(__dirname, '../public')));

// Catch-all: serve the outer site for any route (e.g. /events, /team)
// so the 3D scene loads and passes the path to the inner iframe
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
