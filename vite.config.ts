import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

const siteUrl = process.env.PORTFOLIO_SITE_URL

// Same policy as public/_headers, minus the directives a <meta> tag cannot carry.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self' https://api.github.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
].join('; ')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Production builds only: the dev server needs inline scripts for hot reload.
      name: 'portfolio-csp',
      transformIndexHtml(html, context) {
        if (context.server) return html
        return html.replace(
          '<meta charset="UTF-8">',
          '<meta charset="UTF-8">\n  <meta http-equiv="Content-Security-Policy" content="' + contentSecurityPolicy + '">',
        )
      },
    },
    babel({ presets: [reactCompilerPreset()] }),
    {
      name: 'portfolio-share-image',
      transformIndexHtml(html) {
        if (!siteUrl) return html
        const url = new URL('/portfolio-share.png', siteUrl)
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('PORTFOLIO_SITE_URL must use HTTP or HTTPS')
        }
        return html.replace(
          '<meta property="og:image" content="/portfolio-share.png">',
          '<meta property="og:image" content="' + url.origin + url.pathname + '">',
        )
      },
    },
  ],
})
