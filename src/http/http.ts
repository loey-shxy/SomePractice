import es6Promise from 'es6-promise'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import qs from 'qs'
import { isArray, merge, isObject } from 'lodash'
import downloadFile from 'downloadjs'

es6Promise.polyfill()

/**
 * @description 请求方法
 */
export enum RequestMethods {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
  Options = 'options'
}

/**
 * @description 请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  loading?: boolean; // loading 配置
  download?: boolean; // 是否为下载请求
}

/**
 * @description 响应
 */
export interface Response {
  error?: any;
  code?: string | number;
  data?: any;
  message: string;
  response: AxiosResponse;
}

let loadingTimer: any = null // loading 定时器
let loadingOpenedCount = 0 // loading 打开次数

export default class Http {
  baseUrl: string | undefined = '/'
  request: AxiosInstance
  config: AxiosRequestConfig
  loadingText = '加载中，请稍等'

  constructor(config: AxiosRequestConfig, loadingText: string = '加载中...') {
    this.config = merge({
      baseUrl: '/', // 根路径
      timeout: 10*60*1000, // 超时时间
      withCredentials: false, // 允许跨域携带cookie信息
    }, config)

    this.baseUrl = this.config.baseURL
    this.request = axios.create(this.config)
    this.loadingText = loadingText
  }

  /**
   * @description 请求拦截器
   * @param onFulfill 
   * @param onRejected 
   */
  requestInterceptor(onFulfill: any, onRejected: any = null) {
    this.request.interceptors.request.use(onFulfill, onRejected)
  }

  /**
   * @description 响应拦截器
   * @param onFulfill 
   * @param onRejected 
   */
  responseInterceptor(onFulfill: any, onRejected: any) {
    this.request.interceptors.response.use(onFulfill, onRejected)
  }

