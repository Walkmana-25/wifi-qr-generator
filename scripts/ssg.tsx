import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import '../src/i18n';

const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath}. Run vite build first.`);
}

const html = fs.readFileSync(indexPath, 'utf-8');
const appHtml = renderToString(
  React.createElement(React.StrictMode, null, React.createElement(App))
);
const rootPlaceholder = '<div id="root"></div>';

if (!html.includes(rootPlaceholder)) {
  throw new Error(
    `Could not find root placeholder "${rootPlaceholder}" in ${indexPath}. ` +
      'The built index.html markup may have changed; update scripts/ssg.tsx or the template accordingly.'
  );
}

const hydrated = html.replace(rootPlaceholder, `<div id="root">${appHtml}</div>`);

fs.writeFileSync(indexPath, hydrated, 'utf-8');
