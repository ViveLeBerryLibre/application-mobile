import { Module } from 'vuex';
//import {mutations} from './mutations';
//import {getters} from './getters';
import {RootState} from '@/plugins/store';
import {DashBoardState, state } from './state';

const DashboardModule: Module<DashBoardState, RootState> = {
  namespaced: true,
  state,
  //getters,
  //mutations,
};

export default DashboardModule;
export type { DashBoardState };