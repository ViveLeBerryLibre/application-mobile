import { AuthenticationResult, EventType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import router from '@/router';

const msalConfig = {
    auth: {
        authority: window.CONFIG.auth.authority + '/' + window.CONFIG.auth.connexionB2C + '/',
        clientId: window.CONFIG.auth.clientId,
        knownAuthorities: window.CONFIG.auth.knownAuthorities,
        redirectUri: window.CONFIG.auth.redirectUriNatif,
        postLogoutRedirectUri: window.CONFIG.auth.postLogoutRedirectUriNatif,
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: 'localStorage', // Options are localStorage, sessionStorage, memoryStorage
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            logLevel: LogLevel.Error,
            loggerCallback: (level: any, message: any, containsPii: any) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Trace:
                        console.debug(message);
                        return;
                }
            },
            allowRedirectInIframe: true,
            piiLoggingEnabled: false
        }
    }
};

export const msalInstance = await PublicClientApplication.createPublicClientApplication(msalConfig);
configurationInstanceMSAL();

export async function configurationInstanceMSAL():Promise<void> {
    // On ajoute un callback pour écouter quand la personne s'authentifie
    msalInstance.addEventCallback(async (event: any) => {
        if (!event.payload) {
            return;
        }

        console.info('[authConfig] EVENT = ' + event.eventType);

        // WEB : connexion silencieuse = ACQUIRE_TOKEN_SUCCESS | connexion via page Microsoft = LOGIN_SUCCESS
        if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
            || event.eventType === EventType.ACQUIRE_TOKEN_BY_CODE_SUCCESS) {
            // On set le compte connecté
            const authResult: AuthenticationResult = event.payload as AuthenticationResult;
            msalInstance.setActiveAccount(authResult.account);

            // On va sur la première page de l'application (parmi celles qui nécessitent d'être authentifiées)
            const previousRoute = localStorage.getItem('previousRoute') || '';
            const nextRoute = localStorage.getItem('nextRoute') || '';
            if (previousRoute === '/' || previousRoute === '') {
                router.push({ path: '/accueilSatisfaction' });
            } else {
                router.push({path: nextRoute});
            }
        }
    });
}

export const loginRequest = {
    scopes: [window.CONFIG.auth.scope]
};
