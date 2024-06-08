<script>
export default {
  props: {
    color: {
      type: String,
      default: "info",
    },
    size: {
      type: String,
      default: "",
    },
  },
  methods: {
    getClasses(color, size) {
      let colorValue, sizeValue;

      colorValue = color && `pagination-${color}`;
      sizeValue = size && `pagination-${size}`;

      return `${colorValue} ${sizeValue}`;
    }
  }
}
</script>
<template>
  <ul class="pagination" :class="getClasses(color, size)">
    <slot />
  </ul>
</template>