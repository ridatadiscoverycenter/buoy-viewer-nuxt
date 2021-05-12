import { baseMutations, initState, baseActions } from '@/utils/store_actions';

const route = 'plankton';
const datasetId = 'plankton_time_series_7615_c513_ef8e';

export const state = () => ({
  ...initState(route, datasetId),
});

export const mutations = { ...baseMutations };

export const actions = { ...baseActions(route) };
