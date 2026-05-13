cd ..
cp public/config/config-prod.js public/config.js
npm run buildProd
ionic cap sync ios --no-build
ionic cap open ios