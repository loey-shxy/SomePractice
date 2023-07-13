<template lang="">
  <canvas></canvas>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { FireworksEffect } from './fireworks'

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

onMounted(() => {
  initCanvas()
  initFireworks()
})

const initCanvas = () => {
  canvas = document.querySelector('canvas') as HTMLCanvasElement
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  canvas.width = canvas.getBoundingClientRect().width
  canvas.height = canvas.getBoundingClientRect().height
}

const initFireworks = () => {
  new FireworksEffect(canvas,  ctx)
}
</script>

<style lang="scss" scoped>
  canvas {
    width: 100%;
    height: 600px;
    background-color: #000;
  }
</style>