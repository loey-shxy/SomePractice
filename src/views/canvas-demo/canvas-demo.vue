<template>
  <div class="container">
    <div class="menus">
      <div :class="['menu-item', currentRouter.includes(menu.route) && 'active']" v-for="menu in menus" :key="menu.name">
        <router-link :to="{name: menu.route}">{{ menu.name }}</router-link>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, toRaw } from 'vue'
const menus = [
  { route: 'e-signature', name: 'E Signature' },
  { route: 'signature-pad', name: 'Signature Pad' },
  { route: 'canvas-annulus', name: 'Canvas Annulus' },
  { route: 'canvas-fireworks', name: 'Canvas FireWorks' }
]

const router = useRouter()
const currentRouter = computed(() => {
  return toRaw(router).currentRoute.value.matched.map(item => item.name)
})
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
  }
  .menus {
    display: flex;
    align-items: center;
    background-color: #fafafa;
    .menu-item {
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      padding: 0 20px;
      border-bottom: 2px solid #fafafa;
      a {
        color: #333;
        &.router-link-active, 
        &.router-link-exact-active {
          color: #576EEC;
        }
      }
      &.active {
        border-color: #576EEC;
      }
    }
  }
  .content {
    text-align: center;
    flex: 1;
  }
</style>