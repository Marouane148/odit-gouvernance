@echo off
set DB_HOST=127.0.0.1
set DB_PORT=5432
set DB_USERNAME=postgres
set DB_PASSWORD=oditgouvernance123456
set DB_DATABASE=charges_locatives
set PORT=3000
set NODE_ENV=development
set FRONTEND_URL=http://localhost:3000
set JWT_SECRET=your-super-secret-key-here
set JWT_EXPIRES_IN=1d
set RATE_LIMIT_WINDOW=15
set RATE_LIMIT_MAX=100
npm run start:dev
npm test
cd "C:\OditGouvernnace_App web SaaS\backend"
npm install 