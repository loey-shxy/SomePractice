import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'

const MAX_AGE = parseInt(import.meta.env.VITE_APP_REMEMBER_ME_MAX_AGE)
const AUTH_TOKEN_KEY = import.meta.env.VITE_APP_AUTH_TOKEN_KEY
const AUTH_TOKEN_VALUE = import.meta.env.VITE_APP_AUTH_TOKEN_VALUE
const USER_INFO_KEY = import.meta.env.VITE_APP_USER_INFO_KEY

export const isEmpty = (val: any) => {
  return typeof val === 'undefined' || val === null || val === ''
}

export const getTokenKey = () => {
  return Cookies.get(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY)
}

export const setToken = ({ key, token, rememberMe = false, expires }: {[key: string]: any}) => {
  const attributes: { expires?: Date } = {}
  if (rememberMe) {
    attributes.expires = expires ? expires : new Date(Date.now() + MAX_AGE * 60 * 60 * 1000)
  }
  Cookies.set(AUTH_TOKEN_KEY, key, attributes)
  localStorage.setItem(AUTH_TOKEN_KEY, key)
  Cookies.set(AUTH_TOKEN_VALUE, token, attributes)
  localStorage.setItem(AUTH_TOKEN_VALUE, token)
}

export const getToken = () => {
  return Cookies.get(AUTH_TOKEN_VALUE) || localStorage.getItem(AUTH_TOKEN_VALUE)
}

export const removeToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY)
  Cookies.remove(AUTH_TOKEN_VALUE)
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_TOKEN_VALUE)
  return Cookies.remove(AUTH_TOKEN_VALUE)
}

export const removeAuth = () => {
  removeToken()
}

export const hasToken = () => {
  return !isEmpty(getToken())
}

export const parseToken = (token: string) => {
  try {
    const [, bodyEncrypted] = token.split('.')
    const body = JSON.parse(Base64.decode(bodyEncrypted))
    const info = JSON.parse(body.sub)
    return info
  } catch(e) {
    console.error(e)
  }
  return null
}

/**
 * token 是否有效（普通 模式）
 * @returns {boolean} true： 有效；false：无效
 */
export const isValidToken = () => {
  return !isEmpty(getToken());
};

/**
* token 是否有效（JWT 模式）
* @returns {boolean} true： 有效；false：无效
*/
export const isValidTokenJwt = () => {
  const token = getToken();
  return !isEmpty(token) && parseToken(token as string) !== null;
};

/**
* 获取-用户信息
* @returns {any | {}}
*/
export const getUserInfo = () => {
  try {
      return JSON.parse((localStorage as any).getItem(USER_INFO_KEY)) || parseToken(getToken() as string) || {}
  } catch (e) {
      //
  }
  return {};
};

/**
* 设置-用户信息
* @param userInfo {userId:'',userName:''} TODO 暂时 any 还不清楚API到底返回什么值
*/
export const setUserInfo = (userInfo: any) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};
