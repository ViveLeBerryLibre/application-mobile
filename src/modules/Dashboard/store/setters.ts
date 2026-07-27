import {MutationTree} from 'vuex';
import {DashBoardState} from '@/modules/Dashboard/store/state';
import {UserDTO} from '@/common/types/UserDTO';

export const mutations: MutationTree<DashBoardState> = {
    setUser(state: DashBoardState, user: UserDTO) {
        state.user = user;
    },
    setCompteur(state: DashBoardState, compteur: number) {
        state.compteur = compteur;
    },
};