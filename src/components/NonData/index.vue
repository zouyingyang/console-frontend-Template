<template>
  <div class="nondata-wrap">
    <div class="p">{{tips}}</div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class NonData extends Vue {
  @Prop({ type: String, default: '暂无数据' }) tips
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
