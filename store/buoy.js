import { baseMutations, initState, baseActions } from '@/utils/store_actions';

const route = 'buoy';
const datasetId = 'combined_e784_bee5_492e';

export const state = () => ({
  ...initState(route, datasetId)
});

export const mutations = { ...baseMutations };

export const actions = { ...baseActions(route) };
