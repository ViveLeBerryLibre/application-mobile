cd ..
type public\config\config-prod.js > public\config.js
call npm run buildProd
call ionic cap sync android --no-build 
call ionic cap open android