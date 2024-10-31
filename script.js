
function caesarCipher(text, shift, preserve = true) {
    shift = ((shift % 26) + 26) % 26;
    
    return text.split('').map(char => {
        if (!/[a-zA-Z]/.test(char)) return char;
        
        const isUpperCase = char === char.toUpperCase();
        const base = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
        const charCode = char.charCodeAt(0);
        
        let shifted = String.fromCharCode(((charCode - base + shift) % 26) + base);
        return preserve ? shifted : isUpperCase ? shifted.toLowerCase() : shifted;
    }).join('');
}

function encryptText() {
    const text = document.getElementById("inputText").value;
    const shift = parseInt(document.getElementById("shiftAmount").value) || 3;
    const preserve = document.getElementById("preserveCase").checked;
    
    if (!text.trim()) {
        alert("Silakan masukkan teks terlebih dahulu!");
        return;
    }

    const encryptedText = caesarCipher(text, shift, preserve);
    updateOutput(encryptedText);
    addToHistory('Enkripsi', text, encryptedText, shift);
}

function decryptText() {
    const text = document.getElementById("inputText").value;
    const shift = parseInt(document.getElementById("shiftAmount").value) || 3;
    const preserve = document.getElementById("preserveCase").checked;
    
    if (!text.trim()) {
        alert("Silakan masukkan teks terlebih dahulu!");
        return;
    }

    const decryptedText = caesarCipher(text, -shift, preserve);
    updateOutput(decryptedText);
    addToHistory('Dekripsi', text, decryptedText, shift);
}

function clearText() {
    document.getElementById("inputText").value = "";
    document.getElementById("outputText").innerText = "Hasil akan muncul di sini...";
}

function copyToClipboard() {
    const output = document.getElementById("outputText").innerText;
    if (output === "Hasil akan muncul di sini...") {
        alert("Tidak ada teks untuk disalin!");
        return;
    }
    
    navigator.clipboard.writeText(output).then(() => {
        alert("Teks berhasil disalin ke clipboard!");
    }).catch(err => {
        console.error('Gagal menyalin teks:', err);
        alert("Gagal menyalin teks!");
    });
}

function updateOutput(text) {
    document.getElementById("outputText").innerText = text;
}

function addToHistory(type, input, output, shift) {
    const historyDiv = document.getElementById("history");
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
        <strong>${type} (Shift: ${shift})</strong><br>
        Input: ${input.substring(0, 30)}${input.length > 30 ? '...' : ''}<br>
        Output: ${output.substring(0, 30)}${output.length > 30 ? '...' : ''}
    `;
    
    // Batasi riwayat hanya 5 item terakhir
    if (historyDiv.children.length >= 5) {
        historyDiv.removeChild(historyDiv.lastChild);
    }
    
    historyDiv.insertBefore(historyItem, historyDiv.firstChild);
}

