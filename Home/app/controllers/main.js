import ProductServices from "../../app/services/product-services.js";
const services = new ProductServices();

const getEle = (id) => {
    return document.getElementById(id)
}

const getListProduct = () => {
    // Hiển thị loader khi đang tải dữ liệu
    const loader = getEle("loader");
    if (loader) loader.style.display = "block";
    const promise = services.getListProductApi();
    promise
        .then((result) => {
            // Ẩn loader khi đã tải xong
            if (loader) loader.style.display = "none";
            renderListProduct(result.data);
        })
        .catch((error) => {
            console.log(error);
            if (loader) loader.style.display = "none";
        });
}

// Gọi getListProduct để lấy dữ liệu và tránh lỗi biến không sử dụng
$(document).ready(function () {
    getListProduct();  // Call getListProduct when the document is ready
});

// Hàm hiển thị sản phẩm dưới dạng card
const renderListProduct = (data) => {
    console.log(data);
    let contentHTML = "";

    // Tạo đối tượng định dạng số với dấu phân cách hàng nghìn và ký hiệu đồng Việt Nam
    const currencyFormat = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,  // Không hiển thị số thập phân
    });

    // Lặp qua tất cả sản phẩm và tạo card cho mỗi sản phẩm
    for (let i = 0; i < data.length; i++) {
        const product = data[i];

        // Định dạng giá sản phẩm trước khi hiển thị
        const formattedPrice = currencyFormat.format(product.price);

        // Fallback image nếu product.image bị thiếu hoặc trống
        const imageSrc = product.image && product.image.trim() !== ""
            ? `./../../assets/img/${product.image}`
            : "./../../assets/img/default.png";

        contentHTML += `
        <div class="product-item">
            <img src="${imageSrc}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p class="price">${formattedPrice}</p>
            <p>${product.screen} inch</p>
            <p>${product.blackCamera} MP Black Camera</p>
            <p>${product.frontCamera} MP Front Camera</p>
            <p>${product.desc}</p>
            <button class="btn-buy" onclick="onAddToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${imageSrc}')">Add to Cart</button>
        </div>
        `;
    }

    // Đưa các card sản phẩm vào phần tử chứa (div) có id "product-list"
    getEle("product-list").innerHTML = contentHTML;
}

