// URL JSON yang berisi data template
const url = 'https://raw.githubusercontent.com/konokae/sl/main/datatheme/template_collect.json';

// Fungsi untuk mengambil data dari URL JSON
async function fetchTemplates() {
    try {
        const response = await fetch(url);
        const templates = await response.json();
        return templates;
    } catch (error) {
        console.error('Error fetching templates:', error);
        return [];
    }
}

// Fungsi untuk memanggil template berdasarkan id
async function getTemplateById(id) {
    const templates = await fetchTemplates();
    const template = templates.find(t => t.id === id);
    if (template) {
        return template.template;
    } else {
        return '<p>Template tidak ditemukan</p>'; // atau sesuaikan dengan pesan yang diinginkan
    }
}

// Mengambil semua elemen div dengan ID yang dimulai dengan "shortcode-"
const shortcodeDivs = document.querySelectorAll('div[id^="shortcode-"]');

// Memuat dan menempatkan template ke dalam masing-masing elemen div
shortcodeDivs.forEach(async div => {
    const templateId = div.id.split('-')[1]; // Mendapatkan id dari shortcode
    const templateContent = await getTemplateById(templateId);
    div.innerHTML = templateContent;
});
