import {PublicClientApplication } from '@azure/msal-browser';


export let msalInstance: PublicClientApplication;

export const loginRequest = {
    scopes: [window.CONFIG.auth.scope]
};
