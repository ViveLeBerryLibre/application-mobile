import { Module } from 'vuex';

export interface DashBoardState {
  // Add any dashboard-specific state here if needed in the future
}

const state: DashBoardState = {
  // Initialize state
};

const getters = {
  // Add getters if needed
};

const mutations = {
  // Add mutations if needed
};

const actions = {
  // Add actions if needed
};

const DashboardModule: Module<DashBoardState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default DashboardModule;
export { DashBoardState };