<template>
  <ChartContainer width="half">
    <template #title>Download Selected Data</template>
    <template #subtitle
      >Selected data includes {{ variable }} from
      {{ startDtStr.slice(0, 10) }} to {{ endDtStr.slice(0, 10) }}</template
    >
    <template #chart>
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
        </template>

        <template #buttons>
          <a
            role="button"
            class="button is-link control-item-button mr-2 my-2"
            :href="downloadUrl()"
            >Download Data</a
          >
        </template>
      </BaseForm>
    </template>
  </ChartContainer>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

import ChartContainer from '@/components/base/ChartContainer.vue';
import BaseForm from '@/components/base/BaseForm.vue';

export default {
  components: {
    ChartContainer,
    BaseForm,
    Multiselect
  },
  props: {
    variable: {
      type: String,
      required: true
    },
    buoyIds: {
      type: Array,
      required: true
    },
    startDtStr: {
      type: String,
      required: true
    },
    endDtStr: {
      type: String,
      required: true
    },
    datasetId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fileFormat: 'json'
    };
  },
  computed: {
    ...mapState('variables', ['baseUrl', 'fileFormats'])
  },
  methods: {
    downloadUrl() {
      return `${this.baseUrl}/tabledap/${this.datasetId}.${this.fileFormat}?${
        this.variable
      },station_name,time,latitude,longitude&time>=${this.startDtStr}&time<=${
        this.endDtStr
      }&station_name=~"(${this.buoyIds.join('|')})"`;
    }
  }
};
</script>
