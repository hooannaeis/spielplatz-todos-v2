<template>
  <g>
    <g transform="matrix(1,0,0,1,-202,-123)">
      <g transform="matrix(1.05723,0,0,1.09355,-20.2289,-36.2807)">
        <rect
          x="4"
          y="3"
          width="1258"
          style="fill:none;"
          height="791"
        />
      </g>
      <g id="option-arrow" transform="matrix(1,0,0,1,125.687,9.47239)">
        <g id="expanded">
          <g id="middle-expanded" transform="matrix(1,0,0,1,-0.3183,-96.0006)">
            <path
              ref="middleExpanded"
              d="M95.318,212.937C95.318,212.937 95.192,246.064 95.318,246.064"
              style="fill: none; stroke:#1F2937; stroke-width: 4px"
            />
          </g>
          <g id="left-expanded" transform="matrix(1,0,0,1,-0.3183,-96.0006)">
            <path
              ref="leftExpanded"
              d="M79.318,228.076L95.318,212.937"
              style="fill: none; stroke:#1F2937; stroke-width: 4px"
            />
          </g>
          <g id="right-expanded" transform="matrix(-1,0,0,1,190.318,-96.0006)">
            <path
              ref="rightExpanded"
              d="M78.318,228.076L95.318,212.937"
              style="fill: none; stroke:#1F2937; stroke-width: 4px"
            />
          </g>
        </g>
        <g id="collapsed">
          <g
            id="middle-collapsed"
            transform="matrix(1,0,0,1,-0.00917965,-96.0006)"
          >
            <path
              ref="middleCollapsed"
              d="M95.318,225.937L95.318,229.196"
              style="fill: none; stroke:#1F2937; stroke-width: 4px"
            />
          </g>
          <g id="left-collapsed" transform="matrix(1,0,0,1,1.6817,-96.0006)">
            <path
              ref="leftCollapsed"
              d="M77.318,228.076L80.005,228.076"
              style="fill: none; stroke:#1F2937; stroke-width: 4px"
            />
          </g>
          <g id="right-collapsed" transform="matrix(-1,0,0,1,187.318,-96.0006)">
            <path
              ref="rightCollapsed"
              d="M75.318,228.076L78.327,228.076"
              style="fill: none; stroke:#1F2937; stroke-width: 4px"
            />
          </g>
        </g>




      </g>
    </g>
  </g>
</template>

<script>
import { gsap, Power4 } from 'gsap'

export default {
  data() {
    return {
      expanded: false,
      paths: {
        expanded: {
          left: undefined,
          right: undefined,
          middle: undefined,
        },
        collapsed: {
          left: undefined,
          right: undefined,
          middle: undefined,
        },
      },
    }
  },
  mounted() {
    this.paths.expanded.left = this.$refs?.leftExpanded?.getAttribute('d')
    this.paths.expanded.right = this.$refs?.rightExpanded?.getAttribute('d')
    this.paths.expanded.middle = this.$refs?.middleExpanded?.getAttribute('d')

    this.paths.collapsed.left = this.$refs?.leftCollapsed?.getAttribute('d')
    this.paths.collapsed.right = this.$refs?.rightCollapsed?.getAttribute('d')
    this.paths.collapsed.middle = this.$refs?.middleCollapsed?.getAttribute('d')
  },
  methods: {
    toggleExpansion() {
      let paths
      if (this.expanded) {
        paths = this.paths.collapsed
      } else {
        paths = this.paths.expanded
      }
      this.expanded = !this.expanded
      console.log('toggling: ', paths)
      gsap
        .to(this.$refs.leftCollapsed, 0.3, {
          attr: { d: paths.left },
          ease: Power4,
        })

      gsap
        .to(this.$refs.rightCollapsed, 0.3, {
          attr: { d: paths.right },
          ease: Power4,
        })

      gsap
        .to(this.$refs.middleCollapsed, 0.3, {
          attr: { d: paths.middle },
          ease: Power4,
        })
        .then(() => {
          console.log('expanded')
        })
    },
  },
}
</script>
<style>
#expanded {
  display: none;
}
</style>
