(function(){
  // Fungsi utama untuk render produk
  window.renderProduk = function(targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;

    container.innerHTML = `
      <div class="card shadow-sm p-4 mb-3">
        <h3 class="fw-bold mb-3 text-center">Generator Produk</h3>

        <!-- Form input -->
        <div class="mb-3">
          <label class="form-label">Nama Produk</label>
          <input type="text" class="form-control" id="prod-name" placeholder="Masukkan nama produk"/>
        </div>
        <div class="mb-3">
          <label class="form-label">Harga Produk</label>
          <input type="text" class="form-control" id="prod-price" placeholder="Masukkan harga"/>
        </div>
        <div class="mb-3">
          <label class="form-label">Link Produk</label>
          <input type="text" class="form-control" id="prod-link" placeholder="Masukkan URL produk"/>
        </div>
        <div class="mb-3">
          <label class="form-label">Gambar Produk</label>
          <input type="text" class="form-control" id="prod-img" placeholder="URL gambar produk"/>
        </div>

        <button class="btn btn-primary w-100 mb-3" id="btn-generate">Generate</button>

        <!-- Preview produk -->
        <div id="prod-preview" class="border rounded p-3 d-none bg-light"></div>

        <!-- Hasil kode -->
        <div class="mt-3 d-none" id="prod-result">
          <label class="form-label fw-bold">Kode HTML:</label>
          <textarea class="form-control" rows="6" id="prod-code" readonly></textarea>
          <button class="btn btn-success mt-2 w-100" id="btn-copy">Copy Kode</button>
        </div>
      </div>
    `;

    // Event generate
    const btnGenerate = container.querySelector("#btn-generate");
    const preview = container.querySelector("#prod-preview");
    const resultBox = container.querySelector("#prod-result");
    const codeBox = container.querySelector("#prod-code");

    btnGenerate.addEventListener("click", () => {
      const name = container.querySelector("#prod-name").value || "Nama Produk";
      const price = container.querySelector("#prod-price").value || "Rp 0";
      const link = container.querySelector("#prod-link").value || "#";
      const img = container.querySelector("#prod-img").value || "https://placehold.co/600x400";

      const template = `
        <div class="card shadow-sm p-3 text-center">
          <img src="${img}" class="img-fluid rounded mb-3" alt="${name}"/>
          <h5 class="fw-bold">${name}</h5>
          <p class="text-muted">${price}</p>
          <a href="${link}" target="_blank" class="btn btn-primary">Beli Sekarang</a>
        </div>
      `;

      preview.innerHTML = template;
      preview.classList.remove("d-none");

      codeBox.value = template.trim();
      resultBox.classList.remove("d-none");
    });

    // Event copy
    const btnCopy = container.querySelector("#btn-copy");
    btnCopy.addEventListener("click", () => {
      codeBox.select();
      document.execCommand("copy");
      btnCopy.textContent = "✅ Copied!";
      setTimeout(() => btnCopy.textContent = "Copy Kode", 2000);
    });
  };
})();
