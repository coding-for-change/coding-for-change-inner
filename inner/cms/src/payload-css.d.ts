// Payload's auto-generated (payload) layout/page files do a side-effect import of
// `@payloadcms/next/css`, whose package export maps to a plain `.css` asset with no
// type declarations. TypeScript 6 type-checks side-effect imports and errors on the
// missing declaration ("Cannot find module or type declarations for side-effect
// import of '@payloadcms/next/css'"). This ambient declaration satisfies the check.
declare module '@payloadcms/next/css';

// Same for our own global stylesheet side-effect imports (e.g. the analytics
// dashboard's dashboard.css) — Next bundles them; TS just needs a declaration.
declare module '*.css';
