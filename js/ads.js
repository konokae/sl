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

// Memuat template berdasarkan script tag dengan atribut data-shortcode
async function loadTemplates() {
    const scriptTags = document.querySelectorAll('script[data-shortcode]');

    for (const scriptTag of scriptTags) {
        const templateId = scriptTag.getAttribute('data-shortcode');
        const templateContent = await getTemplateById(templateId);
        
        // Membuat elemen div untuk menempatkan template
        const div = document.createElement('div');
        div.innerHTML = templateContent;

        // Menempatkan elemen div setelah script tag
        scriptTag.parentNode.insertBefore(div, scriptTag.nextSibling);
    }
}

// Memuat template setelah halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadTemplates);
