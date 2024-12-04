document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle
    const menu = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const cartIcon = document.querySelector('#cart-icon');
    const cartPreview = document.querySelector('#cart-preview');

    // Toggle menu untuk mobile
    menu.onclick = () => {
        navbar.classList.toggle('active');
    };

    // Hapus menu saat scroll
    window.onscroll = () => {
        navbar.classList.remove('active');
    };

    // Inisialisasi cart dari localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Fungsi untuk memperbarui preview cart
    function updateCartPreview() {
        const cartPreviewItems = document.getElementById('cart-preview-items');
        const cartPreviewTotal = document.getElementById('cart-preview-total');
        
        if (!cartPreviewItems || !cartPreviewTotal) return;

        cartPreviewItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-preview-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-preview-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.quantity}x Rp. ${item.price.toLocaleString('id-ID')}</p>
                </div>
            `;
            cartPreviewItems.appendChild(itemElement);
        });

        cartPreviewTotal.textContent = `Rp. ${total.toLocaleString('id-ID')}`;
        updateCartCounter();
    }

    // Fungsi untuk memperbarui counter cart
    function updateCartCounter() {
        const counter = document.createElement('span');
        counter.className = 'cart-counter';
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = totalItems;

        // Hapus counter yang ada
        const existingCounter = cartIcon.querySelector('.cart-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        // Tambahkan counter baru jika ada item
        if (totalItems > 0) {
            cartIcon.appendChild(counter);
        }
    }

    // Fungsi untuk menambahkan item ke cart
    window.addToCart = (name, price, image) => {
        const existingItemIndex = cart.findIndex(item => item.name === name);
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                name,
                price,
                image,
                quantity: 1
            });
        }

        // Simpan ke localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartPreview();
        showNotification(`${name} ditambahkan ke keranjang!`);
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
        
        // Animasi fade in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hapus notifikasi setelah 2 detik
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // Event listener untuk cart icon
    if (cartIcon && cartPreview) {
        cartIcon.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    // Inisialisasi ScrollReveal
    const sr = ScrollReveal({
        origin: 'top',
        distance: '40px',
        duration: 2000,
        reset: true
    });

    // Animasi ScrollReveal
    sr.reveal('.home-text, .home-image', { interval: 200 });
    sr.reveal('.about-image, .about-text', { interval: 200 });
    sr.reveal('.box, .s-box', { interval: 200 });
    sr.reveal('.btn, .contact-box', { interval: 200 });

    // Update cart preview saat halaman dimuat
    updateCartPreview();
});