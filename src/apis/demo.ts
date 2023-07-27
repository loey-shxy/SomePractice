import { AppHttp } from '../http/request';
import { handlerArrayData } from '../http/request-util';

export interface IUser {
  id: number;
  name: string;
  email: string;
}

export const apiUserInfo = async (params?: any, loading = false): Promise<Array<IUser>> => {
  return handlerArrayData(
    await AppHttp.get({
      url: '/demo/user',
      data: params,
      loading
    })
  )
}

export const apiConcurrentUserInfo = async (functions: any, loading = false): Promise<any> => { 
  return await AppHttp.runningPool(functions)
}