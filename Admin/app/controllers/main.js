import ProductServices from "../services/product-services.js"
import Product from "../models/product.js";
const services = new ProductServices();
const getEle = (id) => {
    return document.getElementById(id)
}

const getListProduct = () => {
    /**
     * - Pending Thời gian chờ thực hiện lời hứa
        - Resolve: Thành công
        - Reject: Thất bại
     */
    //Pending => Loader display
    getEle("loader").style.display = "block"
    const promise = services.getListProductApi();
    promise
        .then((result) => {
            //Loader an
            getEle("loader").style.display = "none"
            renderListProduct(result.data);
        })
        .catch((error) => {
            console.log(error);
        });
}

const renderListProduct = (data) => {
    console.log(data)
    let contentHTML = "";
    for (let i = 0; i < data.length; i++) {
        const product = data[i];
        contentHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
            <img src="./../../assets/img/${product.image}" width="50" />
            </td>
            <td>${product.description}</td>
            <td class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="onEditProduct(${product.id})">Edit</td>
            <td class="btn btn-danger" onclick="onDeleteProduct(${product.id})">Delete</td>
            

        </tr>
        `
    }
    getEle("tblDanhSachSP").innerHTML = contentHTML;
}
/**Delete
 */
const onDeleteProduct = (id) => {
    const promise = services.deleteProductApi(id);

    promise
        .then((result) => {
            console.log(result.data)
            // Refresh the product list after deletion
            alert(`Delete Proct ${result.data.name} Success`)
            getListProduct();
        })
        .catch((error) => {
            console.log(error);
        });
}
window.onDeleteProduct = onDeleteProduct;


getListProduct();




const getValue = () => {
    const name = getEle("TenSP").value;
    const price = getEle("GiaSP").value * 1;
    const image = getEle("HinhSP").value;
    const desc = getEle("MoTa").value;

    //tao object tu class product
    const product = new Product("", name, price, image, desc);
    return product;
}





//Open Modal
getEle("btnThemSP").onclick = function () {
    //update title modal
    document.getElementsByClassName("modal-title")[0].innerHTML = "Add Product";

    //create "Add" button => footer modal
    const btnAdd = `<button class="btn btn-success" onclick="onAddProduct()">Add</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnAdd;
};

/**
Add Product 
 */

const onAddProduct = () => {
    const product = getValue();
    console.log(product);
    const promise = services.addProductApi(product);

    promise
        .then((result) => {
            console.log(result.data)
            // Refresh the product list after deletion
            alert(`Add Proct ${result.data.name} Success`)
            getListProduct();
        })
        .catch((error) => {
            console.log(error);
        });

}

window.onAddProduct = onAddProduct;

/**
Edit Product 
 */

const onEditProduct = (id) => {
    const promise = services.getProductById(id);
    promise
        .then((result) => {
            const product = result.data;
            // Dom toi the input va show value ra
            getEle("TenSP").value = product.name;
            getEle("GiaSP").value = product.price;
            getEle("HinhSP").value = product.image;
            getEle("MoTa").value = product.description;
        })
        .catch((error) => {
            console.log(error);
        });
    //update title modal
    document.getElementsByClassName("modal-title")[0].innerHTML = "Edit Product";


    //them button update
    const btnUpdate = `<button class="btn btn-info" onclick="onUpdateProduct(${id})">Update</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnUpdate;
}

window.onEditProduct = onEditProduct;

/**
Update Product 
 */

const onUpdateProduct = (id) => {
    //lay thong tin tu nguoi dung
    const product = getValue();
    product.id = id;
    console.log(product);
    const promise = services.updateProductApi(product);
    promise
        .then((result) => {
            alert(`Update ${result.data.name} seccess!`)
            document.getElementsByClassName("close")[0].click();
            getListProduct();
        })
        .catch((error) => {
            console.log(error);
        });

}
window.onUpdateProduct = onUpdateProduct;