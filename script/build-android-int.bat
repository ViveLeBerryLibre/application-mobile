cd ..
copy public\config\config-int.js public\config.js
call npm run build
call ionic cap sync android --no-build 
call ionic cap open android
::call ionic cap run android --livereload --external --target=5203f6bd514314b7 
:: Samsung A41 Gaëtan : --target=R58NC2ZXQBK