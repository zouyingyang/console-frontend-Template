<template>
  <div class="card">
    <el-card v-if="$slots.head" class="card__head" shadow="never">
      <template>
        <slot name="head"></slot>
      </template>
    </el-card>
    <el-card v-if="$slots.content" shadow="never" class="card__content">
      <template>
        <slot name="content"></slot>
      </template>
    </el-card>
    <el-card v-if="$slots.foot" shadow="never" class="card__foot">
      <template>
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
export default class Card extends Vue {
  @Prop() height
}
</script>

<style src="./style.scss" lang="scss"></style>
