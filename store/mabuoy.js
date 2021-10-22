import { baseMutations, initState, baseActions } from '@/utils/store_actions';

const route = 'mabuoy';
const datasetId = 'ma_buoy_data_a6c9_12eb_1ec5';

export const state = () => ({
  ...initState(route, datasetId),
});

export const mutations = { ...baseMutations };

export const actions = { ...baseActions(route) };
