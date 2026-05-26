(function () {
    window.CONFIG = window.CONFIG || {};
    window.CONFIG = {
        env: 'DEV',
        auth: {
            clientId: '5b0e19c9-eef6-409a-99a1-fbb6581ea033',
            authority: 'https://groupeherveb2cdev.b2clogin.com/tfp/groupeherveb2cdev.onmicrosoft.com',
            connexionB2C:  'B2C_1_connexion',
            knownAuthorities: ['https://groupeherveb2cdev.b2clogin.com'],
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