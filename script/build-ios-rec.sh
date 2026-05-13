cd ..
cp public/config/config-rec.js public/config.js
npm run buildRec
ionic cap sync ios --no-build
ionic cap open ios