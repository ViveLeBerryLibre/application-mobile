export const Permissions = {
    
    CONSULTER_DEMANDE_INTERVENTION: 'consulter.demande',
    CREER_DEMANDE_INTERVENTION: 'creer.demande',
    CONSULTER_INTERVENTION_NON_PREVENTIVE: 'consulter.interventionNP',
    CONSULTER_INTERVENTION_PREVENTIVE: 'consulter.interventionP',
    // A compléter...

    //on ouvre un toast si l'utilisateur tente d'accéder à une fonctionnalité pour laquelle il ne possède pas les droits
    userCanAccess(...permissionNames: string[]): boolean {
        for (const element of permissionNames) {
            // if (element) {
            //     if (!store.state.authState.user.fonctions.includes(element)){
            //         store.commit(AUTH.SET_IS_TOAST_PERMISSION_OPEN, true);
            //         return false;
            //     }
            // }
        }
        return true;
    },

};