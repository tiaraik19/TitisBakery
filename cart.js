document.addEventListener('DOMContentLoaded', () => {
    // Mengambil referensi ke elemen-elemen yang diperlukan
    const cartItemsContainer = document.getElementById('cart-items');
    const totalItemsSpan = document.getElementById('total-items');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Mengambil data cart dari localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fungsi untuk merender cart
    function renderCart() {
        if (!cartItemsContainer) return;
        
        // Bersihkan container
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            // Tampilkan pesan jika keranjang kosong
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Keranjang belanja Anda masih kosong</p>
                    <a href="index.html#menu" class="btn">Lihat Menu</a>
                </div>
            `;
            totalItemsSpan.textContent = '0';
            totalPriceSpan.textContent = 'Rp. 0';
            return;
        }

        let totalItems = 0;
        let totalPrice = 0;

        // Render setiap item di cart
        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <p class="cart-item-price">Rp. ${(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
                <button class="remove-item" onclick="removeItem(${index})">
                    <i class='bx bx-trash'></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItemDiv);
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        // Update total
        totalItemsSpan.textContent = totalItems;
        totalPriceSpan.textContent = `Rp. ${totalPrice.toLocaleString('id-ID')}`;
    }

    // Fungsi untuk mengubah quantity
    window.changeQuantity = (index, change) => {
        if (index >= 0 && index < cart.length) {
            const newQuantity = cart[index].quantity + change;
            
            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
            } else {
                removeItem(index);
                return;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            showNotification(`Quantity ${cart[index].name} diperbarui`);
        }
    };

    // Fungsi untuk menghapus item
    window.removeItem = (index) => {
        if (index >= 0 && index < cart.length) {
            const removedItem = cart[index];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            showNotification(`${removedItem.name} dihapus dari keranjang`);
        }
    };

    // Fungsi untuk menampilkan notifikasi
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class='bx bx-check-circle'></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // Event listener untuk tombol checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Keranjang belanja masih kosong');
                return;
            }
            
            const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            if (confirm(`Total belanja Anda: Rp. ${totalPrice.toLocaleString('id-ID')}\nLanjutkan ke pembayaran?`)) {
                cart = [];
                localStorage.removeItem('cart');
                renderCart();
                showNotification('Terima kasih atas pembelian Anda!');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }

    // Render cart saat halaman dimuat
    renderCart();
});