import { isArray, isObject } from 'lodash';
import { Response } from './http';

/**
 * 处理表格数据
 * @param error
 * @param code
 * @param data
 * @returns {{total: number, list: Array}}
 */
const handlerTableData = function ({ error, code, data }: Response, preset = { total: 0, list: [] }) {
    return !error && code === '200' && isObject(data) ? data : preset;
};

/**
 * 处理返回数组的数据
 * @param error
 * @param code
 * @param data
 * @param preset
 * @returns {Array}
 */
const handlerArrayData = function ({ error, code, data }: Response, preset = []) {
    return !error && code === '200' && isArray(data) ? data : preset;
};

/**
 * 处理返回对象的数据
 * @param error
 * @param code
 * @param data
 * @param preset
 * @returns {*}
 */
const handlerObjectData = function ({ error, code, data }: Response, preset = {}) {
    return !error && code === '200' && isObject(data) ? data : preset;
};

/**
 * 处理返回任意类型的数据
 * @param error
 * @param code
 * @param data
 * @param preset
 * @returns {*}
 */
const handlerData = function ({ error, code, data }: Response, preset: any = '') {
    return !error && code === '200' ? data : preset;
};

/**
 * 处理api数据
 * @param error
 * @param code
 * @param data
 * @returns {{total: number, list: Array}}
 */
const handlerJsonData = function ({ error, code, data }: Response, preset = { total: 0, pageSize: 0, pageNum: 0, list: [] }) {
    if (!error && code === '200') {
        const jsonData = JSON.parse(data);
        preset = {
            list: jsonData.data,
            pageSize: jsonData.meta?.limit || 0,
            pageNum: jsonData.meta?.page || 0,
            total: jsonData.meta?.count || jsonData.data.length,
        }
    }
    return preset;
};

/**
 * url 拼接
 */
const getUrl = function (params: any, api: string) {
    try {
        const [, ip, port] = location.search.split(/ip=|&port=/);
        const url = `http://admin:public@${ip}:${port}/api/v4/${api}`
        delete params.total;
        const keys = Object.keys(params);
        let paramsUrl = '';
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === 'pageNum') {
                paramsUrl += `&_page=${params[keys[i]]}`;
            } else if (keys[i] === 'pageSize') {
                paramsUrl += `&_limit=${params[keys[i]]}`;
            } else if (params[keys[i]]) {
                paramsUrl += `&_${keys[i]}=${params[keys[i]]}`;
            }
        }
        return paramsUrl ? url + paramsUrl.replace('&', '?') : url;
    } catch(e) {
        console.log('网关apiJson数据不对')
    }
};

export { handlerTableData, handlerArrayData, handlerObjectData, handlerData, handlerJsonData, getUrl };
