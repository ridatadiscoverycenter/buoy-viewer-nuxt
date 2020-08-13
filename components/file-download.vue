<template>
  <div>
    <div class="hero-right">
      <div>
        <p class="label label-table">ERDDAP Table</p>
        <BaseSelect
          id="file-format"
          v-model="fileFormat"
          class="control-item"
          label="File format"
          :options="variables.fileFormats"
        />
        <p>
          <code class="code-link"
            ><a :href="downloadUrl">{{ downloadUrl }}</a></code
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BaseSelect from '@/components/base/BaseSelect';

export default {
  components: {
    BaseSelect
  },
  data() {
    return {
      buoy: 'bid2',
      variable: 'WaterTempSurface',
      fileFormat: '-'
    };
  },
  computed: {
    ...mapState(['variables']),
    requestUrl() {
      return `${this.variables.baseUrl}geoJson?${this.variable},time,latitude,longitude&station_name="${this.buoy}"`;
    },
    downloadUrl() {
      return `${this.variables.baseUrl}${this.fileFormat}?${this.variable},time,latitude,longitude&station_name="${this.buoy}"`;
    }
  }
};
</script>

<style lang="scss" scoped></style>
