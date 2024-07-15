document.addEventListener('DOMContentLoaded', function() {
    var sizes = {
        '336x280': { width: 336, height: 280 },
        '300x250': { width: 300, height: 250 },
        '728x90': { width: 728, height: 90 },
        '970x90': { width: 970, height: 90 },
        '970x250': { width: 970, height: 250 },
        '300x600': { width: 300, height: 600 },
        '160x600': { width: 160, height: 600 },
        '320x100': { width: 320, height: 100 },
        '320x50': { width: 320, height: 50 }
    };

    // Fungsi untuk menyesuaikan ukuran gambar berdasarkan class size
    Object.keys(sizes).forEach(function(size) {
        var elements = document.querySelectorAll('.size-' + size.replace('x', ''));
        elements.forEach(function(element) {
            element.style.width = sizes[size].width + 'px';
            element.style.height = sizes[size].height + 'px';
        });
    });

    // Fungsi untuk mengganti shortcode dengan konten iklan
    function replaceShortcodes() {
        var shortcodes = document.querySelectorAll('[data-shortcode]');
        shortcodes.forEach(function(shortcode) {
            var adId = shortcode.getAttribute('data-shortcode').match(/ad id="(\d+)"/)[1];
            fetch('/get_ad.php?id=' + adId)
                .then(response => response.json())
                .then(data => {
                    var adHtml = '<img src="' + data.image_url + '" width="' + sizes[data.size].width + '" height="' + sizes[data.size].height + '" alt="' + data.title + '">';
                    shortcode.innerHTML = adHtml;
                });
        });
    }

    // Panggil fungsi untuk mengganti shortcode setelah halaman dimuat
    replaceShortcodes();
});
