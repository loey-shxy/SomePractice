<template>
  <div class="amap-container" id="map"></div>
</template>
<script lang="ts" setup>
import { shallowRef, onMounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import * as THREE from 'three'

// 墙体路径原始数据
const data = [
    [
      [116.523344, 39.795124],
      [116.526568, 39.796617],
      [116.528888, 39.793540],
      [116.525796, 39.792064],
      [116.523344, 39.795124],
    ]
  ]
let camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    texture: THREE.Texture

let paths: number[][][] = []
// 使用 shallowRef() 进行非深度监听，因为在 Vue3 所使用的 Proxy 拦截操作会改变 JS API 原生对象
const map = shallowRef() 

const height = 50
const color = '#FFD500'
let texture_offset = ref(0)

onMounted(() => {
  initMap()
})

const initThree = (gl: WebGL2RenderingContext) => {
  const mapContainer = document.getElementById('map') as HTMLElement
  camera = new THREE.PerspectiveCamera(
    60, 
    mapContainer.clientWidth / mapContainer.clientHeight,
    100,
    1 << 30
  )

  renderer = new THREE.WebGLRenderer({
    context: gl,
    antialias: true, // 抗锯齿
  })

  renderer.autoClear = false
  renderer.outputEncoding = THREE.sRGBEncoding

  scene = new THREE.Scene()
  const aLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(aLight)
}

/**
 * @description 创建墙
 */
const createWall = () => {
  let faceList: number[] = []
  let faceVertexUvs: number[] = []

  for (let i = 0; i < paths.length; i++) {
    const { face, uvs } = generateVecData(paths[i]) as { face: number[], uvs: number[]}

    faceList = [...faceList, ...face]
    faceVertexUvs = [...faceVertexUvs, ...uvs]
  }

  // 背景层
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(faceList), 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(faceVertexUvs), 2))

  const material1 = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    alphaMap: new THREE.TextureLoader().load('../../assets/texture.jpg')
  })

  const mesh1 = new THREE.Mesh(geometry, material1)
  scene.add(mesh1)

  // 动画层
  const geometry2 = geometry.clone()
  texture = generateTexture(128, color)
  texture.wrapS = THREE.RepeatWrapping // 水平垂直平铺
  texture.wrapT = THREE.RepeatWrapping // 垂直重复平铺

  const material2 = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    map: texture
  })

  const mesh2 = new THREE.Mesh(geometry2, material2)
  scene.add(mesh2)
}

/**
 * @description 创建一个闭合范围的模型数据
 * @param arr 坐标
 * @return {Object} 包含面的顶点数据face，UV面的顶点数据uvs
 */
const generateVecData = (arr: number[][]) => {
  const vec3List: number[][] = [] // 顶点数组
  let faceList: number[] = [] // 三角面数组
  let faceVertexUvs: number[] = [] // 面的UV层队列，用于纹理和集合信息映射

  // t3---t2
  // |  \  |
  // t0---t1
  // UV面
  // 下三角[t0, t1, t3]
  // 上三角[t3, t1, t2]
  const t0 = [0, 0]
  const t1 = [1, 0]
  const t2 = [1, 1]
  const t3 = [0, 1]

  for (let i = 0; i < arr.length; i++) {
    const [x, y] = arr[i]
    
    vec3List.push([x, y, 0])
    vec3List.push([x, y, height])
  }

  // 1---3
  // | \ |
  // 0---2
  // 三角面顶点，没有顺序要求，但要跟UV面顺序一致
  // 下三角 [0,1,2]
  // 上三角 [1,2,3]
  for (let i = 0; i < vec3List.length - 2; i++) {
    if (i % 2 === 0) { // 下三角
      faceList = [...faceList, ...vec3List[i], ...vec3List[i + 2], ...vec3List[i + 1]]
      faceVertexUvs = [...faceVertexUvs, ...t0, ...t1, ...t3]
    } else { // 上三角
      faceList = [...faceList, ...vec3List[i], ...vec3List[i + 1], ...vec3List[i + 2]]
      faceVertexUvs = [...faceVertexUvs, ...t3, ...t1, ...t2]
    }

  }
  
  return {
    face: faceList,
    uvs: faceVertexUvs
  }
}

/**
 * @description 创建材质图
 * @param size 尺寸大小 2的n次方
 * @param color 
 */
const generateTexture = (size = 64, color = '#ff0000') => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const linearGradient = ctx?.createLinearGradient(0, 0, 0, size)
  linearGradient?.addColorStop(0.2, hexToRgba(color, 0.0))
  linearGradient?.addColorStop(0.8, hexToRgba(color, 0.5))
  linearGradient?.addColorStop(1.0, hexToRgba(color, 1.0));
  ctx.fillStyle = linearGradient
  ctx.fillRect(0, 0, size, size)

  let texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * @description 将十六进制的颜色值转成rgba
 * @param hex 
 * @param opacity 
 */
const hexToRgba = (hex: string, opacity = 1) => {
  return `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x'+hex.slice(3, 5))}, ${parseInt('0x'+hex.slice(5, 7))},${opacity})`
}

const animate = () => {
  texture_offset.value -= 0.03
  texture.offset.set(0, texture_offset.value)

  if (map.value) {
    map.value.render()
  }

  requestAnimationFrame(animate)
}

// 初始化图层
const initLayer = (AMap: any) => {
  const layer = new AMap.GLCustomLayer({
    zIndex: 9999,
    visible: true,
    init: (gl: WebGL2RenderingContext) => {
      initThree(gl)
      createWall()
      animate()
    },
    render: () => {
      const { near, far, fov, up, lookAt, position } = map.value.customCoords.getCameraParams()

      camera.near = near
      camera.far = far
      camera.fov = fov
      camera.position.set(position[0], position[1], position[2])
      camera.up.set(up[0], up[1], up[2])
      camera.lookAt(lookAt[0], lookAt[1], lookAt[2])

      camera.updateProjectionMatrix()
      renderer.render(scene, camera)

      renderer.resetState()
    }
  })

  map.value.add(layer)
}

const initMap = () => {
  AMapLoader.load({
  key: import.meta.env.VITE_APP_AMAP_KEY,
  version: '2.0',
  AMapUI:{
      version:"1.1",
      plugins:[],

  },
  Loca:{
      version:"2.0.0"
  },
})
  .then((AMap) => {
    const center = new AMap.LngLat(116.52668, 39.794678)
    map.value = new AMap.Map('map', {
      center,
      zoom: 17.5,
      zooms:[2, 20],
      viewMode: '3D',
      mapStyle: 'amap://styles/grey',
      pitch: 52,
    });
    
    map.value.on('click', (event: any) => {
      const {lng, lat} = event.lnglat
      console.log([lng, lat])
    })

    map.value.add(new AMap.Marker({
      position: center,
      offset: new AMap.Pixel(-13, -30)
    }))

    // 地理坐标转为three坐标系
    paths = map.value?.customCoords.lngLatsToCoords(data)

    initLayer(AMap)
  }).catch(e => {
    console.log(e)
  })
}

</script>
<style lang="scss" scoped>
  .amap-container {
    height: 100%;
    position: relative;
  }
</style>