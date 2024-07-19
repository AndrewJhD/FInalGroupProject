import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const LOCAL_AUTH = "http://localhost:6001";
export default defineConfig({
    plugins: [react()],
    server: {
        port: 6006,
        proxy: {           
            "/register": LOCAL_AUTH,
            "/login": LOCAL_AUTH,
        },
    },
});