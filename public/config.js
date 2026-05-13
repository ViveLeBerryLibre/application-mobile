(function () {
    window.CONFIG = window.CONFIG || {};
    window.CONFIG = {
        env: 'REC',
        auth: {
            clientId: '18f00f1c-a92f-47ef-9c1d-8fd53991b4d6',
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