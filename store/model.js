import { baseMutations, initState, baseActions } from '@/utils/store_actions';

const route = 'model';
const datasetId = 'model_data_77bb_15c2_6ab3';

export const state = () => ({
  ...initState(route, datasetId),
});

export const mutations = { ...baseMutations };

export const actions = { ...baseActions(route) };
