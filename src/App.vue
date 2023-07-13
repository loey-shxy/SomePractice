<template>
  <div class="layout">
    <div class="menus">
      <div :class="['menu-item', currentRouter.includes(menu.route) && 'active']" v-for="menu in menus" :key="menu.name">
        <router-link :to="{ name: menu.route }">{{ menu.name }}</router-link>
      </div>
    </div>
    <div class="content-main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, toRaw } from 'vue'
const menus = [
  { route: 'pinia-demo', name: 'Pinia Demo' },
  { route: 'canvas-demo', name: 'Canvas Demo' },
  { route: 'css-demo', name: 'Css Demo' },
  { route: 'dynamic-fence', name: 'Dynamic Fence' },
]

const router = useRouter()
const currentRouter = computed(() => {
  return toRaw(router).currentRoute.value.matched.map(item => item.name)
})
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 100vh;
}
.menus {
  width: 200px;
  padding-top: 60px;
  height: 100%;
  background-color: #576EEC;
  .menu-item {
    height: 50px;
    line-height: 50px;
    padding-left: 30px;
    a {
      font-size: 18px;
      font-weight: bold;
      color: #fff; 
      &.router-link-active,
      &.router-link-exact-active {
        color: #fff;
      }
    }
    &.active,
    &:hover {
      background-color: #fafafa;
      a {
        color: #576EEC;
      }
    }
  }
}
.content-main {
  flex: 1;
}
</style>
