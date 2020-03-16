<template>
  <div class="card">
    <el-card class="card__head" shadow="never">
      <template v-if="$slots.head">
        <slot name="head"></slot>
      </template>
    </el-card>
    <el-card shadow="never" class="card__content">
      <template v-if="$slots.content">
        <slot name="content"></slot>
      </template>
    </el-card>
    <el-card shadow="never" class="card__foot">
      <template v-if="$slots.foot">
        <slot name="foot"></slot>
      </template>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
class Card extends Vue {
  @Prop() height
}
export default Card
</script>

<style src="./style.scss" lang="scss"></style>
