(function(){
  const target = document.getElementById("my-content-produk");
  if(!target) return;

  target.innerHTML = `
    <div class="container my-4 p-4 border rounded shadow-sm bg-white">
      <h2 class="text-center mb-4">Generator Detail Produk</h2>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Judul Produk</label>
          <input type="text" id="productTitle" class="form-control" placeholder="Masukkan judul produk..." />
        </div>
        <div class="col-md-6">
          <label class="form-label">Harga Produk</label>
          <input type="text" id="productPrice" class="form-control" placeholder="Masukkan harga produk..." />
        </div>
        <div class="col-md-12">
          <label class="form-label">Deskripsi Produk</label>
          <textarea id="productDesc" rows="3" class="form-control" placeholder="Deskripsikan produk..."></textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label">Kategori Produk</label>
          <input type="text" id="productCategory" class="form-control" placeholder="Masukkan kategori produk..." />
        </div>
        <div class="col-md-6">
          <label class="form-label">URL Gambar Produk</label>
          <input type="text" id="imageUrl" class="form-control" placeholder="URL gambar..." />
        </div>
        <div class="col-md-6">
          <label class="form-label">Link Shopee</label>
          <input type="text" id="shopeeLink" class="form-control" placeholder="https://shopee.co.id/..." />
        </div>
        <div class="col-md-6">
          <label class="form-label">Link TikTok</label>
          <input type="text" id="tiktokLink" class="form-control" placeholder="https://vt.tiktok.com/..." />
        </div>
      </div>
      <div class="text-center mt-4">
        <button id="generateBtn" class="btn btn-primary me-2">Generate Preview</button>
        <button id="copyBtn" class="btn btn-success">Salin HTML</button>
      </div>

      <div id="preview-section" class="container mt-5 p-4 border rounded bg-light" style="display:none;">
        <h3 class="text-center mb-3">Live Preview</h3>
        <div id="preview-container">
          <div class="row">
            <div class="col-lg-6 text-center">
              <img id="preview-img" src="https://placehold.co/400x400" alt="Produk" class="img-fluid rounded shadow-sm" />
            </div>
            <div class="col-lg-6">
              <h3 class="fw-bold" id="preview-title">Judul Produk</h3>
              <h5 class="text-danger mb-3" id="preview-price">Harga</h5>
              <p id="preview-desc">Deskripsi Produk</p>
              <div id="preview-links" class="d-flex flex-wrap gap-2 mb-3"></div>
              <p id="preview-category" class="text-muted">Category: -</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const productTitleInput = document.getElementById('productTitle');
  const productPriceInput = document.getElementById('productPrice');
  const productDescInput = document.getElementById('productDesc');
  const productCategoryInput = document.getElementById('productCategory');
  const imageUrlInput = document.getElementById('imageUrl');
  const shopeeLinkInput = document.getElementById('shopeeLink');
  const tiktokLinkInput = document.getElementById('tiktokLink');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const previewSection = document.getElementById('preview-section');

  const previewTitle = document.getElementById('preview-title');
  const previewPrice = document.getElementById('preview-price');
  const previewDesc = document.getElementById('preview-desc');
  const previewCategory = document.getElementById('preview-category');
  const previewImg = document.getElementById('preview-img');
  const previewLinksContainer = document.getElementById('preview-links');

  function formatRupiah(number) {
    if (isNaN(number) || number === '') {
      return 'Harga';
    }
    return Number(number).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    });
  }

  function updatePreview() {
    previewTitle.textContent = productTitleInput.value || 'Judul Produk';
    previewPrice.textContent = formatRupiah(productPriceInput.value.replace(/\D/g, ''));
    previewDesc.textContent = productDescInput.value || 'Deskripsi Produk';
    previewCategory.textContent = 'Category: ' + (productCategoryInput.value || '-');
    previewImg.src = imageUrlInput.value || 'https://placehold.co/400x400';
    previewLinksContainer.innerHTML = '';

    if (tiktokLinkInput.value) {
      previewLinksContainer.innerHTML += '<a href="'+tiktokLinkInput.value+'" target="_blank" class="btn btn-dark"><i class="bi bi-tiktok"></i> Via TikTok</a>';
    }
    if (shopeeLinkInput.value) {
      previewLinksContainer.innerHTML += '<a href="'+shopeeLinkInput.value+'" target="_blank" class="btn btn-warning text-white"><i class="bi bi-cart"></i> Via Shopee</a>';
    }
  }

  generateBtn.addEventListener('click', function() {
    updatePreview();
    previewSection.style.display = 'block';
  });

  copyBtn.addEventListener('click', function() {
    const previewContainer = document.getElementById('preview-container').innerHTML;
    const tempElement = document.createElement('textarea');
    tempElement.value = previewContainer;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
    alert('Kode HTML berhasil disalin!');
  });

})();
