const dropZone = document.getElementById('drop-zone');
const imageInput = document.getElementById('image-input');
const controls = document.getElementById('controls');
const result = document.getElementById('result');
const qualityRange = document.getElementById('quality-range');
const qualityVal = document.getElementById('quality-val');
const compressBtn = document.getElementById('compress-btn');
const originalSizeTxt = document.getElementById('original-size');
const compressedSizeTxt = document.getElementById('compressed-size');
const downloadBtn = document.getElementById('download-btn');

let originalFile = null;

// Trigger input click on drop zone click
dropZone.addEventListener('click', () => imageInput.click());

// Handle file selection
imageInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    originalFile = e.target.files[0];
    showControls();
  }
});

// Update slider value display
qualityRange.addEventListener('input', (e) => {
  qualityVal.textContent = `${e.target.value}%`;
});

function showControls() {
  originalSizeTxt.textContent = formatBytes(originalFile.size);
  controls.classList.remove('hidden');
  result.classList.add('hidden');
}

// Compression Logic
compressBtn.addEventListener('click', async () => {
  if (!originalFile) return;

  compressBtn.textContent = 'Compressing...';
  compressBtn.disabled = true;

  const quality = qualityRange.value / 100;
  
  const options = {
    maxSizeMB: 10,
    initialQuality: quality,
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(originalFile, options);
    
    compressedSizeTxt.textContent = formatBytes(compressedFile.size);
    
    // Create download link
    const downloadUrl = URL.createObjectURL(compressedFile);
    downloadBtn.href = downloadUrl;
    downloadBtn.download = `compressed_${originalFile.name}`;

    result.classList.remove('hidden');
  } catch (error) {
    alert('Compression mein errror aaya: ' + error.message);
  } finally {
    compressBtn.textContent = 'Compress Image';
    compressBtn.disabled = false;
  }
});

// Utility function to format file sizes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}