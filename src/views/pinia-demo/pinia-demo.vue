<template>
    <div class="container">
      <p>{{ msg }}</p>
      <h2>Count: {{ store.getCount }}</h2>
      <br>
      <button @click="add">修改状态</button>
      <button @click="reset">重置状态</button>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useStore } from '../../store/index'
const store = useStore()

const { msg, count } = storeToRefs(store)

const add = () => {
  // store.$patch({
  //   count: store.count+1,
  //   msg: 'Hello world'
  // })
  store.changeState()
}

const reset = () => {
  store.$reset()
}
</script>
<style lang="scss" scoped>
.container {
  width: 320px;
  text-align: center;
  margin: 50px auto;
}
</style>