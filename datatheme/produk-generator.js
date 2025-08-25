

        let autoId = 1;
        async function fetchBlogspotData(feedUrl, isPost = true) {
          const response = await fetch(feedUrl);
          const data = await response.json();

          return data.feed.entry.map(entry =&gt; {
            const title = entry.title.$t;
            const url = entry.link.find(link =&gt; link.rel === &#39;alternate&#39;).href;
            const content = entry.content?.$t || &#39;&#39;;

            const categoryMatch = content.match(/<!--\s*Category:\s*(.*?)\s*-->/i);
            const category = categoryMatch ? categoryMatch[1].trim() : (entry.category?.[0]?.term || &#39;Uncategorized&#39;);

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
        }

        function groupByCategory(data) {
          const categoryMap = {};
          data.forEach(item =&gt; {
            item.labels.forEach(label =&gt; {
              if (!categoryMap[label]) {
                categoryMap[label] = [];
              }
              categoryMap[label].push(item);
            });
          });
          return categoryMap;
        }

        function createLinkItem(link) {
          return `
            <a class='text-decoration-none d-block mb-2' href='${link.url}' target='_blank'>
              <div class='d-flex align-items-center p-3 rounded shadow-sm bg-white border-start border-4 border-primary'>
                <div class='fs-5 fw-bold text-muted'>${link.id}</div>
                <div class='flex-grow-1 px-3 fw-semibold'>${link.title}</div>
                <iconify-icon icon='mdi:tag' width='20'/>
              </div>
            </a>`;
        }

        function createCategorySection(category, links) {
          return `
            <div class='my-category'><i class='fa fa-th-large'/> ${category}</div>
            <div class='my-link-list'>
              ${links.slice(0,5).map(createLinkItem).join(&#39;&#39;)}
            </div>`;
        }

        async function renderContent() {
          const contentContainer = document.getElementById(&#39;my-content-container&#39;);
          const pagesData = await fetchBlogspotData(&#39;https://tikshoope.blogspot.com/feeds/pages/default?alt=json&amp;max-results=100&#39;);
          const postsData = await fetchBlogspotData(&#39;https://tikshoope.blogspot.com/feeds/posts/default?alt=json&amp;max-results=100&#39;);

          const combinedData = [...pagesData, ...postsData];
          const uniqueData = combinedData.filter((item, index, self) =&gt;
            index === self.findIndex(t =&gt; t.url === item.url)
          );

          const grouped = groupByCategory(uniqueData);
          const excludedCategories = [&#39;satu&#39;, &#39;LP&#39;, &#39;Uncategorized&#39;];

          const columns = [&#39;&#39;, &#39;&#39;, &#39;&#39;];
          let i = 0;
          for (const [category, links] of Object.entries(grouped)) {
            if (!excludedCategories.includes(category)) {
              columns[i % 3] += createCategorySection(category, links);
              i++;
            }
          }

          columns.forEach(column =&gt; {
            const columnDiv = document.createElement(&#39;div&#39;);
            columnDiv.className = &#39;my-column&#39;;
            columnDiv.innerHTML = column;
            contentContainer.appendChild(columnDiv);
          });
        }

        renderContent();

(function() {
  // === Bagian Kode Kedua (Generator Detail Produk) ===
  const target = document.getElementById(&quot;my-content-produk&quot;);
  if (!target) return;

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

  // Inject style khusus
  const style = document.createElement(&quot;style&quot;);
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

  // Jalankan fungsi
  function formatRupiah(number) {
    if (isNaN(number) || number === &#39;&#39;) return &#39;Harga&#39;;
    return Number(number).toLocaleString(&#39;id-ID&#39;, {
      style: &#39;currency&#39;,
      currency: &#39;IDR&#39;,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function updatePreview() {
    const previewTitle = document.getElementById(&#39;preview-title&#39;);
    const previewPrice = document.getElementById(&#39;preview-price&#39;);
    const previewDesc = document.getElementById(&#39;preview-desc&#39;);
    const previewCategory = document.getElementById(&#39;preview-category&#39;);
    const previewImg = document.getElementById(&#39;preview-img&#39;);
    const previewLinksContainer = document.getElementById(&#39;preview-links&#39;);

    previewTitle.textContent = document.getElementById(&#39;productTitle&#39;).value || &#39;Judul Produk&#39;;
    previewPrice.textContent = formatRupiah(document.getElementById(&#39;productPrice&#39;).value.replace(/\D/g, &#39;&#39;));
    previewDesc.textContent = document.getElementById(&#39;productDesc&#39;).value || &#39;Deskripsi Produk&#39;;
    previewCategory.textContent = &#39;Category: &#39; + (document.getElementById(&#39;productCategory&#39;).value || &#39;-&#39;);
    previewImg.src = document.getElementById(&#39;imageUrl&#39;).value || &#39;https://placehold.co/800x800/e2e8f0/000000?text=Gambar+Produk&#39;;

    previewLinksContainer.innerHTML = &#39;&#39;;
    if (document.getElementById(&#39;tiktokLink&#39;).value) {
      const btn = document.createElement(&#39;a&#39;);
      btn.href = document.getElementById(&#39;tiktokLink&#39;).value;
      btn.className = &#39;btn btn-dark d-flex align-items-center gap-2&#39;;
      btn.target = &#39;_blank&#39;;
      btn.innerHTML = `<i class='bi bi-tiktok'/> Via TikTok`;
      previewLinksContainer.appendChild(btn);
    }
    if (document.getElementById(&#39;shopeeLink&#39;).value) {
      const btn = document.createElement(&#39;a&#39;);
      btn.href = document.getElementById(&#39;shopeeLink&#39;).value;
      btn.className = &#39;btn btn-warning d-flex align-items-center gap-2 text-dark&#39;;
      btn.target = &#39;_blank&#39;;
      btn.innerHTML = `<i class='bi bi-cart'/> Via Shopee`;
      previewLinksContainer.appendChild(btn);
    }
  }

  document.getElementById(&#39;generateBtn&#39;).addEventListener(&#39;click&#39;, () =&gt; {
    updatePreview();
    document.getElementById(&#39;preview-section&#39;).style.display = &#39;block&#39;;
  });

  document.getElementById(&#39;copyBtn&#39;).addEventListener(&#39;click&#39;, () =&gt; {
    const previewContainer = document.getElementById(&#39;preview-container&#39;).innerHTML;
    const temp = document.createElement(&#39;textarea&#39;);
    temp.value = previewContainer;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand(&#39;copy&#39;);
    document.body.removeChild(temp);
    alert(&#39;Kode HTML berhasil disalin!&#39;);
  });

  // Isi default
  document.getElementById(&#39;productTitle&#39;).value = &#39;Anting juntai&#39;;
  document.getElementById(&#39;productPrice&#39;).value = &#39;15000&#39;;
  document.getElementById(&#39;productDesc&#39;).value = &#39;Anting juntai anting jurai&#39;;
  document.getElementById(&#39;productCategory&#39;).value = &#39;Anting&#39;;
  document.getElementById(&#39;imageUrl&#39;).value = &#39;https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/70d4e90277da4d2e88f83dffea7280d7~tplv-aphluv4xwc-resize-webp:800:800.webp&#39;;
  document.getElementById(&#39;shopeeLink&#39;).value = &#39;https://s.shopee.co.id/1VoZOElHhg&#39;;
  document.getElementById(&#39;tiktokLink&#39;).value = &#39;https://vt.tokopedia.com/t/ZSS2X97GE/&#39;;
  updatePreview();
})();
