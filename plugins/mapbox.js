/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import { MglMap, MglGeojsonLayer, MglMarker, MglPopup } from 'vue-mapbox';
import Mapbox from 'mapbox-gl';

Vue.component('MglMap', MglMap);
Vue.component('MglGeojsonLayer', MglGeojsonLayer);
Vue.component('MglMarker', MglMarker);
Vue.component('MglPopup', MglPopup);

Vue.prototype.$mapbox = Mapbox;
