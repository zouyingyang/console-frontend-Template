<template>
  <div class="nav-bar">
    <div class="nav-bar__helper">
      <i :class="helperClass" @click="handleCollapse"></i>
    </div>
    <div class="nav-bar__breadcrumb">
      <slot name="breadcrumb"/>
    </div>
    <div class="nav-bar__main">
      <slot name="main"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class NavBar extends Vue {
  @Prop({ type: Boolean })collapse

  get helperClass () {
    return {
      'el-icon-icon-outdent': !this.collapse,
      'el-icon-icon-indent': this.collapse
    }
  }

  handleCollapse (event) {
    event.stopPropagation()
    this.$emit('onCollapse')
  }
}
</script>

<style lang="scss">
@import '~@nn-yy/css-flex/flex';

.nav-bar {
  @include flex( between, middle );
  height: 100%;
  padding: 0 20px;
  background-color: white;
  font-size: 18px;
  -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  &__helper {
    @include flex( center, middle );
    @include flex-self( keep );
    width: unset;

    i {
      cursor: pointer;
    }
  }

  &__main {
    @include flex( start, middle );
  }

  &__breadcrumb {
    padding: 0 20px;
    flex-grow: 1;
  }
}

</style>
