import {UserDTO} from '@/common/types/UserDTO';

export interface DashBoardState {
    user: UserDTO;
}

export const state: DashBoardState = {
    user: {id: 0, nom: '', prenom: '', email: '', telephone: ''},
};