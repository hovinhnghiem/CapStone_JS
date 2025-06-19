import ProductServices from "../../app/services/product-services.js";
import Product from "../../app/models/product.js";
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
    // Tạo đối tượng định dạng số với dấu phân cách hàng nghìn và ký hiệu đồng Việt Nam
    const currencyFormat = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,  // Không hiển thị số thập phân
    });
    for (let i = 0; i < data.length; i++) {
        const product = data[i];

        // Định dạng giá sản phẩm trước khi hiển thị
        const formattedPrice = currencyFormat.format(product.price);
        // Fallback image if product.image is missing or empty
        const imageSrc = product.image && product.image.trim() !== "" 
            ? `./../../assets/img/${product.image}` 
            : "./../../assets/img/default.png";
        contentHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${product.name}</td>
            <td>${formattedPrice}</td>
            <td>${product.screen} inch</td>
            <td>${product.blackCamera} MP</td>
            <td>${product.frontCamera} MP</td>
            <td>
            <img src="${imageSrc}" width="100" />
            </td>
            <td>${product.desc}</td>
            <td>${product.type}</td>
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
    const name = getEle("TenSP").value.trim();
    const price = getEle("GiaSP").value * 1;
    const screen = getEle("screen").value.trim();
    const blackCamera = getEle("CameraSau").value.trim();
    const frontCamera = getEle("CameraTruoc").value.trim();
    const image = getEle("HinhSP").value.trim();
    const desc = getEle("MoTa").value.trim();
    const type = getEle("brand").value.trim();

    // Tạo object product từ class Product
    const product = new Product("", name, price, screen, blackCamera, frontCamera, image, desc, type);

    // tạo flag (cờ)
    let isValid = true;

    // Lấy giá trị và loại bỏ khoảng trắng
    const nameProductValue = name.trim();

    /**
     * Validation tên sản phẩm
     */
    // 1. Không để trống Tên sản phẩm
    if (nameProductValue === "") {
        getEle("tbTenSP").innerText = "(*) Vui lòng nhập tên sản phẩm";
        getEle("tbTenSP").style.display = "block";
        isValid = false;
    }
    // 2. Hợp lệ
    else {
        getEle("tbTenSP").innerText = "";
        getEle("tbTenSP").style.display = "none";
    }

    // Nếu tên sản phẩm không hợp lệ -> dừng luôn
    if (!isValid) return null;

    // Kiểm tra giá sản phẩm
    if (isNaN(price) || price < 1000) {
        getEle("tbGiaSP").innerText = "(*) Giá sản phẩm phải là số và từ 1000 trở lên";
        getEle("tbGiaSP").style.display = "block";
        isValid = false;
    } else {
        getEle("tbGiaSP").innerText = "";
        getEle("tbGiaSP").style.display = "none";
    }

    // Nếu tên sản phẩm hoặc giá không hợp lệ -> dừng luôn
    if (!isValid) return null;

    // Kiểm tra giá sản phẩm
    if (isNaN(price) || price < 1000) {
        getEle("tbGiaSP").innerText = "(*) Giá sản phẩm phải là số và từ 1000 trở lên";
        getEle("tbGiaSP").style.display = "block";
        isValid = false;
    } else {
        getEle("tbGiaSP").innerText = "";
        getEle("tbGiaSP").style.display = "none";
    }

    // Nếu tên sản phẩm hoặc giá không hợp lệ -> dừng luôn
    if (!isValid) return null;

    // Kiểm tra kích thước màn hình
    const screenValue = parseFloat(screen); // Chuyển giá trị thành số thực
    if (isNaN(screenValue) || screenValue < 5.5 || screenValue > 10) {
        getEle("tbScreen").innerText = "(*) Kích thước màn hình phải là số từ 5.5 đến 10";
        getEle("tbScreen").style.display = "block";
        isValid = false;
    } else {
        getEle("tbScreen").innerText = "";
        getEle("tbScreen").style.display = "none";
    }
    // Nếu tên sản phẩm, giá hoặc kích thước màn hình không hợp lệ -> dừng luôn
    if (!isValid) return null;

    // Kiểm tra thông tin camera sau
    const blackCameraValue = getEle("CameraTruoc").value.trim();
    if (blackCameraValue === "") {
        getEle("tbCameraSau").innerText = "(*) Vui lòng nhập thông tin camera sau";
        getEle("tbCameraSau").style.display = "block";
        isValid = false;
    } else {
        const blackCameraNum = Number(blackCameraValue);
        if (isNaN(blackCameraNum) || blackCameraNum < 1 || blackCameraNum > 200) {
            getEle("tbCameraSau").innerText = "(*) Camera sau từ 1-200 Mb Pixcel";
            getEle("tbCameraSau").style.display = "block";
            isValid = false;
        } else {
            getEle("tbCameraSau").innerText = "";
            getEle("tbCameraSau").style.display = "none";
        }
    }
    if (!isValid) return null;

    // Nếu tên sản phẩm, giá, màn hình hoặc camera không hợp lệ -> dừng luôn
    if (!isValid) return null;

    // Validation camera trước – không để trống, trong khoảng 1 – 200
    const frontCameraValue = getEle("CameraTruoc").value.trim();
    if (frontCameraValue === "") {
        getEle("tbCameraTruoc").innerText = "(*) Vui lòng nhập thông tin camera trước";
        getEle("tbCameraTruoc").style.display = "block";
        isValid = false;
    } else {
        const frontCameraNum = Number(frontCameraValue);
        if (isNaN(frontCameraNum) || frontCameraNum < 1 || frontCameraNum > 200) {
            getEle("tbCameraTruoc").innerText = "(*) Camera trước từ 1-200 Mb Pixcel";
            getEle("tbCameraTruoc").style.display = "block";
            isValid = false;
        } else {
            getEle("tbCameraTruoc").innerText = "";
            getEle("tbCameraTruoc").style.display = "none";
        }
    }
    if (!isValid) return null;

    // Validation hãng điện thoại
    if (type === "") {
        getEle("tbHangDT").innerText = "(*) Vui lòng nhập hãng điện thoại";
        getEle("tbHangDT").style.display = "block";
        isValid = false;
    } else if (type.length > 50) {
        getEle("tbHangDT").innerText = "(*) Hãng điện thoại không được vượt quá 50 ký tự";
        getEle("tbHangDT").style.display = "block";
        isValid = false;
    } else {
        getEle("tbHangDT").innerText = "";
        getEle("tbHangDT").style.display = "none";
    }

    if (!isValid) return null;

    return product;
};



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
    if (!product) {
        return; // Nếu không hợp lệ (tên trống), không thực hiện thêm sản phẩm
    }

    console.log(product);
    const promise = services.addProductApi(product);

    promise
        .then((result) => {
            console.log(result.data);
            // Refresh the product list after addition
            alert(`Add Product ${result.data.name} Success`);
            getListProduct();
        })
        .catch((error) => {
            console.log(error);
        });
};

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
            getEle("screen").value = product.screen;
            getEle("CameraSau").value = product.blackCamera;
            getEle("CameraTruoc").value = product.frontCamera;
            getEle("HinhSP").value = product.image;
            getEle("MoTa").value = product.desc;
            getEle("brand").value = product.type;
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

