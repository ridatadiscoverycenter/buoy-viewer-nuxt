<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="hero-columns">
            <div>
              <h1 class="title">RI Buoy Data</h1>
              <h1 class="subtitle">Using ERDDAP as backend server</h1>
              <main>
                <div class="controls">
                  <BaseSelect
                    id="buoy-id"
                    v-model="buoy"
                    class="control-item"
                    label="Buoy ID"
                    :options="variables.buoys"
                  />
                  <BaseSelect
                    id="variable"
                    v-model="variable"
                    class="control-item"
                    label="Variable"
                    :options="variables.variables"
                  />
                  <nuxt-link
                    class="button is-link control-item"
                    :to="{
                      name: 'buoy-id-variable',
                      params: { id: buoy, variable: variable }
                    }"
                    >Go</nuxt-link
                  >
                </div>
              </main>
            </div>
            <div class="hero-right">
              <div>
                <p class="label">Request URL</p>
                <p>
                  <code class="code">{{ requestUrl }}</code>
                </p>
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
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BaseSelect from '@/components/BaseSelect';

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

<style lang="scss" scoped>
code {
  font-weight: bold;
  font-size: 1rem;
}
.code {
  color: rgb(186, 125, 11);
}
.code-link {
  color: rgb(95, 73, 140);
}
.label-table {
  margin-top: 2rem;
}
.hero {
  padding-top: 10rem;
}
.hero-columns {
  display: flex;
  flex-direction: row;
  .container {
    width: 50vw !important;
  }
}
.hero-right {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 4rem;
}

.controls {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.control-item {
  margin-right: 1rem;
}
.control-item.button {
  margin-bottom: -1rem;
}
</style>
