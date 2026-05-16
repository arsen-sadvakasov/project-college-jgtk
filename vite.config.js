import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        admissions: resolve(__dirname, 'admissions.html'),
        specialties: resolve(__dirname, 'specialties.html'),
        policy: resolve(__dirname, 'policy.html'),
        notfound: resolve(__dirname, '404.html')
      }
    }
  }
});
