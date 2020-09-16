<template>
  <div>
    <Dashboard>
      <template #sidebar>sidebar</template>
      <template #main-nav>nav</template>
      <template #main-header>header</template>
      <template #main-section>
        <ChartContainer>
          <template #title>Title</template>
          <template #subtitle>Subtitle</template>
          <template #chart><div class="mock"></div></template>
        </ChartContainer>
      </template>
    </Dashboard>
  </div>
</template>

<script>
import Dashboard from '@/components/base/BaseDashboard.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';

export default {
  components: {
    Dashboard,
    ChartContainer
  }
};
</script>
