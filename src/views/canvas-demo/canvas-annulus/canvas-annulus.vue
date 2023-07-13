<template>
  <canvas></canvas>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { Ball } from './ball'

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
const balls: Ball[] = []
const colorArray = ["#97A7F8", "#C957CA", "#76E2FE"]
let mouse = { x: 0, y: 0 }

onMounted(() => {
  initCanvas()
  initBalls()

  animate()

  window.addEventListener('mousemove', (event: MouseEvent) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY
  })
})

const initBalls = () => {
  for (let i = 0; i < 50; i++) {
    let color = colorArray[Math.floor(Math.random()*colorArray.length)]
    balls.push(
      new Ball({
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 3,
        color,
        canvas,
        ctx,
        mouse
      })
    )
  }
}

const initCanvas = () => {
  canvas = document.querySelector('canvas') as HTMLCanvasElement
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  canvas.width = canvas.getBoundingClientRect().width
  canvas.height = canvas.getBoundingClientRect().height
}

const animate = () => {
  requestAnimationFrame(animate)

  ctx.fillStyle = 'rgba(255,255,255,.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let ball of balls) {
    ball.update()
  }
}
</script>
<style lang="scss" scoped>
  canvas {
    width: 100%;
    height: 600px;
  }
</style>