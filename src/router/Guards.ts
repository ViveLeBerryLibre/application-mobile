// import {RouteLocationNormalized, Router} from 'vue-router';
// import { loginRequest, msalInstance } from '@/authenticationConfig';
// import {AUTH, USER} from '@/modules/Auth/store/mutation-types';
// import { store } from '@/plugins/store';
// import {AuthenticationResult, AuthorizationCodeRequest} from '@azure/msal-browser';
// import StringUtils from '../common/utils/StringUtils';
// import {Capacitor} from '@capacitor/core';
// import SignInService from '@/modules/SignIn/services/SignInService';
// import {UserInformations} from '@/modules/Auth/store/state';
// import jwtDecode from 'jwt-decode';
//
// export function registerGuard(router: Router): void {
//     // Avant chaque route
//     router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
//         console.info('[Guards] to : ' + to.fullPath);
//
//         // On enregistre la route sur laquelle on était
//         localStorage.setItem('previousRoute', from.path.toString() || '');
//         localStorage.setItem('nextRoute', to.path?.toString() || '');
//
//         // Si on a défini la route comme nécessitant d'être authentifié
//         if (to.meta.requiresAuth) {
//             // Utilisé seulement en WEB après la saisie valide du login/pwd dans Azure
//             if (!Capacitor.isNativePlatform() && from.path === '/' && to.path === '/accueilSatisfaction' && to.hash && !to.hash.startsWith('#error')) {
//                 await msalInstance.handleRedirectPromise();
//             }
//             // On vérifie si la personne est connectée
//             const authenticated = await isAuthenticated();
//
//             store.commit(AUTH.SET_SIGN_IN_AZURE_SUCCESSFULL, authenticated);
//
//             handleAzureError(authenticated, to);
//
//             return authenticated ? true : '/signIn';
//         }
//
//         return true;
//     });
// }
//
// async function isAuthenticated(): Promise<boolean> {
//     let authenticated = false;
//
//     console.info('[Guards] acquireTokenSilent');
//
//     await msalInstance.acquireTokenSilent(loginRequest)
//         .then(async (authResult: AuthenticationResult) => {
//             console.info('[Guards] acquireTokenSilent OK');
//             const data = {tokenAzure: authResult.idToken};
//             await SignInService.signIn(data).then( async response => {
//                 //on sauvegarde le jwt
//                 store.commit(AUTH.SET_TOKEN, response.data.token);
//                 //on decode le jwt pour récupérer les informations du user
//                 const user = getDecodedAccessToken(response.data.token);
//                 if (user != null) {
//                     //on construit notre objet userInformation et on le stocke
//                     const userInformations: UserInformations = {
//                         sub: user.sub,
//                         email: user.email,
//                         telephone: user.telephone,
//                         tCompteId: user.t_compte_id,
//                         fonctions: user.fonctions,
//                         aud: user.aud,
//                         iss: user.iss,
//                         iat: user.iat,
//                         email_azure: user.email_azure
//                     };
//                     store.commit(USER.SET_INFORMATION, userInformations);
//                 }
//                 authenticated = true;
//             });
//         })
//         .catch(async (error: any) => {
//             console.info('[Guards] acquireTokenSilent KO');
//             console.error(error);
//
//             // Etape de connexion finale Azure en MOBILE (car acquireTokenSilent échoue la première fois)
//             if (Capacitor.isNativePlatform()) {
//                 authenticated = await signInByCode();
//             }
//         });
//
//     console.info('[Guards] isAuthenticated return ' + authenticated);
//     return authenticated;
// }
//
// function handleAzureError(authenticated: boolean, to: RouteLocationNormalized) {
//     if (!authenticated && to.hash.startsWith('#error')) {
//         const error = StringUtils.parseHashRoutePartToObject(to.hash).error + ' ' + StringUtils.truncateString(StringUtils.parseHashRoutePartToObject(to.hash).error_description,50);
//         store.commit(AUTH.SET_SIGN_IN_AZURE_ERROR, error);
//     }
// }
//
// /**
//  * Dernière étape d'authentification en Mobile (pas en Web)
//  */
// async function signInByCode() {
//     const code: string = store.getters.getCode;
//     if (!code) {
//         return false;
//     }
//
//     const request: AuthorizationCodeRequest = {
//         ...loginRequest,
//         code: code,
//         codeVerifier: store.getters.getCodeVerifie
//     };
//
//     // Appel pour récupérer les tokens
//     let authenticated = false;
//     console.info('[Guards] acquireTokenByCode');
//     await msalInstance.acquireTokenByCode(request).then(async authResult => {
//         console.info('[Guards] acquireTokenByCode OK');
//         authenticated = true;
//     }).catch((error) => {
//         console.info('[Guards] acquireTokenByCode KO');
//         console.error(error);
//
//         // On purge le store avec le codeVerifier et le code qui doivent être stockés temporairement le temps de la connexion
//         store.commit(AUTH.RESET);
//     });
//
//     return authenticated;
// }
//
// function getDecodedAccessToken(token: string): any {
//     try{
//         return jwtDecode(token);
//     }
//     catch(Error){
//         return null;
//     }
// }