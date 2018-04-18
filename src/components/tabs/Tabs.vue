<template>
  <div :class="{ 'vue-bulma-tabs': true, [`is-layout-${layout}`]: true }">
    <div  :class="{ tabs: true, [`is-${size}`]: size, [`is-${alignment}`]: alignment, [`is-${type}`]: type, 'is-fullwidth': isFullwidth }">
      <slot name="left-tab-list"></slot>
      <tab-list>
        <li v-for="(tab, index) in tabPanes" v-bind:key="index"
          role="tab"
          :class="{ 'is-active': isActived(index), 'is-disabled': tab.disabled, 'is-flex': true }"
          :aria-selected="isActived(index) ? 'true' : 'false'"
          :aria-expanded="isActived(index) ? 'true' : 'false'"
          :aria-disabled="tab.disabled ? 'true' : 'false'"
          :selected="isActived(index)"
          :disabled="tab.disabled"
          @click="select(index)">
          <a class="is-unselectable">
            <span :class="['icon', { 'is-small': size !== 'large' }]" v-if="tab.icon"><i :class="tab.icon"></i></span>
            <span>{{ tab.label }}</span>
          </a>
        </li>
      </tab-list>
      <slot name="right-tab-list"></slot>
    </div>
    <div class="tab-content is-flex">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import TabList from './TabList'
export default {
  data () {
    return {
      realSelectedIndex: this.selectedIndex,
      tabPanes: []
    }
  },
  components: {
    TabList
  },
  props: {
    isFullwidth: Boolean,
    layout: {
      type: String,
      default: 'top',
      validator (val) {
        return ['top', 'bottom', 'left', 'right'].indexOf(val) > -1
      }
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    alignment: {
      type: String,
      default: ''
    },
    selectedIndex: {
      type: Number,
      default: -1
    },
    animation: {
      type: String,
      default: 'fade'
    },
    onlyFade: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.update()
    if (this.realSelectedIndex === -1) {
      this.select(0)
    }
  },
  methods: {
    update () {
      for (const tabPane of this.tabPanes) {
        if (!tabPane.disabled && tabPane.realSelected) {
          this.select(tabPane.index)
          break
        }
      }
    },
    isActived (index) {
      return index === this.realSelectedIndex
    },
    select (index) {
      this.$emit('tab-selected', index)
      this.realSelectedIndex = index
    }
  },
  watch: {
    selectedIndex (newIndex) {
      this.select(newIndex)
    }
  }
}
</script>

<style>
.vue-bulma-tabs {
  position: relative;
  display: flex;
  flex: 1;
}
.vue-bulma-tabs.is-layout-top {
  flex-direction: column;
}
.vue-bulma-tabs.is-layout-bottom {
  flex-direction: column-reverse;
}
.vue-bulma-tabs.is-layout-left {
  flex-direction: row;
  overflow-x: hidden;
  overflow-y: auto;
}
.vue-bulma-tabs.is-layout-left .tab-list {
  flex-direction: column;
  align-items: flex-start;
  border-bottom: none;
  border-right: 1px solid #b5b5b5;
}
.vue-bulma-tabs.is-layout-left li {
  width: 100%;
}
.vue-bulma-tabs.is-layout-left li a {
  border-bottom: none;
  border-right: 1px solid #b5b5b5;
  margin-bottom: 0;
  margin-right: -1px;
  justify-content: flex-end;
}
.vue-bulma-tabs.is-layout-left li a:hover {
  border-right-color: #363636;
}
.vue-bulma-tabs.is-layout-left li.is-active a {
  border-right-color: #1c87c4;
}
.vue-bulma-tabs.is-layout-left .tab-content {
  /* margin: 30px 10px; */
}
.vue-bulma-tabs.is-layout-right {
  flex-direction: row-reverse;
  overflow-x: hidden;
  overflow-y: auto;
}
.vue-bulma-tabs.is-layout-right .tab-list {
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  border-bottom: none;
  border-left: 1px solid #b5b5b5;
}
.vue-bulma-tabs.is-layout-right .tab-list li {
  width: 100%;
}
.vue-bulma-tabs.is-layout-right .tab-list li a {
  border-bottom: none;
  border-left: 1px solid #b5b5b5;
  margin-bottom: 0;
  margin-left: -1px;
  justify-content: flex-start;
}
.vue-bulma-tabs.is-layout-right .tab-list li a:hover {
  border-left-color: #363636;
}
.vue-bulma-tabs.is-layout-right .tab-list li.is-active a {
  border-left-color: #1c87c4;
}
.vue-bulma-tabs.is-layout-right .tab-content {
  /* margin: 30px 10px; */
}
.vue-bulma-tabs .tab-content {
  flex-direction: column;
  overflow: hidden;
  position: relative;
  /* margin: 10px 30px; */
  flex: 1 1;
}
.vue-bulma-tabs .tab-pane {
  width: 100%;
  flex: 1 1;
}
.vue-bulma-tabs .tab-pane.is-active {
  transform: translateZ(0);
}
.vue-bulma-tabs .tab-pane[class*="Out"] {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateX(0);
  transform: translateY(0);
}

</style>
