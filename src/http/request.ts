import Http from './http';
import { requestInterceptorFulfill, responseInterceptorFulfill, responseInterceptorRejected } from './http-interceptor';

export const AppHttp = new Http({baseURL: import.meta.env.VITE_APP_API})
AppHttp.requestInterceptor(requestInterceptorFulfill)
AppHttp.responseInterceptor(responseInterceptorFulfill, responseInterceptorFulfill)