// Fungsi untuk membaca file sebagai ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Fungsi untuk mendownload file
function downloadFile(data, fileName, mimeType) {
    const blob = new Blob([data], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Konversi ArrayBuffer ke Base64
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
}

// Konversi Base64 ke ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Fungsi untuk mengenkripsi file
async function encryptFile() {
    const fileInput = document.getElementById("fileInput");
    const keyInput = document.getElementById("keyInput");
    const key = keyInput.value;

    if (fileInput.files.length === 0) {
        alert("Silakan pilih file untuk dienkripsi!");
        return;
    }
    if (!key || key.length !== 8) {
        alert("Kunci harus terdiri dari 8 karakter!");
        return;
    }

    const file = fileInput.files[0];
    const fileName = file.name; // Simpan nama file asli

    try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const base64Data = arrayBufferToBase64(arrayBuffer);

        const desKey = CryptoJS.enc.Utf8.parse(key);

        // Tambahkan metadata (nama file asli) sebelum mengenkripsi
        const dataWithMeta = `${fileName}::${base64Data}`;
        const encrypted = CryptoJS.DES.encrypt(dataWithMeta, desKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });

        // Simpan file terenkripsi
        downloadFile(encrypted.toString(), fileName + ".enc", "text/plain");
        alert("File berhasil dienkripsi!");
    } catch (error) {
        console.error("Gagal mengenkripsi file:", error);
        alert("Terjadi kesalahan saat mengenkripsi file!");
    }
}

// Fungsi untuk mendekripsi file
async function decryptFile() {
    const fileInput = document.getElementById("fileInput");
    const keyInput = document.getElementById("keyInput");
    const key = keyInput.value;

    if (fileInput.files.length === 0) {
        alert("Silakan pilih file terenkripsi untuk didekripsi!");
        return;
    }
    if (!key || key.length !== 8) {
        alert("Kunci harus terdiri dari 8 karakter!");
        return;
    }

    const file = fileInput.files[0];

    try {
        const encryptedText = await file.text(); // Membaca data terenkripsi
        const desKey = CryptoJS.enc.Utf8.parse(key);

        // Dekripsi teks
        const decrypted = CryptoJS.DES.decrypt(encryptedText, desKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });

        const originalDataWithMeta = CryptoJS.enc.Utf8.stringify(decrypted);

        // Pisahkan metadata (nama file asli) dan data Base64
        const separatorIndex = originalDataWithMeta.indexOf("::");
        if (separatorIndex === -1) {
            throw new Error("Metadata tidak ditemukan! File tidak valid.");
        }

        const originalFileName = originalDataWithMeta.slice(0, separatorIndex);
        const base64Data = originalDataWithMeta.slice(separatorIndex + 2);

        // Konversi Base64 kembali ke ArrayBuffer
        const arrayBuffer = base64ToArrayBuffer(base64Data);

        // Unduh file hasil dekripsi
        const mimeType = file.type === "text/plain" ? "application/pdf" : file.type;
        downloadFile(arrayBuffer, originalFileName, mimeType);
        alert("File berhasil didekripsi!");
    } catch (error) {
        console.error("Gagal mendekripsi file:", error);
        alert("Terjadi kesalahan saat mendekripsi file!");
    }
}