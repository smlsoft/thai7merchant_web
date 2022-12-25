import { instanceApi } from '@/services/ProviderService'

export default {
    getCategory() {
        return instanceApi(true).get(`/product/category?limit=5000`).then(res => res.data);
    },
    getProductBarcode(limitPage , page) {
        console.log(`/product/barcode?limit=${limitPage}&page=${page}&sort=barcode:1`);
        return instanceApi(true).get(`/product/barcode?limit=${limitPage}&page=${page}&sort=barcode:1`).then(res => res.data);
    }
  
}
