import { instanceApi } from '@/services/ProviderService'

export default {
    login(username, password) {
        return instanceApi(false).post(`/login`, { "name": username, "username": username, "password": password });
    },
    getListShop() {
        return instanceApi(true).get(`/list-shop`).then(res => res.data);
    },
    selectShop() {
        return instanceApi(true).post(`/select-shop`, { "shopid": localStorage.shopid }).then(res => res.data);
    }

}

