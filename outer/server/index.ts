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

// Proxy: Inner site (iframe content) — strip /inner/ prefix.
// noindex header so the iframe URL doesn't compete with the homepage in search.
app.use(
    '/inner',
    createProxyMiddleware({
        target: INNER_URL,
        changeOrigin: true,
        pathRewrite: (reqPath, req) => req.originalUrl.replace(/^\/inner/, ''),
        on: {
            proxyRes: (proxyRes) => {
                proxyRes.headers['x-robots-tag'] = 'noindex, nofollow';
            },
        },
    })
);

// SEO: serve a real text/plain robots.txt before the SPA catch-all
app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(
        'User-agent: *\nAllow: /\n\nSitemap: https://codingforchange.com/sitemap.xml\n'
    );
});

// SEO: serve a real sitemap.xml listing the inner app's actual routes
app.get('/sitemap.xml', (req, res) => {
    const lastmod = new Date().toISOString().slice(0, 10);
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://codingforchange.com/</loc><lastmod>${lastmod}</lastmod><priority>1.0</priority></url>
  <url><loc>https://codingforchange.com/about</loc><lastmod>${lastmod}</lastmod><priority>0.8</priority></url>
  <url><loc>https://codingforchange.com/team</loc><lastmod>${lastmod}</lastmod><priority>0.8</priority></url>
  <url><loc>https://codingforchange.com/projects</loc><lastmod>${lastmod}</lastmod><priority>0.8</priority></url>
  <url><loc>https://codingforchange.com/join</loc><lastmod>${lastmod}</lastmod><priority>0.8</priority></url>
  <url><loc>https://codingforchange.com/contact</loc><lastmod>${lastmod}</lastmod><priority>0.7</priority></url>
  <url><loc>https://codingforchange.com/events</loc><lastmod>${lastmod}</lastmod><priority>0.6</priority></url>
  <url><loc>https://codingforchange.com/sponsors</loc><lastmod>${lastmod}</lastmod><priority>0.5</priority></url>
  <url><loc>https://codingforchange.com/qa</loc><lastmod>${lastmod}</lastmod><priority>0.5</priority></url>
</urlset>
`);
});

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
