<template>
  <div class="container">
    <div class="list" v-for="item in list" :key="item.id">
      <div>{{ item.id }}</div>
      <div>{{ item.name }}</div>
      <div>{{ item.email }}</div>
    </div>

  </div>
</template>
<script setup name="concurrent-request" lang="ts">
import {ref, onMounted} from 'vue'
import {apiUserInfo, apiConcurrentUserInfo} from '../../apis/demo'

interface IUser {
  id: number;
  name: string;
  email: string;
}

onMounted(() => {
  getList()

  concurrentFetch()
})

let list = ref<IUser[]>([])
const getList = async () => {
  list.value = await apiUserInfo()
}

const concurrentFetch = async () => {
  const functions = Array(100).fill(apiUserInfo)
  const data = await apiConcurrentUserInfo(functions)
  console.log(data)
}

</script>
<style lang="scss" scoped>
  .container {
    width: 1000px;
    margin: 50px auto;
  }
  .list {
    padding: 6px 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    &>div {
      flex: 1;
    }
  }
</style>