import * as msal from '@azure/msal-browser';
import {Router} from 'vue-router';
import {InAppBrowserEvent} from '@ionic-native/in-app-browser';
import {Capacitor} from '@capacitor/core';

import StringUtils from '@/common/utils/StringUtils';
import ErrorManager from '@/common/utils/ErrorManager';

/**
 * Surcharge de la méthode de navigation vers les pages externes (vers Azure) de la librairie MSAL.
 * Permet d'afficher la page de connexion dans le composant WebView utilisé par l'application ionic.
 */
export class CustomNavigationClient implements msal.INavigationClient {
    private router: Router;
    private codeChallenge = '';
    private codeVerifier = '';

    constructor(router: Router) {
        this.router = router;
    }

    /**
     * Navigation interne à l'application
     * @param url
     * @param options
     */
    navigateInternal(url: string, options: msal.NavigationOptions): Promise<boolean> {
        const relativePath = url.replace(window.location.origin, '');
        if (options.noHistory) {
            this.router.replace(relativePath);
        } else {
            this.router.push(relativePath);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, options.timeout);
        });
    }

    /**
     * Méthode appelée par la librairie Microsoft lorsqu'elle fait la redirection vers la page de connexion d'Azure
     * @param url
     * @param options
     */
    async navigateExternal(url: string, options: msal.NavigationOptions): Promise<boolean> {
        // Si on est en mode natif (en MOBILE), on customise la navigation pour utiliser InappBrowser
        console.log('navigateExternal');
        console.log(url);
        if (Capacitor.isNativePlatform()) {
            //return this.navigateExternalNatif(url, options);
        }

        // Code initial de "msal-browser/src/navigation/NavigationClient"
        if (options.noHistory) {
            window.location.replace(url);
        } else {
            window.location.assign(url);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, options.timeout);
        });
    }

    /*async navigateExternalNatif(url: string, options: msal.NavigationOptions): Promise<boolean> {
        console.log('navigateExternalNatif');
        // Si l'url contient un code challenge (généré par la lib Microsoft),
        // on le surcharge (permet d'avoir le code verifier originel nécessaire pour appeler l'étape 2 de connexion)
        url = await this.surchargeCodeChallenge(url);

        const inAppBrowserOptions: InAppBrowserOptions = {
            zoom: 'no',
            location: 'no',
            hardwareback: 'no',
            hidden: 'no'
        };

        // On affiche la page de connexion Azure dans la Web View de l'application
        const browser = InAppBrowser.create(url, '_blank', inAppBrowserOptions);
        browser.on('loadstart').subscribe(async (event: InAppBrowserEvent) => {
            // S'il s'agit de l'url de redirection utilisée par l'une des 2 étapes de la connexion à Azure.
            // Etape 1 : saisi du login/passe par l'utilisateur puis envoi codeAutorisation et codeChallenge par Azure.
            // Etape 2 : envoi codeAutorisation et codeVerifier (utilisé pour la génération du codeChallenge) à Azure puis envoi accessToken et token par Azure.
            if (event.url.startsWith(window.CONFIG.auth.redirectUriNatif)) {
                // Redirect suite étape 1
                const code = this.getValeurParamUrl(event.url, 'code');
                if (code) {
                    console.log('code ' + code);
                    // On stocke uniquement les infos liées au code d'autorisation, nécessaires pour l'étape de connexion suivante
                    store.commit(AUTH.RESET);
                    store.commit(AUTH.SET_CODE_VERIFIE, this.codeVerifier);
                    store.commit(AUTH.SET_CODE, code);
                    store.commit(AUTH.SET_SIGN_IN_AZURE_SUCCESSFULL, true);

                    browser.close();
                }

                // En cas d'erreur Azure, on affichera l'erreur
                if (this.getValeurParamUrl(event.url, 'error')) {
                    console.log('errror');
                    this.showAzureError(event);

                    browser.close();
                }

            }
            // On est en mode natif et on a appelé la page de déconnexion de Microsoft
            else if (event.url.startsWith(window.CONFIG.auth.postLogoutRedirectUriNatif)) {
                // On clear le cache, sinon problème avec le mode interactif qui reste en cours
                console.log('logout');
                await msalInstance.clearCache();

                localStorage.clear();
                sessionStorage.clear();

                // On ferme inappBrowser
                browser.close();
            }
        });

        // Le navigateur InAppBrowser a été fermé
        browser.on('exit').subscribe(async event => {
            await this.router.push('/accueilSatisfaction');
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, options.timeout);
        });
    }*/

    getValeurParamUrl(url: string, param: string): string {
        let responseParams = url.split('#')[1];
        if (!responseParams) {
            responseParams = url.split('?')[1];
        }

        if (responseParams) {
            // Récupération des paramètres
            const tokenParams = {};
            for (const pair of responseParams.split('&')) {
                const [key, value] = pair.split('=');
                // eslint-disable-next-line
                // @ts-ignore
                tokenParams[key] = value;
            }
            // eslint-disable-next-line
            // @ts-ignore
            return tokenParams[param];
        }

        return '';
    }

    /**
     * Méthode permettant de surcharger la valeur du paramètre code_challenge dans l'url passée en paramètre
     * @param url
     */
    async surchargeCodeChallenge(url: string): Promise<string> {
        const regex = /code_challenge=/;
        if (regex.test(url)) {
            // CODE VERIFIER
            const buffer: Uint8Array = new Uint8Array(32);
            this.codeVerifier = this.base64EncArr(window.crypto.getRandomValues(buffer))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');

            // CODE CHALLENGE
            const pkceHashedCodeVerifier = await window.crypto.subtle.digest(
                'SHA-256',
                this.stringToUtf8Arr(this.codeVerifier)
            );
            this.codeChallenge = this.base64EncArr(new Uint8Array(pkceHashedCodeVerifier))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');

            url = this.replaceUrlParam(url, 'code_challenge', this.codeChallenge);
        }

        return url;
    }

    replaceUrlParam(url: string, paramName: string, paramValue: string): string {
        const pattern = new RegExp(`([?&])${paramName}=([^&]*)`, 'i');
        const match = url.match(pattern);

        if (match) {
            const separator = match[1];
            const oldValue = match[2];

            return url.replace(`${separator}${paramName}=${oldValue}`, `${separator}${paramName}=${paramValue}`);
        }

        // Si le paramètre n'existe pas, ajoutez-le à la fin de l'URL
        return `${url}${url.includes('?') ? '&' : '?'}${paramName}=${paramValue}`;
    }

    base64EncArr(aBytes: Uint8Array): string {
        const binString = Array.from(aBytes, (x) => String.fromCodePoint(x)).join('');
        return btoa(binString);
    }

    stringToUtf8Arr(sDOMStr: string): Uint8Array {
        let nChr;
        let nArrLen = 0;
        const nStrLen = sDOMStr.length;
        /* mapping... */
        for (let nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
            nChr = sDOMStr.charCodeAt(nMapIdx);
            nArrLen +=
                nChr < 0x80
                    ? 1
                    : nChr < 0x800
                        ? 2
                        : nChr < 0x10000
                            ? 3
                            : nChr < 0x200000
                                ? 4
                                : nChr < 0x4000000
                                    ? 5
                                    : 6;
        }

        const aBytes = new Uint8Array(nArrLen);

        /* transcription... */

        for (let nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
            nChr = sDOMStr.charCodeAt(nChrIdx);
            if (nChr < 128) {
                /* one byte */
                aBytes[nIdx++] = nChr;
            } else if (nChr < 0x800) {
                /* two bytes */
                aBytes[nIdx++] = 192 + (nChr >>> 6);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x10000) {
                /* three bytes */
                aBytes[nIdx++] = 224 + (nChr >>> 12);
                aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x200000) {
                /* four bytes */
                aBytes[nIdx++] = 240 + (nChr >>> 18);
                aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
                aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x4000000) {
                /* five bytes */
                aBytes[nIdx++] = 248 + (nChr >>> 24);
                aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
                aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
                aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } /* if (nChr <= 0x7fffffff) */ else {
                /* six bytes */
                aBytes[nIdx++] = 252 + (nChr >>> 30);
                aBytes[nIdx++] = 128 + ((nChr >>> 24) & 63);
                aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
                aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
                aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            }
        }

        return aBytes;
    }
    
    async showAzureError(event: InAppBrowserEvent) {
        const error = this.getValeurParamUrl(event.url, 'error') + ' ' + StringUtils.truncateString(decodeURIComponent(this.getValeurParamUrl(event.url, 'error_description')), 50);

        await ErrorManager.processError(error);
        //store.commit(AUTH.SET_SIGN_IN_AZURE_ERROR, error);
    }
}
