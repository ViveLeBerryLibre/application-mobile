export interface ConfigInterface {
    env: string,
    auth: {
        clientId: string,
        authority: string,
        connexionB2C: string,
        knownAuthorities: string[],
        redirectUriNatif: string,
        postLogoutRedirectUriNatif: string,
        scope: string
     },
    traduction: {
        defaultLocale: string
    },
    api: {
        baseUrlBff: string
    },
    droit: {
        admin: string
    }
}
