import axios from 'axios'
// import source from '@/store/modules/endpoint'
// import { useAuthen } from '@/stores/authen'



const instanceApi = (authentication = true) =>{

    //console.log("API URL : ", process.env.VUE_APP_API);
    
    const http = axios.create({ baseURL: process.env.VUE_APP_API });
    http.defaults.headers.common['Content-Type'] = 'application/json';
    if(authentication){
        http.defaults.headers.common['Authorization'] = "Bearer " + localStorage._token;
       
    }
    return http;
}

export default {
    instanceApi
}

export {
    instanceApi
}