// Hàm thêm sản phẩm vào giỏ hàng (hoặc các hành động khác)
(function () {
    "use strict";

    // Biến để lưu trữ các sản phẩm trong giỏ hàng
    let cart = [];

    // Hàm kiểm tra và tải giỏ hàng từ localStorage khi trang được tải lại
    const loadCartFromLocalStorage = () => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart); // Nếu có, chuyển từ JSON string sang object
            updateCartCount(); // Cập nhật số lượng giỏ hàng
            renderCart(); // Hiển thị giỏ hàng
        }

        const cartModalClosed = localStorage.getItem('cartModalClosed');
        if (cartModalClosed === "true") {
            // Nếu giỏ hàng đã được đóng hoặc thanh toán, không hiển thị popup
            document.getElementById('cart-modal').style.display = "none";
        } else {
            // Nếu không, hiển thị giỏ hàng
            renderCart();
        }
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    window.onAddToCart = (productId, productName, productPrice, productImage) => {
        console.log(`Added product with ID: ${productId} to cart.`);

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const productIndex = cart.findIndex(item => item.productId === productId);

        if (productIndex === -1) {
            // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
            cart.push({
                productId,
                productName,
                productPrice,
                productImage,
                quantity: 1
            });
        } else {
            // Nếu sản phẩm đã có, tăng số lượng lên 1
            cart[productIndex].quantity++;
        }

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Cập nhật số lượng giỏ hàng hiển thị
        updateCartCount();
    };

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    const updateCartCount = () => {
        const cartCountElement = document.getElementById('cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    };

    // Hàm định dạng giá tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Hàm tính tổng giỏ hàng
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);
    };

    // Hàm hiển thị giỏ hàng
    window.renderCart = () => {
        const cartModal = document.getElementById('cart-modal');
        const cartItemsContainer = cartModal.querySelector('#cart-body'); // Thay đổi ID từ cart-items thành cart-body

        // Làm rỗng giỏ hàng trước khi thêm lại
        cartItemsContainer.innerHTML = "";

        // Kiểm tra nếu giỏ hàng trống
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<tr><td colspan='6'>Giỏ hàng của bạn đang trống.</td></tr>";
        } else {
            // Duyệt qua giỏ hàng và tạo ra các dòng <tr> cho mỗi sản phẩm
            cart.forEach(item => {
                // Tính tổng giá của sản phẩm
                const totalPrice = item.productPrice * item.quantity;

                // Định dạng giá sản phẩm và tổng giá
                const formattedPrice = formatCurrency(item.productPrice);
                const formattedTotalPrice = formatCurrency(totalPrice);

                // Tạo HTML cho mỗi sản phẩm
                const productHTML = `
                    <tr>
                        <td><img src="${item.productImage}" alt="${item.productName}" width="50" /></td>
                        <td>${item.productName}</td>
                        <td>${item.productPrice} đ</td>
                        <td>
                            <div class="quantity-container">
                                <button onclick="decreaseQuantity(${item.productId})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="increaseQuantity(${item.productId})">+</button>
                            </div>
                        </td>
                        <td>${totalPrice} đ</td>
                        <td><button onclick="removeFromCart(${item.productId})">Xóa</button></td>
                    </tr>
                `;
                cartItemsContainer.innerHTML += productHTML;  // Thêm dòng <tr> vào bảng
            });

            // Tính tổng giỏ hàng và thêm vào phần footer
            const total = calculateTotal();
            const formattedTotal = formatCurrency(total);

            const totalHTML = `
                <tr>
                    <td colspan="4">Tổng cộng:</td>
                    <td colspan="2">${formattedTotal}</td>
                </tr>
            `;
            cartItemsContainer.innerHTML += totalHTML;  // Thêm dòng tổng cộng
        }

        // Hiển thị modal giỏ hàng
        cartModal.style.display = "block";
    };

    // Hàm đóng giỏ hàng
    window.closeCart = () => {
        document.getElementById('cart-modal').style.display = "none";
        // Lưu trạng thái giỏ hàng đã đóng vào localStorage
        localStorage.setItem('cartModalClosed', "true");
    };

    // Hàm tăng số lượng sản phẩm trong giỏ hàng
    window.increaseQuantity = (productId) => {
        const productIndex = cart.findIndex(item => item.productId === productId);
        if (productIndex !== -1) {
            cart[productIndex].quantity++;
        }
        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();  // Cập nhật giỏ hàng sau khi thay đổi
    };

    // Hàm giảm số lượng sản phẩm trong giỏ hàng
    window.decreaseQuantity = (productId) => {
        const productIndex = cart.findIndex(item => item.productId === productId);
        if (productIndex !== -1 && cart[productIndex].quantity > 1) {
            cart[productIndex].quantity--;
        }
        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();  // Cập nhật giỏ hàng sau khi thay đổi
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    window.removeFromCart = (productId) => {
        cart = cart.filter(item => item.productId !== productId);  // Lọc bỏ sản phẩm khỏi giỏ hàng
        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();  // Cập nhật giỏ hàng sau khi thay đổi
    };

    // Hàm thanh toán (clear giỏ hàng)
    window.checkout = () => {
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        
        // Xử lý thanh toán ở đây (ví dụ: gửi dữ liệu tới server)
        alert("Thanh toán thành công!");

        // Xóa giỏ hàng (reset mảng giỏ hàng)
        cart = [];

        // Lưu giỏ hàng vào localStorage (lưu giỏ hàng rỗng)
        localStorage.setItem('cart', JSON.stringify(cart));

        // Cập nhật lại số lượng giỏ hàng
        updateCartCount();
        
        // Cập nhật giao diện giỏ hàng sau khi thanh toán
        renderCart();  // Giỏ hàng trống sau khi thanh toán
        closeCart();   // Đóng modal giỏ hàng

        // Cập nhật trạng thái giỏ hàng đã đóng vào localStorage
        localStorage.setItem('cartModalClosed', "true");
    };

    // Tải giỏ hàng từ localStorage khi trang được tải lại
    loadCartFromLocalStorage();

})();










