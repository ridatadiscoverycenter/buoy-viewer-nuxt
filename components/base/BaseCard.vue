<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <fa class="card-icon" :icon="icon" />{{ category }}
      </p>
    </header>
    <div class="card-content">
      <p class="title">
        {{ main }}
      </p>
      <p class="card-content-description">{{ description }}</p>
    </div>
    <footer class="card-footer">
      <p class="card-footer-item">
        <span>
          <a :href="url"
            >{{ $t('actions.go_to', [main]) }}
            <fa icon="external-link-alt" />
          </a>
        </span>
      </p>
      <p v-if="second" class="card-footer-item">
        <span>
          <a :href="secondUrl"
            >{{ $t('actions.go_to', [second]) }}
            <fa icon="external-link-alt" />
          </a>
        </span>
      </p>
      <p v-if="third" class="card-footer-item">
        <span>
          <a :href="thirdUrl"
            >{{ $t('actions.go_to', 'third') }}
            <fa icon="external-link-alt" />
          </a>
        </span>
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    main: {
      type: String,
      required: true
    },
    second: {
      type: String,
      required: false
    },
    third: {
      type: String,
      required: false
    },
    icon: {
      type: Array,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
};
</script>
