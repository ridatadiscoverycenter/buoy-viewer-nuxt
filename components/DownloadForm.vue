<template>
  <BaseForm>
    <template #inputs>
      <div class="control-item">
        <label for="file-format" class="label">File format</label>
        <multiselect
          id="file-format"
          v-model="fileFormat"
          class="multiselect"
          :options="fileFormats"
        ></multiselect>
      </div>

      <div class="control-item">
        <label for="buoy-id" class="label">Buoy ID</label>
        <multiselect
          id="buoy-id"
          v-model="downloadBuoys"
          class="multiselect"
          :options="buoys"
          :multiple="true"
        ></multiselect>
      </div>

      <div class="control-item">
        <label for="variable-select-download" class="label"
          >Select Variable</label
        >
        <multiselect
          id="variable-select-download"
          v-model="downloadVariables"
          class="multiselect"
          :options="variables"
          :multiple="true"
        ></multiselect>
      </div>
    </template>

    <template #buttons>
      <a
        role="button"
        class="button is-link control-item-button"
        :href="downloadUrl"
        >Download Data</a
      >
    </template>
  </BaseForm>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

import BaseForm from '@/components/base/BaseForm.vue';

export default {
  components: {
    Multiselect,
    BaseForm
  },
  props: {
    variables: {
      type: Array,
      required: true
    },
    buoys: {
      type: Array,
      required: true
    },
    datasetId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fileFormat: 'json',
      downloadBuoys: [],
      downloadVariables: []
    };
  },
  computed: {
    ...mapState('variables', ['fileFormats', 'baseUrl']),
    downloadUrl() {
      return `${this.baseUrl}/tabledap/${this.datasetId}.${this.fileFormat}?${
        this.downloadVariables
      },time,latitude,longitude&station_name=~"(${this.downloadBuoys.join(
        '|'
      )})"`;
    }
  }
};
</script>
