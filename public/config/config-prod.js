(function () {
    window.CONFIG = window.CONFIG || {};
    window.CONFIG = {
        env: 'PROD',
        auth: {
            clientId: 'cc4c1ef5-48c9-47e4-967c-5927219a8725',
            authority: 'https://groupeherveb2c.b2clogin.com/tfp/groupeherveb2c.onmicrosoft.com',
            connexionB2C:  'B2C_1_connexion',
            knownAuthorities: ['https://groupeherveb2c.b2clogin.com'],
            redirectUriNatif: 'https://ressources.groupeherve.com/azure-b2c/signin/post-login-blank.html',
            postLogoutRedirectUriNatif: 'https://ressources.groupeherve.com/azure-b2c/signin/post-logout-blank.html',
            scope: 'openid'
        },
        traduction: {
            defaultLocale: 'fr'
        },
        api: {
            baseUrlBff: ''
        },
        droit: {
            admin: ''
        }
    };
})();