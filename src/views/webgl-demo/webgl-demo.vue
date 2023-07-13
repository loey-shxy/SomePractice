<template>
  <div class="container">
    <canvas class="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
let canvas: HTMLCanvasElement;
let gl: WebGLRenderingContext;
let program: WebGLProgram;
let positionBuffer: WebGLBuffer;
let positionAttributeLocation: number;

onMounted(() => {
  createWebGL()
});

// 顶点着色器
const VShader = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
    gl_PointSize = 10.0;
  }
`

// 片段着色器
const FShader = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
  }
`
const createWebGL = () => {
  canvas = document.querySelector('canvas') as HTMLCanvasElement;
  canvas.width = 800
  canvas.height = 600

  gl = canvas.getContext('webgl') as WebGLRenderingContext

  if (!gl) {
    console.log("Your Browser doesn't support WebGL")
    return
  }

  // gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // 创建顶点着色器
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, VShader) as WebGLShader
  // 创建片段着色器
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, FShader) as WebGLShader
  // 创建 GLSL 着色程序
  program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram

  // 从创建的GLSL着色程序中找到 a_position 属性值所在的位置
  positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

  positionBuffer = gl.createBuffer() as WebGLBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  requestAnimationFrame(drawScene)
  // 属性值从缓冲区中获取数据，因此首先创建一个缓冲
  // const positionBuffer = gl.createBuffer()
  // // 绑定位置信息缓冲
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // const positions = [
  //   0, 0,
  //   0, 0.5,
  //   0.7, 0,
  // ]

  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
}

/**
 * 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
 * @param gl 
 * @param type 
 * @param source 
 */
const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)  as WebGLShader // 创建着色器对象
  gl.shaderSource(shader, source) // 提供数据源
  gl.compileShader(shader) // 编译 -> 生成着色器

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  console.log(success)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

/**
 * 创建着色程序
 * 将两个着色器连接到着色程序
 */
const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram() as WebGLProgram
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

// Resize canvas
const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  const needResize = canvas.width !== displayWidth ||
                    canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth
    canvas.height = displayHeight
  }

  return needResize
}

// Fill the buffer with a line
const setGeometry = (gl: WebGLRenderingContext, x1: number, y1: number, x2: number, y2: number) => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x1, y1,
      x2, y2]),
    gl.STATIC_DRAW
  )
}

const drawScene = (now: number) => {
  now *= 0.001
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const colorLocation = gl.getUniformLocation(program, 'u_color')
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix')
  
  const size = 2,
      type = gl.FLOAT,
      normalize = false,
      stride = 0,
      offset = 0;
  
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  )

  const radius = Math.sqrt(gl.canvas.width * gl.canvas.width + gl.canvas.height * gl.canvas.height) * 0.5,
        angle = now,
        x = Math.cos(angle) * radius,
        y = Math.sin(angle) * radius,
        centerX = gl.canvas.width / 2,
        centerY = gl.canvas.height / 2;
  setGeometry(gl, centerX + x, centerY + y, centerX - x, centerY - y)
  
  const projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height)
  gl.uniformMatrix3fv(matrixLocation, false, projectionMatrix)
  gl.uniform4fv(colorLocation, [1, 0, 0, 1])

  const primitiveType = gl.LINES
  gl.drawArrays(primitiveType, 0, 2)

  requestAnimationFrame(drawScene)
} 

</script>
<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.canvas {
  width: 800px;
  height: 600px;
  margin: 40px auto;
}
</style>