export default [
  {
    url: '/demo/user',
    method: 'get',
    response: () => ({
      code: '200',
      'data|10': [
        {
          id: '@increment',
          name: '@cname',
          email: '@email'
        }
      ]
    })
  },
  {
    url: '/demo/concurrent',
    method: 'get',
    response: () => ({
      code: '200',
      'data|10': [
        {
          id: '@increment',
          name: '@cname',
          email: '@email'
        }
      ]
    })
  }
]