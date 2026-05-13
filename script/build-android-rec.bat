cd ..
type public\config\config-rec.js > public\config.js
call npm run buildRec
call ionic cap sync android --no-build 
call ionic cap open android