import { instanceApi } from '@/services/ProviderService'

export default {

    getInventoryList(limitPage, page, search, sortField, sortOrder) {
        //console.log('Page' + page);
        var q = "";
        if (search != "" && search != undefined && search != null) {
            q = "&q=" + search
        }
        //console.log(`/inventory?limit=${limitPage}&page=${page}${q}&sort=${sortField}:${sortOrder}`);
        return instanceApi(true).get(`/inventory?limit=${limitPage}&page=${page}${q}&sort=${sortField}:${sortOrder}`).then(res => res.data);
    },
    getInventoryDetail(data) {
        return instanceApi(true).get(`/inventory/` + data).then(res => res.data);
    },
    getInventoryDetailByBarcode(data) {
        return instanceApi(true).get(`/inventory/barcode/` + data).then(res => res.data);
    },
    createInventory(data) {
        return instanceApi(true).post(`/inventory`, data).then(res => res.data);
    },
    updateInventory(data) {
        return instanceApi(true).put(`/inventory/` + data.guidfixed, data).then(res => res.data);
    },

    delInventory(data) {
        return instanceApi(true).delete(`/inventory/` + data).then(res => res.data);
    },
    importProduct(data) {
        return instanceApi(true).post(`/import/inventory`, data).then(res => res.data);
    },

    getProductImport() {
        return instanceApi(true).get(`/import/inventory?limit=50000`).then(res => res.data);
    },

    delProductImport(data) {
        return instanceApi(true).delete(`/import/inventory`, { data: data }).then(res => res.data);
    },

    importCategory(data) {
        return instanceApi(true).post(`/import/category`, data).then(res => res.data);
    },

    getCategoryImport() {
        return instanceApi(true).get(`/import/category?limit=50000`).then(res => res.data);
    },

    delCategoryImport(data) {
        return instanceApi(true).delete(`/import/category`, { data: data }).then(res => res.data);
    },

    importOption(data) {
        return instanceApi(true).post(`/import/option`, data).then(res => res.data);
    },

    getOptionImport() {
        return instanceApi(true).get(`/import/option?limit=50000`).then(res => res.data);
    },

    delOptionImport(data) {
        return instanceApi(true).delete(`/import/option`, { data: data }).then(res => res.data);
    },

    importProcessProduct(data) {
        return instanceApi(true).post(`/inventory/bulk`, data).then(res => res.data);
    },


    getCategoryList() {
        return instanceApi(true).get(`/category?limit=50000`).then(res => res.data);
    },
    importProcessCategory(data) {
        return instanceApi(true).post(`/category/bulk`, data).then(res => res.data);
    },
    updateProductCategory(guid, data) {
        return instanceApi(true).post(`/inventory/categoryupdate/${guid}`, data).then(res => res.data);
    },

    createCategory(data) {
        return instanceApi(true).post(`/category`, data).then(res => res.data);
    },
    getCategoryDetail(data) {
        return instanceApi(true).get(`/category/` + data).then(res => res.data);
    },
    updateCategory(data) {
        return instanceApi(true).put(`/category/` + data.guidfixed, data).then(res => res.data);
    },


    createOption(data) {
        return instanceApi(true).post(`/option`, data).then(res => res.data);
    },
    getOption(data) {
        return instanceApi(true).get(`/option?limit=50000`).then(res => res.data);
    },
    getOptionDetail(data) {
        return instanceApi(true).get(`/option/` + data).then(res => res.data);
    },
    updateOption(data) {
        return instanceApi(true).put(`/option/` + data.guidfixed, data).then(res => res.data);
    },
    delOption(data) {
        return instanceApi(true).delete(`/option/` + data).then(res => res.data);
    },

    importImages(file, onUploadProgress) {
        let fd = new FormData()

        fd.append('file', file)
        return instanceApi(true).post(`/upload/productimage`, fd, { onUploadProgress }).then(res => res.data);
    },
    upLoadImages(file,) {
        let fd = new FormData()

        fd.append('file', file)
        return instanceApi(true).post(`upload/images`, fd).then(res => res.data);
    },

    //Unit
    getUnitList(limitPage, page, search, sortField, sortOrder) {
        var q = "";
        if (search != "" && search != undefined && search != null) {
            q = "&q=" + search
        }
        //console.log(`/unit?limit=${limitPage}&page=${page}${q}&sort=${sortField}:${sortOrder}`);
        return instanceApi(true).get(`/unit?limit=${limitPage}&page=${page}${q}&sort=${sortField}`).then(res => res.data);
    },
    getUnitById(data) {
        return instanceApi(true).get(`/unit/` + data).then(res => res.data);
    },
    createUnit(data) {
        return instanceApi(true).post(`/unit`, data).then(res => res.data);
    },
    updateUnit(data) {
        return instanceApi(true).put(`/unit/` + data.guidfixed, data).then(res => res.data);
    },
    delUnit(data) {
        return instanceApi(true).delete(`/unit/` + data).then(res => res.data);
    },
    delUnitSelected(units) {
        return instanceApi(true).delete(`/unit`, {data:units}).then(res => res.data);
    },
    
    //Warehouse
    getWarehouseList(limitPage, page, search, sortField, sortOrder) {
        var q = "";
        if (search != "" && search != undefined && search != null) {
            q = "&q=" + search
        }
        //console.log(`/unit?limit=${limitPage}&page=${page}${q}&sort=${sortField}:${sortOrder}`);
        return instanceApi(true).get(`/warehouse?limit=${limitPage}&page=${page}${q}&sort=${sortField}:${sortOrder}`).then(res => res.data);
    },
    getWarehouseById(data) {
        return instanceApi(true).get(`/warehouse/` + data).then(res => res.data);
    },
    createWarehouse(data) {
        return instanceApi(true).post(`/warehouse`, data).then(res => res.data);
    },
    updateWarehouse(data) {
        return instanceApi(true).put(`/warehouse/` + data.guidfixed, data).then(res => res.data);
    },
    delWarehouse(data) {
        return instanceApi(true).delete(`/warehouse/` + data).then(res => res.data);
    },

}
