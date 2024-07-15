function copyToClipboard(modalId) {
    var copyText = document.querySelector('#' + modalId + ' code').innerText;
    var textarea = document.createElement('textarea');
    textarea.value = copyText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    var alertBox = document.getElementById('alert-' + modalId.split('-')[1]);
    alertBox.style.display = 'block';
    setTimeout(function() {
        alertBox.style.display = 'none';
    }, 2000);
}

// Fungsi untuk mengatur ukuran gambar berdasarkan class size
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

    Object.keys(sizes).forEach(function(size) {
        var elements = document.querySelectorAll('.size-' + size.replace('x', ''));
        elements.forEach(function(element) {
            element.style.width = sizes[size].width + 'px';
            element.style.height = sizes[size].height + 'px';
        });
    });
});
