<template>
  <div class="nondata-wrap">
    <div class="p">{{tips}}</div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
class NonData extends Vue {
  @Prop({ type: String, default: '暂无数据' }) tips
}
export default NonData
</script>

<style src="./style.scss" lang="scss" scoped></style>
