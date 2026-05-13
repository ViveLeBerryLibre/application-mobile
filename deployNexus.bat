@echo off
SET VERSIONAJOUR=N
set /p VERSIONAJOUR="Avant ce lancer ce script, avez-vous verifie que l'arborescence des fichiers est bien respectee et que la version dans le pom.xml est bien celle que vous voulez envoyer ? (Y/[N]) :   "
if /I "%VERSIONAJOUR%" NEQ "Y" GOTO :END

set /p VERSION="Quel est le numero de version que vous souhaitez deployer ? (Ex: 1.1.0) : "

::On récupère les différents packages présent
for /f "delims=" %%a in ('dir /b /a-d .\packages\INT\ANDROID\') do if %%a NEQ .gitignore set "IntAndroid=%%a"
for /f "delims=" %%a in ('dir /b /a-d .\packages\INT\IOS\') do if %%a NEQ .gitignore set "IntIos=%%a"
for /f "delims=" %%a in ('dir /b /a-d .\packages\REC\ANDROID\') do if %%a NEQ .gitignore set "RecAndroid=%%a"
for /f "delims=" %%a in ('dir /b /a-d .\packages\REC\IOS\') do if %%a NEQ .gitignore set "RecIos=%%a"
for /f "delims=" %%a in ('dir /b /a-d .\packages\PROD\ANDROID\') do if %%a NEQ .gitignore set "ProdAndroid=%%a"
for /f "delims=" %%a in ('dir /b /a-d .\packages\PROD\IOS\') do if %%a NEQ .gitignore set "ProdIos=%%a"

::On construit les variables qui vont contenir les différents lien vers les fichiers
if [%IntAndroid%] NEQ [] set INITIAL=packages\INT\ANDROID\%IntAndroid%& set INITALEXT=aab& set INITIALENV=int

if [%IntIos%] NEQ [] if [%INITIAL%] EQU [] set INITIAL=packages\INT\IOS\%IntIOS%& set INITALEXT=ios& set INITIALENV=int& GOTO :RECANDROID
if [%IntIos%] NEQ [] set FILES=packages\INT\IOS\%IntIOS% & set TYPES=ios & set CLASSIFIERS=int

:RECANDROID
if [%RecAndroid%] NEQ [] if [%INITIAL%] EQU [] set INITIAL=packages\REC\ANDROID\%RecAndroid%& set INITALEXT=aab& set INITIALENV=rec& GOTO :RECIOS
if [%RecAndroid%] NEQ [] set FILES=%FILES%,packages\REC\ANDROID\%RecAndroid% & set TYPES=%TYPES%,aab & set CLASSIFIERS=%CLASSIFIERS%,rec

:RECIOS
if [%RecIos%] NEQ [] if [%INITIAL%] EQU [] set INITIAL=packages\REC\IOS\%RecIos%&  set INITALEXT=ios& set INITIALENV=rec& GOTO :PRODANDROID
if [%RecIos%] NEQ [] set FILES=%FILES%,packages\REC\IOS\%RecIos% & set TYPES=%TYPES%,ios & set CLASSIFIERS=%CLASSIFIERS%,rec

:PRODANDROID
if [%ProdAndroid%] NEQ [] if [%INITIAL%] EQU [] set INITIAL=packages\PROD\ANDROID\%ProdAndroid%& set INITALEXT=aab& set INITIALENV=prod& GOTO :PRODIOS
if [%ProdAndroid%] NEQ [] set FILES=%FILES%,packages\PROD\ANDROID\%ProdAndroid% & set TYPES=%TYPES%,aab & set CLASSIFIERS=%CLASSIFIERS%,prod

:PRODIOS
if [%ProdIos%] NEQ [] if [%INITIAL%] EQU [] set INITIAL=packages\PROD\IOS\%ProdIos%& set INITALEXT=ios& set INITIALENV=prod& GOTO :NEXT
if [%ProdIos%] NEQ [] set FILES=%FILES%,packages\PROD\IOS\%ProdIos% &  set TYPES=%TYPES%,ios & set CLASSIFIERS=%CLASSIFIERS%,prod


:NEXT
SET CHOIX=N
::Si la variable files est vide, cela veut dire qu'on à un seul fichier (qui est contenu dans la variable initial)
::On va donc passer moins d'argument si on a un seul fichier
if ["%FILES%"] EQU [""] GOTO :DEPLOYSINGLEFILE else GOTO :DEPLOYMULTIPLEFILE

:DEPLOYMULTIPLEFILE
::On retire la virgule si jamais il y en a une en début de ligne
if "%FILES:~0,1%" EQU "," SET FILES=%FILES:~1%
if "%TYPES:~0,1%" EQU "," SET TYPES=%TYPES:~1%
if "%CLASSIFIERS:~0,1%" EQU "," SET CLASSIFIERS=%CLASSIFIERS:~1%
set /p CHOIX="Les fichiers suivant vont etre envoyer vers le nexus, etes-vous sur de vouloir continuer ? %INITIAL% %FILES% (Y/[N]) :  "
if /I "%CHOIX%" NEQ "Y" GOTO :END
call mvn clean deploy:deploy-file -Dfile="%INITIAL%" -Durl="https://nexus.lan.groupeherve.com/nexus/content/repositories/groupeherve-releases/" -DpomFile="pom.xml" -Dpackaging="%INITALEXT%" -DrepositoryId="groupeherve-releases" -Dclassifier="%INITIALENV%" -Dfiles="%FILES%" -Dtypes="%TYPES%" -Dclassifiers="%CLASSIFIERS%" -Dversion="%VERSION%" -X
echo "Vos fichiers ont été envoyés avec succes"
GOTO :END

:DEPLOYSINGLEFILE
set /p CHOIX="Le fichier suivant va etre envoyer vers le nexus, etes-vous sur de vouloir continuer ? %INITIAL% (Y/[N]) :  "
if /I "%CHOIX%" NEQ "Y" GOTO :END
call mvn clean deploy:deploy-file -Dfile="%INITIAL%" -Durl="https://nexus.lan.groupeherve.com/nexus/content/repositories/groupeherve-releases/" -DpomFile="pom.xml" -Dpackaging="%INITALEXT%" -DrepositoryId="groupeherve-releases" -Dclassifier="%INITIALENV%" -Dversion="%VERSION%" -X
echo "Votre fichier a été envoyé avec succes"
GOTO :END

:END
EXIT
