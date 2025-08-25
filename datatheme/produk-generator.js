(function() {
  // === Bagian Kode Pertama: Memuat Konten Blogspot ===
  async function renderContent() {
    const contentContainer = document.getElementById('my-content-container');
    if (!contentContainer) {
      console.log('Elemen my-content-container tidak ditemukan. Melewatkan render konten.');
      return;
    }

    let autoId = 1;
    const fetchBlogspotData = async (feedUrl) => {
      try {
        const response = await fetch(feedUrl);
        const data = await response.json();
        return data.feed.entry.map(entry => {
          const title = entry.title.$t;
          const url = entry.link.find(link => link.rel === 'alternate').href;
          const content = entry.content?.$t || '';
          const categoryMatch = content.match(//i);
          const category = categoryMatch ? categoryMatch[1].trim() : (entry.category?.[0]?.term || 'Uncategorized');
          const rawIdMatch = entry.id?.$t?.match(/(?:post|page)-(\d+)/);
          let customId = autoId++;
          if (rawIdMatch) {
            const originalId = rawIdMatch[1];
            const first2 = originalId.substring(0, 2);
            const last1 = originalId.slice(-1);
            customId = `${first2}${last1}`;
          }
          const labels = [category];
          return { title, url, labels, id: customId };
        });
      } catch (error) {
        console.error('Gagal mengambil data Blogspot:', error);
        return [];
      }
    };

    const groupByCategory = (data) => {
      const categoryMap = {};
      data.forEach(item => {
        item.labels.forEach(label => {
          if (!categoryMap[label]) {
            categoryMap[label] = [];
          }
          categoryMap[label].push(item);
        });
      });
      return categoryMap;
    };

    const createLinkItem = (link) => {
      return `
        <a class='text-decoration-none d-block mb-2' href='${link.url}' target='_blank'>
          <div class='d-flex align-items-center p-3 rounded shadow-sm bg-white border-start border-4 border-primary'>
            <div class='fs-5 fw-bold text-muted'>${link.id}</div>
            <div class='flex-grow-1 px-3 fw-semibold'>${link.title}</div>
            <iconify-icon icon='mdi:tag' width='20'/>
          </div>
        </a>`;
    };

    const createCategorySection = (category, links) => {
      return `
        <div class='my-category'><i class='fa fa-th-large'/> ${category}</div>
        <div class='my-link-list'>
          ${links.slice(0, 5).map(createLinkItem).join('')}
        </div>`;
    };

    const pagesData = await fetchBlogspotData('https://tikshoope.blogspot.com/feeds/pages/default?alt=json&amp;max-results=100');
    const postsData = await fetchBlogspotData('https://tikshoope.blogspot.com/feeds/posts/default?alt=json&amp;max-results=100');
    
    const combinedData = [...pagesData, ...postsData];
    const uniqueData = combinedData.filter((item, index, self) =>
      index === self.findIndex(t => t.url === item.url)
    );
    const grouped = groupByCategory(uniqueData);
    const excludedCategories = ['satu', 'LP', 'Uncategorized'];
    const columns = ['', '', ''];
    let i = 0;
    for (const [category, links] of Object.entries(grouped)) {
      if (!excludedCategories.includes(category)) {
        columns[i % 3] += createCategorySection(category, links);
        i++;
      }
    }
    columns.forEach(column => {
      const columnDiv = document.createElement('div');
      columnDiv.className = 'my-column';
      columnDiv.innerHTML = column;
      contentContainer.appendChild(columnDiv);
    });
  }

  // === Bagian Kode Kedua: Generator Produk ===
  function renderProductGenerator() {
    const target = document.getElementById("my-content-produk");
    if (!target) {
      console.log('Elemen my-content-produk tidak ditemukan. Melewatkan render generator.');
      return;
    }

    target.innerHTML = `
      <div>
        <div class='card shadow-lg border-0 mb-4 mx-auto' style='max-width: 800px;'>
          <div class='card-body'>
            <h2 class='h4 fw-bold text-center mb-4'>Generator Detail Produk</h2>
            <div class='row g-3'>
              <div class='col-md-6'>
                <label class='form-label' for='productTitle'>Judul Produk</label>
                <input class='form-control' id='productTitle' placeholder='Masukkan judul produk...' type='text'/>
              </div>
              <div class='col-md-6'>
                <label class='form-label' for='productPrice'>Harga Produk</label>
                <input class='form-control' id='productPrice' placeholder='Masukkan harga produk (mis. 15000)' type='text'/>
              </div>
              <div class='col-md-6'>
                <label class='form-label' for='productDesc'>Deskripsi Produk</label>
                <textarea class='form-control' id='productDesc' placeholder='Deskripsikan produk...' rows='3'/>
              </div>
              <div class='col-md-6'>
                <label class='form-label' for='productCategory'>Kategori Produk</label>
                <input class='form-control' id='productCategory' placeholder='Masukkan kategori produk...' type='text'/>
              </div>
              <div class='col-md-6'>
                <label class='form-label' for='imageUrl'>URL Gambar Produk</label>
                <input class='form-control' id='imageUrl' placeholder='URL gambar...' type='text'/>
              </div>
              <div class='col-md-6'>
                <label class='form-label' for='shopeeLink'>Link Shopee</label>
                <input class='form-control' id='shopeeLink' placeholder='https://shopee.co.id/...' type='text'/>
              </div>
              <div class='col-md-6'>
                <label class='form-label' for='tiktokLink'>Link TikTok</label>
                <input class='form-control' id='tiktokLink' placeholder='https://vt.tiktok.com/...' type='text'/>
              </div>
            </div>
            <div class='mt-4 d-flex justify-content-center gap-3'>
              <button class='btn btn-primary px-4' id='generateBtn'>Generate Preview</button>
              <button class='btn btn-success px-4' id='copyBtn'>Salin HTML</button>
            </div>
          </div>
        </div>
        <div class='container-preview' id='preview-section'>
          <h3 class='h5 fw-bold text-center mb-4'>Live Preview</h3>
          <div id='preview-container'>
            <div class='container py-3'>
              <div class='row g-4 align-items-start'>
                <div class='col-lg-6 text-center'>
                  <img alt='Preview Gambar' class='img-fluid rounded shadow-sm' id='preview-img' src='https://placehold.co/800x800/e2e8f0/000000?text=Gambar+Produk'/>
                </div>
                <div class='col-lg-6'>
                  <h3 class='fw-bold' id='preview-title'>Judul Produk</h3>
                  <h5 class='text-danger mb-3' id='preview-price'>Harga</h5>
                  <p id='preview-desc'>Deskripsi Produk</p>
                  <div class='d-flex flex-wrap gap-2 mb-3' id='preview-links'/>
                  <p class='text-muted' id='preview-category'>Category: -</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .container-preview {
        max-width: 900px;
        margin: auto;
        background-color: #fff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        display: none;
      }
    `;
    document.head.appendChild(style);

    const formatRupiah = (number) => {
      if (isNaN(number) || number === '') return 'Harga';
      return Number(number).toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    };

    const updatePreview = () => {
      const previewTitle = document.getElementById('preview-title');
      const previewPrice = document.getElementById('preview-price');
      const previewDesc = document.getElementById('preview-desc');
      const previewCategory = document.getElementById('preview-category');
      const previewImg = document.getElementById('preview-img');
      const previewLinksContainer = document.getElementById('preview-links');
      
      const productTitle = document.getElementById('productTitle').value;
      const productPrice = document.getElementById('productPrice').value;
      const productDesc = document.getElementById('productDesc').value;
      const productCategory = document.getElementById('productCategory').value;
      const imageUrl = document.getElementById('imageUrl').value;
      const shopeeLink = document.getElementById('shopeeLink').value;
      const tiktokLink = document.getElementById('tiktokLink').value;

      previewTitle.textContent = productTitle || 'Judul Produk';
      previewPrice.textContent = formatRupiah(productPrice.replace(/\D/g, ''));
      previewDesc.textContent = productDesc || 'Deskripsi Produk';
      previewCategory.textContent = 'Category: ' + (productCategory || '-');
      previewImg.src = imageUrl || 'https://placehold.co/800x800/e2e8f0/000000?text=Gambar+Produk';

      previewLinksContainer.innerHTML = '';
      if (tiktokLink) {
        const btn = document.createElement('a');
        btn.href = tiktokLink;
        btn.className = 'btn btn-dark d-flex align-items-center gap-2';
        btn.target = '_blank';
        btn.innerHTML = `<i class='bi bi-tiktok'/> Via TikTok`;
        previewLinksContainer.appendChild(btn);
      }
      if (shopeeLink) {
        const btn = document.createElement('a');
        btn.href = shopeeLink;
        btn.className = 'btn btn-warning d-flex align-items-center gap-2 text-dark';
        btn.target = '_blank';
        btn.innerHTML = `<i class='bi bi-cart'/> Via Shopee`;
        previewLinksContainer.appendChild(btn);
      }
    };

    document.getElementById('generateBtn').addEventListener('click', () => {
      updatePreview();
      document.getElementById('preview-section').style.display = 'block';
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
      const previewContainer = document.getElementById('preview-container').innerHTML;
      const temp = document.createElement('textarea');
      temp.value = previewContainer;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      alert('Kode HTML berhasil disalin!');
    });

    document.getElementById('productTitle').value = 'Anting juntai';
    document.getElementById('productPrice').value = '15000';
    document.getElementById('productDesc').value = 'Anting juntai anting jurai';
    document.getElementById('productCategory').value = 'Anting';
    document.getElementById('imageUrl').value = 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/70d4e90277da4d2e88f83dffea7280d7~tplv-aphluv4xwc-resize-webp:800:800.webp';
    document.getElementById('shopeeLink').value = 'https://s.shopee.co.id/1VoZOElHhg';
    document.getElementById('tiktokLink').value = 'https://vt.tokopedia.com/t/ZSS2X97GE/';
    updatePreview();
  }

  // --- Jalankan Fungsi Setelah DOM Siap ---
  document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    renderProductGenerator();
  });
})();
