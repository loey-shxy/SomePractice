import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'index',
            redirect: '/pinia-demo'
        },
        {
            path: '/pinia-demo',
            name: 'pinia-demo',
            meta: { title: 'Pinia Demo', cache: false },
            component: async () => await import('@/views/pinia-demo/pinia-demo.vue')
        },
        {
          path: '/webgl-demo',
          name: 'webgl-demo',
          meta: { title: 'WebGL Demo', cache: false },
          component: async () => await import('@/views/webgl-demo/webgl-demo.vue')
        },
        {
          path: '/canvas-demo',
          name: 'canvas-demo',
          redirect: '/canvas-demo/e-signature',
          component: async () => await import('@/views/canvas-demo/canvas-demo.vue'),
          children: [
            {
              path: 'e-signature',
              name: 'e-signature',
              meta: { title: 'E Signature', cache: false },
              component: async () => await import('@/views/canvas-demo/e-signature/e-signature.vue')
            },
            {
              path: 'signature-pad',
              name: 'signature-pad',
              meta: { title: 'Signature Pad', cache: false },
              component: async () => await import('@/views/canvas-demo/signature-pad/signature-pad.vue')
            },
            {
              path: 'canvas-annulus',
              name: 'canvas-annulus',
              meta: { title: 'Canvas Annulus', cache: false },
              component: async () => await import('@/views/canvas-demo/canvas-annulus/canvas-annulus.vue')
            },
            {
              path: 'canvas-fireworks',
              name: 'canvas-fireworks',
              meta: { title: 'Canvas Fireworks', cache: false },
              component: async () => await import('@/views/canvas-demo/canvas-fireworks/canvas-fireworks.vue')
            }
          ]
        },
        {
          path: '/css-demo',
          name: 'css-demo',
          redirect: '/css-demo/custom-input',
          component: async () => await import('@/views/css-demo/css-demo.vue'),
          children: [
            {
              path: 'custom-input',
              name: 'custom-input',
              component: async () => await import('@/views/css-demo/custom-input/custom-input.vue')
            }
          ]
        },
        {
          path: '/dynamic-fence',
          name: 'dynamic-fence',
          meta: { title: 'Dynamic Fence', cache: false },
          component: async () => await import('@/views/dynamic-fence/dynamic-fence.vue')
        },
        {
          path: '/camera-animation',
          name: 'camera-animation',
          meta: { title: 'Camera Animation', cache: false },
          component: async () => await import('@/views/camera-animation/camera-animation.vue')
        },
        {
          path: '/multiple-light',
          name: 'multiple-light',
          meta: { title: 'Multiple Light', cache: false },
          component: async () => await import('@/views/multiple-light/multiple-light.vue')
        },
        {
          path: '/concurrent-request',
          name: 'concurrent-request',
          meta: { title: 'Concurrent Request', cache: false },
          component: async () => await import('@/views/concurrent-request/concurrent-request.vue')
        }
    ]
})
router.afterEach((to, from) => {
    if (to.path === '/redirect') {
        if (from && from.path !== '/redirect') {
            router.replace({
                path: from.path,
                query: from.query
            })
        }
    }
})

export default router