const searchProduct = () => {
    // Lấy giá trị từ ô input tìm kiếm
    const searchTerm = getEle("searchInput").value.trim().toLowerCase();

    // Lấy danh sách sản phẩm hiện tại
    const promise = services.getListProductApi();
    promise
        .then((result) => {
            const data = result.data;

            // Tìm kiếm sản phẩm theo tên (tên sản phẩm chứa từ khóa tìm kiếm)
            const filteredData = data.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );

            // Hiển thị kết quả tìm kiếm
            renderListProduct(filteredData);
        })
        .catch((error) => {
            console.log(error);
        });
};

window.searchProduct = searchProduct;


//Sắp xếp sản phẩm theo giá
const sortProduct = () => {
    // Lấy giá trị lựa chọn sắp xếp từ ô select
    const sortOrder = getEle("sortPrice").value;

    // Lấy danh sách sản phẩm hiện tại
    const promise = services.getListProductApi();
    promise
        .then((result) => {
            const data = result.data;

            // Sắp xếp danh sách sản phẩm theo giá
            const sortedData = data.sort((a, b) => {
                if (sortOrder === "asc") {
                    // Sắp xếp từ thấp đến cao
                    return a.price - b.price;
                } else {
                    // Sắp xếp từ cao đến thấp
                    return b.price - a.price;
                }
            });

            // Hiển thị kết quả sắp xếp
            renderListProduct(sortedData);
        })
        .catch((error) => {
            console.log(error);
        });
};
window.sortProduct = sortProduct;
