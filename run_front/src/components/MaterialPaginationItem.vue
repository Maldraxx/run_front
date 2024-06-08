<template>
  <li class="page-item" :class="getClasses(active, disabled)">
    <a class="page-link" href="javascript:;">
      <span aria-hidden="true" :class="active ? 'text-white' : ''">
        <i v-if="prev" class="fa fa-angle-double-left"></i> <!-- 이전 페이지 아이콘 -->
        {{ prev || next ? null : label }}
        <i v-if="next" class="fa fa-angle-double-right"></i> <!-- 다음 페이지 아이콘 -->
      </span>
    </a>
  </li>
</template>

<script>

export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    prev: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getClasses(active, disabled) {
      let activeValue, disabledValue;

      activeValue = active && "active";
      disabledValue = disabled && "disabled";

      return `${activeValue} ${disabledValue}`;
    }
  }
};
</script>
