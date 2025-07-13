import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Clipify',
    description: 'Web content clipper - Convert, extract, and save web pages in multiple formats',
    permissions: ['activeTab', 'clipboardWrite', 'tabs'],
  },
});
