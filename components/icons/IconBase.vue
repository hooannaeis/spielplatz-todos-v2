<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :aria-labelledby="iconName"
    role="presentation"
    :style="'fill:' + fillColor"
  >
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g :stroke="strokeColor" :fill="fillColor" :stroke-width="strokeWidth">
      <slot />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: "box"
    },
    viewBox: {
      type: String,
      default: "0 0 48 48"
    },
    width: {
      type: [Number, String],
      default: "100%"
    },
    height: {
      type: [Number, String],
      default: "100%"
    },
    strokeColor: {
      type: String,
      default: "#f6f6f6"
    },
    strokeWidth: {
      type: String,
      default: "6px"
    },
    fillColor: {
      type: String,
      default: "#f6f6f6"
    },
    svgStyle: {
      type: String,
      default: ""
    }
  }
};
</script>