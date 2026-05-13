import axios from 'axios';
import { store } from '@/plugins/store';
import qs from 'qs';

const axiosInstance = axios.create({
                                     baseURL: process.env.VUE_APP_API || '' ,
                                   });

axiosInstance.defaults.paramsSerializer = function (params) {
    return qs.stringify(params, {arrayFormat: 'repeat'});
};                           

axiosInstance.interceptors
             .response
             .use(response => response,
                  error => {
                    // permets de décoder les retours d'erreur au format blob ex : erreur lors du get d'un pdf, le message d'erreur est dans le blob
                    if (
                      error.request.responseType === 'blob' &&
                      error.response.data instanceof Blob &&
                      error.response.data.type &&
                      error.response.data.type.toLowerCase().indexOf('json') != -1
                    ) {
                      return new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => {
                              if(reader.result){
                                  error.response.data = JSON.parse(String(reader.result));
                              }
                              resolve(Promise.reject(error));
                          };
          
                          reader.onerror = () => {
                              reject(error);
                          };
          
                          reader.readAsText(error.response.data);
                      });
                    }

                    return Promise.reject(error);
                  },
             );
        
axiosInstance.interceptors
             .request
             .use(request => {
                   request.headers = request.headers || {};
                   request.headers['Authorization'] = `Bearer ${store.state.authState.token}`;
                   return Promise.resolve(request);
             });
           
           


export {
  axiosInstance as http,
};
