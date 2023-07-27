import { RequestConfig, Response } from './http';
import { hasToken, getToken, getTokenKey } from './auth';

let tokenIsInvalid = false

export const responseInterceptorFulfill = (response: Response) => response

export const responseInterceptorRejected = (err: any) => {
  let {response} = err
  if (!response) {
    response = {
      status: 504,
      data: {}
    }
  }

  const {status} = response
  let message = '服务器忙，请稍后重试...'
  switch(status) {
    case 401: 
      message = '登录超时，请重新登录...'
      if (!tokenIsInvalid) {
        // 跳转到登录页
      }
      tokenIsInvalid = true
      break;
    case 403: 
      message = '你没有权限访问，请联系管理员...'
      break;
    case 404:
      message = '您访问的资源不存在...';
      break;
    case 405:
      message = '服务器,请求方式不支持...';
      break;
    case 408:
      message = '请求超时,请稍后再试...';
      break;
    case 500:
      message = '服务器忙，请稍后再试...';
      break;
    case 504:
      message = '网络超时，请检查API地址是否可访问...';
      break;
    default:
      break; 
  }

  if (status !== 401) {
    alert(message)
  }
  return response
}

export const requestInterceptorFulfill = (config: RequestConfig) => {
  if (hasToken() && config.headers) {
    config.headers[getTokenKey()] = getToken()
  }
  return config
}