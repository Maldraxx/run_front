<template>
    <div class="input-group">
      <label v-if="label" :class="labelClass">{{ labelText }}</label>
      <span v-if="icon" class="input-group-text">
        <i class="fas" :class="'fa-' + icon" aria-hidden="true"></i>
      </span>
      <input
        :id="id"
        :type="type"
        class="form-control"
        :class="[sizeClass, isValidClass, inputClass]"
        :value="value"
        :placeholder="placeholder"
        :required="isRequired"
        :disabled="isDisabled"
      />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      id: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        default: "text",
      },
      label: {
        type: [String, Object],
        default: "",
      },
      value: {
        type: String,
        default: "",
      },
      placeholder: {
        type: String,
        default: "",
      },
      size: {
        type: String,
        default: "md",
      },
      error: {
        type: Boolean,
        default: false,
      },
      success: {
        type: Boolean,
        default: false,
      },
      isRequired: {
        type: Boolean,
        default: false,
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
      inputClass: {
        type: String,
        default: "",
      },
      icon: {
        type: String,
        default: "",
      },
    },
    computed: {
      labelText() {
        return typeof this.label === "object" ? this.label.text : this.label;
      },
      labelClass() {
        return typeof this.label === "object" ? this.label.class : "";
      },
      sizeClass() {
        return "form-control-" + this.size;
      },
      isValidClass() {
        if (this.error) {
          return "is-invalid";
        } else if (this.success) {
          return "is-valid";
        } else {
          return "";
        }
      },
    },
  };
  </script>