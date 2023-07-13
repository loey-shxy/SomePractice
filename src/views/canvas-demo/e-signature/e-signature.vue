<template>
  <div class="e-signature">
    <canvas id="canvas"></canvas>

    <div>
      <button @click="cancel">取消</button>
      <button @click="save">保存</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';

interface Config {
  width: number;
  height: number;
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  strokeStyle: CanvasGradient | string;
}
onMounted(() => {
  initCanvas()

  window.addEventListener(mobileStatus?'touchstart':'mousedown', init)

  window.addEventListener(mobileStatus?'touchend':'mouseup', closeDraw)
})

let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D

const config: Config = {
  width: 600,
  height: 300,
  lineWidth: 5,
  strokeStyle: 'black',
  lineCap: 'round',
  lineJoin: 'round'
}

// 判断是否为移动端
const mobileStatus = (/Mobile|Android|iPhone/i.test(navigator.userAgent))
// 保存上次绘制的坐标及偏移量
const client = {
  offsetX: 0,
  offsetY: 0,
  endX: 0,
  endY: 0
}

const cancel = () => {
  context.clearRect(0, 0, config.width, config.height)
}

const save = () => {
  canvas.toBlob(blob => {
    const date = Date.now().toString()
    const a = document.createElement('a')
    a.download = `${date}.png`
    a.href = URL.createObjectURL(blob)
    a.click()
    a.remove()
  })
}

const initCanvas =  () => {
  canvas = document.querySelector('canvas') as HTMLCanvasElement
  context = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = config.width
  canvas.height = config.height
  canvas.style.border = '1px solid #ddd'

  // 设置填充背景色
  context.fillStyle = 'transparent'
  // 绘制填充矩形
  context.fillRect(0, 0, config.width, config.height)
}

const init = (event: any) => {
  const { offsetX, offsetY, pageX, pageY } = mobileStatus ? event.changedTouches[0] : event
  const left = canvas.getBoundingClientRect().left
  const top = canvas.getBoundingClientRect().top

  client.offsetX = offsetX
  client.offsetY = offsetY
  client.endX = pageX
  client.endY = pageY

  context.beginPath()
  context.lineWidth = config.lineWidth
  context.strokeStyle = config.strokeStyle
  context.lineCap = config.lineCap
  context.lineJoin = config.lineJoin

  

  context.moveTo(client.endX-left, client.endY-top)

  window.addEventListener(mobileStatus?'touchmove':'mousemove', draw)
}

const draw = (event: any) => {
  const left = canvas.getBoundingClientRect().left
  const top = canvas.getBoundingClientRect().top
  const { pageX, pageY } = mobileStatus?event.changedTouches[0]:event
  client.endX = pageX
  client.endY = pageY

  context.lineTo(pageX-left, pageY-top)
  context.stroke()
}

const closeDraw = () => {
  context.closePath()

  window.removeEventListener('mousemove', draw)
}
</script>
<style lang="scss" scoped>
  #canvas {
    width: 800px;
    margin: 0 auto;
  }
  .e-signature {
    text-align: center;
    margin-top: 30px;
  }
</style>