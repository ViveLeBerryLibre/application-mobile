/*
import {ActionTree} from 'vuex';
import {Satisfaction, SatisfactionDTO, SatisfactionState} from './state';
import {RootState, store} from '@/plugins/store';
import { SatisfactionModuleAction } from './actions-types';

export const actions: ActionTree<SatisfactionState, RootState> = {

    async [SatisfactionModuleAction.SET_DATE_CONSULTATION]({ commit }: SatisfactionModuleActionTypes): Promise<any> {
        const satisfaction : Satisfaction = store.getters['satisfactionState/getSatisfaction'];
        const satisfactionDto : SatisfactionDTO = new SatisfactionDTO(satisfaction);
        satisfactionDto.dateConsultation = dayjs().format('YYYY-MM-DDTHH:mm:ss');
        await satisfactionService.updateSatisfaction(satisfactionDto).then(async(satisfactionDto: any)=> {
            commit(SATISFACTION.SET_SATISFACTION, new Satisfaction(satisfactionDto.data));
        });
    },
};
*/
