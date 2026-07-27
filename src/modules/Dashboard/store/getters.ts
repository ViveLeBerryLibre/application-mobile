import {GetterTree} from 'vuex';
import {RootState} from '@/plugins/store';
import {DashBoardState} from '@/modules/Dashboard/store/state';

export const getters: GetterTree<DashBoardState, RootState> = {

    getUser(state: DashBoardState): any {
        return state.user;
    },
    getCompteur(state: DashBoardState): any {
        return state.compteur;
    },
};
