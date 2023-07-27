<template>
  <div class="map-container" id="map"></div>
</template>
<script lang="ts" setup name="camera-animation">
import { shallowRef, onMounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader'
// import * as THREE from 'three'

const map = shallowRef()
const loca = shallowRef()
const pl = shallowRef()
const center = [106.587798, 29.56681]

onMounted(() => {
  initMap()
})

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
  }).then((AMap) => {
    map.value = new AMap.Map('map', {
      center,
      zoom: 11.8,
      zooms:[2, 20],
      viewMode: '3D',
      mapStyle: 'amap://styles/grey',
      showBuildingBlock: false,
      showLabel: false,
    })

    map.value.on('click', (event: any) => {
      const {lng, lat} = event.lnglat
      console.log([lng, lat])
    })

    initLoca()

    map.value.on('complete', () => {
      loca.value.animate.start()
      setTimeout(animate, 2000)
    })
  })
}

const initLoca = () => {
  loca.value = new Loca.Container({
    map: map.value
  })

  loca.value.amLight = {
    intensity: 2.2,
    color: '#babedc'
  }

  loca.value.dirLight = {
    intensity: 0.46,
    color: '#d4d4d4',
    target: [0, 0, 0],
    position: [0, -1, 1]
  }

  loca.value.pointLight = {
    color: 'rgb(15, 19, 40)',
    position: [106.614813, 29.603678, 2600],
    intensity: 25,
    distance: 3900
  }

  const geo = new Loca.GeoJSONSource({
    url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sh_building_center.json',
  })

  pl.value = new Loca.PolygonLayer({
    zIndex: 120,
    shininess: 10,
    hasSide: true,
    cullface: 'back',
    depth: true
  })

  pl.value.setSource(geo)
  pl.value.setStyle({
    topColor: '#111',
    height: (index: number, feature: any) => {
      return feature.properties.h
    },
    textureSize: [1000, 820],
    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/windows.jpg',
  })

  pl.value.setLoca(loca.value)

  const dat = new Loca.Dat()
  dat.addLight(loca.value.amLight, loca.value, '环境光')
  dat.addLight(loca.value.dirLight, loca.value, '平行光')
  dat.addLight(loca.value.pointLight, loca.value, '点光')
  dat.addLayer(pl, '楼块')
}

const animate = () => {
  let speed = 1
  map.value.setZoom(11.8, true)
  map.value.setPitch(0, true)
  map.value.setCenter(center, true)
  map.value.setRotation(1, true)
  pl.value.hide(1000)

  loca.value.viewControl.addAnimates([{
    pitch: {
      value: 0,
      control: [[0, 20], [1, 0]],
      timing: [0, 0, 0.8, 1],
      duration: 3000 / speed
    },
    zoom: {
      value: 15.9,
      control: [[0, 12.8], [1, 15.9]],
      timing: [0, 0, 0.8, 1],
      duration: 3000 / speed,
    },
    rotation: {
      value: -20,
      control: [[0, 20], [1, -20]],
      timing: [0, 0, 0.8, 1],
      duration: 2000 / speed,
    },
  }], () => {
    setTimeout(() => {
      pl.value.show(2000)
    }, 3000)

    loca.value.viewControl.addAnimates([
      // 寻迹
      {
        center: {
          value: [121.500419, 31.238089],
          control: [[121.424503326416,
            31.199146851153124], [121.46656036376952,
            31.245828642661486]],
          timing: [0.3, 0, 0.1, 1],
          duration: 8000 / speed,
        },
        zoom: {
          value: 17,
          control: [[0.3, 15], [1, 17]],
          timing: [0.3, 0, 0.7, 1],
          duration: 4000 / speed,
        },
        pitch: {
          value: 50,
          control: [[0.3, 0], [1, 50]],
          timing: [0.3, 0, 1, 1],
          duration: 3000 / speed,
        },
        rotation: {
          value: -80,
          control: [[0, -20], [1, -80]],
          timing: [0, 0, 1, 1],
          duration: 1000 / speed,
        },
      }, {
        // 环绕
        pitch: {
          value: 50,
          control: [[0, 40], [1, 50]],
          timing: [0.3, 0, 1, 1],
          duration: 7000 / speed,
        },
        rotation: {
          value: 260,
          control: [[0, -80], [1, 260]],
          timing: [0, 0, 0.7, 1],
          duration: 7000 / speed,
        },
        zoom: {
          value: 17,
          control: [[0.3, 16], [1, 17]],
          timing: [0.3, 0, 0.9, 1],
          duration: 5000 / speed,
        },
      }, {
        // 拉起
        center: {
          value: [121.500419, 31.238089],
          control: [[121.49986267089844,
            31.227628422210365], [121.49969100952148,
            31.24025152837923]],
          timing: [0.3, 0, 0.7, 1],
          duration: 2000 / speed,
        },
        pitch: {
          value: 0,
          control: [[0, 0], [1, 100]],
          timing: [0.1, 0, 0.7, 1],
          duration: 2000 / speed,
        },
        rotation: {
          value: 361,
          control: [[0, 260], [1, 361]],
          timing: [0.3, 0, 0.7, 1],
          duration: 2000 / speed,
        },
        zoom: {
          value: 13.8,
          control: [[0, 17.5], [1, 13.8]],
          timing: [0.3, 0, 0.7, 1],
          duration: 2500 / speed,
        },
      }], function () {
        pl.value.hide(1000);
        setTimeout(animate, 2000);
        console.log('结束');
      });
  })
}
</script>
<style lang="scss" scoped>
  .map-container {
    width: 100%;
    height: 100%;
  }
</style>