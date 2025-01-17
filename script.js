document.getElementById('fileInput').addEventListener('change', handleFiles);
document.getElementById('modeSelect').addEventListener('change', handleFiles);

function handleFiles() {
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const mode = document.getElementById('modeSelect').value;
  fileList.innerHTML = '';

  Array.from(fileInput.files).forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    const fileName = document.createElement('span');
    fileName.textContent = file.name;

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Nama baru (opsional)';

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';

    const errorMessage = document.createElement('span');
    errorMessage.className = 'error-message';

    let newFileName = file.name;
    if (mode === 'bracket') {
      const match = file.name.match(/\(([^)]+)\)/);
      if (match) {
        newFileName = `${match[1]}${getFileExtension(file.name)}`;
        downloadButton.className = 'download';
      } else {
        errorMessage.textContent = 'Tidak ada tanda kurung dalam nama file.';
        downloadButton.className = 'error';
      }
    } else if (mode.startsWith('last')) {
      const charCount = parseInt(mode.replace('last', ''), 10);
      const baseName = file.name.replace(/\.[^/.]+$/, ''); // Hapus ekstensi file
      if (baseName.length >= charCount) {
        newFileName = `${baseName.slice(-charCount)}${getFileExtension(file.name)}`;
        downloadButton.className = 'download';
      } else {
        errorMessage.textContent = 'Jumlah karakter melebihi panjang nama file.';
        downloadButton.className = 'error';
      }
    } else if (mode === 'last1') { // Mode mengambil 1 huruf terakhir dari nama tanpa ekstensi
      const baseName = file.name.replace(/\.[^/.]+$/, ''); // Hapus ekstensi file
      if (baseName.length >= 1) {
        newFileName = `${baseName.slice(-1)}${getFileExtension(file.name)}`;
        downloadButton.className = 'download';
      } else {
        errorMessage.textContent = 'Nama file terlalu pendek untuk mengambil 1 huruf terakhir.';
        downloadButton.className = 'error';
      }
    } else {
      downloadButton.className = 'download';
    }

    downloadButton.addEventListener('click', () => {
      if (downloadButton.className === 'download') {
        const blob = new Blob([file], { type: file.type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = inputField.value || newFileName;
        link.click();
      }
    });

    fileItem.appendChild(fileName);
    fileItem.appendChild(inputField);
    fileItem.appendChild(downloadButton);
    fileItem.appendChild(errorMessage);
    fileList.appendChild(fileItem);
  });
}

function getFileExtension(fileName) {
  return fileName.slice(fileName.lastIndexOf('.'));
}
