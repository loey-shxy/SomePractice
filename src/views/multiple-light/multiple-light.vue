<template>
  <div class="amap-container" id="map"></div>
</template>
<script setup name="multiple-light">
import { shallowRef, onMounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import * as turf from '@turf/turf'

const map = shallowRef()
const time = ref(0)
const radius = 0.8
const height = 400
const centerPoint = turf.point([106.588009,29.565426])
const pointLight1= ref(null)
const pointLight1Marker = ref(null)
const pointLight2= ref(null)
const pointLight2Marker = ref(null)
const pointLight3= ref(null)
const pointLight3Marker = ref(null)

onMounted(() => {
  initMap()
})

const initMap = () => {
  AMapLoader.load({
    key: import.meta.env.VITE_APP_AMAP_KEY,
    version: '2.0',
    AMapUI: {
      version: '1.1',
      plugins: []
    },
    Loca: {
      version: '2.0.0'
    }
  }).then((AMap) => {
    const center = new AMap.LngLat(106.587798, 29.56681)
    map.value = new AMap.Map('map', {
      center,
      zoom: 16,
      viewMode: '3D',
      mapStyle: 'amap://styles/grey',
      pitch: 52,
      showBuildingBlock: false
    })

    addLight(AMap)
  })
}

const addLight = (AMap) => {
  const loca = new Loca.Container({
    map: map.value
  })

  const ambientLight = new Loca.AmbientLight({
    intensity: 0.5,
    color: '#fff',
  })
  pointLight1.value = new Loca.PointLight({
    color: 'rgb(11, 255, 241)',
    position: [106.588009,29.565426, 0],
    intensity: 5,
    distance: 500
  })

  pointLight2.value = new Loca.PointLight({
    color: 'rgb(255, 75, 0)',
    position: [106.587945,29.565094, 400],
    intensity: 10,
    distance: 1500
  })

  pointLight3.value = new Loca.PointLight({
    color: '#f21da7',
    position: [106.586894, 29.565477, 400],
    intensity: 10,
    distance: 1500
  })

  const lightIcon = new AMap.Icon({
    image: 'https://a.amap.com/Loca/static/loca-v2/demos/images/light.png',
    imageSize: new AMap.Size(40, 40)
  })

  pointLight1Marker.value = new AMap.Marker({
    position: [106.588009,29.565426, 10],
    icon: lightIcon,
    anchor: 'bottom-center'
  })

  pointLight2Marker.value = new AMap.Marker({
    position: [106.587945,29.565094, 400],
    icon: lightIcon,
    anchor: 'bottom-center'
  })

  pointLight3Marker.value = new AMap.Marker({
    position: [106.586894, 29.565477, 400],
    icon: lightIcon,
    anchor: 'bottom-center'
  })

  map.value.add(pointLight1Marker.value)
  map.value.add(pointLight2Marker.value)
  map.value.add(pointLight3Marker.value)
}

const changeLight = () => {
  time.value++
  // const pos = 
}
</script>
<style lang="scss" scoped>
  .amap-container {
    height: 100%;
    position: relative;
  }
</style>