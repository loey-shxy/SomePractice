<template>
  <div class="signature-pad">
    <canvas id="canvas"></canvas>

    <div>
      <button @click="cancel">清除</button>
      <button @click="save">保存</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import SignaturePad from 'signature_pad'
import { onMounted } from 'vue'

onMounted(() => {
  initCanvas()

  window.addEventListener('resize', resizeCanvas)
})
let canvas: HTMLCanvasElement
let signaturePad: SignaturePad
const initCanvas = () => { 
  canvas = document.querySelector('canvas') as HTMLCanvasElement
  signaturePad = new SignaturePad(canvas, { backgroundColor: '#fafafa', penColor: '#000'})
  resizeCanvas()
}

const resizeCanvas = () => {
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  canvas.getContext('2d')?.scale(ratio, ratio)
  signaturePad.clear()
}

const cancel = () => {
  signaturePad.clear()
}

const save = () => {
  if (signaturePad.isEmpty()) {
    return
  }

  let imgStr = signaturePad.toDataURL('image/png')
  const blob = dataURItoBlob(imgStr)

  const date = Date.now().toString()
  const a = document.createElement('a')
  a.download = `${date}.png`
  a.href = URL.createObjectURL(blob)
  a.click()
  a.remove()
}

const dataURItoBlob = (dataurl: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]);
  let n = bstr.length, u8arr = new Uint8Array(n);
  
  while(n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime})

}
</script>
<style lang="scss" scoped>
  #canvas {
    width: 800px;
    margin: 0 auto;
  }
  .signature-pad {
    text-align: center;
    margin-top: 30px;
  }
</style>