import {App, reactive} from 'vue';
import {IPublicClientApplication} from '@azure/msal-browser';

export const msalPlugin = {
    install: (app: App, msalInstance: IPublicClientApplication) : void => {
        const state = reactive({
            instance: msalInstance
        });

        app.config.globalProperties.$msal = state;
    }
};
