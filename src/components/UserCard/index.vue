<template functional>
  <div class="user-card">
    <img class="user-card__avatar" :src="props.avatar" alt="avatar">
    <span class="user-card__name">{{ props.userName }}</span>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

// @Component 装饰器表明此 class 是一个 Vue 组件
@Component
class UserCard extends Vue {
  @Prop({ type: String, required: true }) userName
  @Prop({ type: String, required: true }) avatar
}
export default UserCard
</script>

<style src="./style.scss" lang="scss" scoped></style>
