cd ..
cp public/config/config-int.js public/config.js
npm run build
ionic cap sync ios --no-build
ionic cap open ios