  /**
   * @description API 请求
   * @param requestConfig 
   * @returns 
   */
  private async fetch(requestConfig: RequestConfig): Promise<Response> {
    if (requestConfig.loading) {
      clearTimeout(loadingTimer)
      loadingOpenedCount++
      // showLoading
    }
    try {
      const options: RequestConfig = merge({}, {
        download: false, // true 文件下载
        method: RequestMethods.Get, // 请求模式
        url: '', // 请求地址
        headers: { // 请求头
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        params: {}, // 请求地址?后面的参数
        paramsSerializer: (params: any) => { // ? 后面的参数序列化
          return qs.stringify(params, {indices: false, encodeValuesOnly: true})
        },
        data: {}, // 表单数据
      }, requestConfig)

      const response = await this.request(options)

      // 如果是下载不能直接返回 response.data, 须返回 response，由下载点处理 response.data
      const result: Response = merge(
        options.download ? {} : isObject(response.data) ? response.data: {
          code: `${response.status}`,
          data: response.data
        },
        {response}
        )
      return result
    } catch(e) {
      return new Promise(resolve => {
        resolve(null as any)
      })
    } finally {
      if (requestConfig.loading) {
        loadingOpenedCount--
        if (loadingOpenedCount <= 0) {
          loadingTimer = setTimeout(() => {
            // close loading
          }, 100)
        }
      }
    }
  }

  async get(requestConfig: RequestConfig): Promise<Response> {
    requestConfig.method = RequestMethods.Get
    return await this.fetch(requestConfig)
  }

  async post(requestConfig: RequestConfig): Promise<Response> {
    requestConfig.method = RequestMethods.Post
    return await this.fetch(requestConfig)
  }

  async put(requestConfig: RequestConfig): Promise<Response> {
    requestConfig.method = RequestMethods.Put
    return await this.fetch(requestConfig)
  }

  async delete(requestConfig: RequestConfig): Promise<Response> {
    requestConfig.method = RequestMethods.Delete
    return await this.fetch(requestConfig)
  }

  async upload(requestConfig: RequestConfig): Promise<Response> {
    requestConfig.method = RequestMethods.Post
    requestConfig.headers = {
      'Content-Type': 'multiple/form-data'
    }
    const formData = new window.FormData()
    const { data = {} } = requestConfig
    for (const key in data) {
      const val = data[key]
      if (val instanceof FileList || (isArray(val) && val.length && val[0] instanceof File)) {
        for (let i = 0; i < val.length; i++) {
          formData.append(key, val[i])
        }
      } else {
        if (val !== null) {
          formData.append(key, val)
        }
      }
    }

    requestConfig.data = formData
    return await this.fetch(requestConfig)
  }

  /**
   * @description 合并请求
   * @param functions 
   * @returns 
   */
  async all(functions: Array<Function>): Promise<Array<any>> {
    try {
      return await Promise.all(functions).then(values => values)
    } catch(e) {
      return []
    } finally {
      // 
    }
  }

  /**
   * @description 利用运行池控制大量的并发请求
   * @param functions 请求函数
   * @param maxConcurrentNum 
   * @returns 
   */
  async runningPool(functions: Array<Function>, maxConcurrentNum = 6): Promise<Array<any>> {
    const pool = new Set()
    let pro: any = null
    const waitQueue: Function[] = []
    const results: any[] = []
    functions.forEach(async fetch => {
      pro = new Promise((resolve) => {
        const isFull = pool.size >= maxConcurrentNum
        const fn = async function fn() {
          const response = await fetch()
          if (response) {
            pool.delete(fn)
            const next = waitQueue.shift()
            next && pool.add(next)
            setTimeout(() => next?.())
          }
          results.push(response)
          resolve(null)
        }

        if (isFull) {
          waitQueue.push(fn)
        } else {
          pool.add(fn)
          fn()
        }
      })
    })
    await pro
    return results
  }

  /**
   * @description 下载文件（文件流）
   * @param options 
   * @param mimeType 
   * @returns 
   */
  async download(options: RequestConfig, mimeType = '') {
    try {
      options.responseType = 'blob' // 响应类型
      const {response} = await this.fetch(options)
      // TODO 注意 data 不能用解构赋值 const { status, data } = response (不能序列化的错误)
      const {status} = response
      const result = await this.blobToJson(response as AxiosResponse)
      // 正常情况应该返回的是下载流，如果这个流能被解析为JSON说明返回的是JSON而不是下载流
      // JSON的情况：与API约定：一般情况返回类似这样的JSON {code: '403', data: null, message: '没有权限。'}
      if (status !== 200 || isObject(result)) return {error: true, ...result}
      const fileName = this.parseFileName(response as AxiosResponse)
      // 示例：downloadFile(response.data, `下载${moment().format('YYYY-MM-DD HH-mm-ss')}.xlsx`, 'application/vnd.ms-excel');
      downloadFile(response.data, fileName, mimeType)
      return {error: false, data: { code: '200', data: [], message: '下载成功。'}}
    } catch(error) {
      console.debug(error)
    }
    
    return {error: true, data: { code: '10104', data: [], message: '下载失败。'}}
  }

  /**
   * @description 解析文件名
   * @param response 
   * @param defaultFileName 
   * @returns 
   */
  private parseFileName(response: AxiosResponse, defaultFileName = ''): string {
    const {headers: { 'content-disposition': contentDisposition}} = response
    if (typeof contentDisposition !== 'undefined' && contentDisposition !== null && contentDisposition !== '') {
      const dcs = contentDisposition.split(';')
      for (let i = 0; i < dcs.length; i++) {
        const item = dcs[i]
        if (/^(\s*)filename=/.test(item)) {
          const _filename = item.substr(item.lastIndexOf('=') + 1)
          defaultFileName = _filename
        }
      }
    }
    return defaultFileName
  }

  /**
   * @description Blob 转 JSON
   * @param response 
   * @returns 
   */
  async blobToJson(response: AxiosResponse): Promise<null | object> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsText(response.data, 'utf-8')
      let result: object | null | undefined = null
      reader.onload = () => {
        try {
          result = JSON.parse(reader.result as string)
        } catch (e) {
          console.debug(e)
        }
        resolve(result as any)
      }

      reader.onerror = () => {
        resolve(result as any)
      }
    })
  }
}