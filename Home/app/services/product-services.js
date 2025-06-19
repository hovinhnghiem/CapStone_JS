class ProductServices {
    getListProductApi() {
        /**
         * - Pending Thời gian chờ thực hiện lời hứa
            - Resolve: Thành công
            - Reject: Thất bại
         */
        const promise = axios({
            url: "https://683dad13199a0039e9e670ab.mockapi.io/api/CapStone",
            merthod: "GET"
        })
        return promise;
    }
    deleteProductApi(id) {
        const promise = axios({
            url: `https://683dad13199a0039e9e670ab.mockapi.io/api/CapStone/${id}`,
            method: "DELETE"
        });
        return promise;
    }
    addProductApi(product) {
        const promise = axios({
            url: `https://683dad13199a0039e9e670ab.mockapi.io/api/CapStone`,
            method: "POST",
            data: product,
        });
        return promise;
    }
    getProductById(id) {
        const promise = axios({
            url: `https://683dad13199a0039e9e670ab.mockapi.io/api/CapStone/${id}`,
            method: "GET",

        });
        return promise;
    }

    updateProductApi(product) {
        const promise = axios({
            url: `https://683dad13199a0039e9e670ab.mockapi.io/api/CapStone/${product.id}`,
            method: "PUT",
            data: product,
        });
        return promise;
    }
}
export default ProductServices;