const video = document.getElementById('video');
const scanBtn = document.getElementById('scan-btn');
const result = document.getElementById('result');

// Check if QR code scanning is supported
if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  scanBtn.addEventListener('click', startScanning);
} else {
  scanBtn.disabled = true;
  result.textContent = 'QR code scanning is not supported by your browser.';
}

function startScanning() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      scanBtn.disabled = true;
      result.textContent = 'Scanning...';

      const barcodeDetector = new window.BarcodeDetector();
      barcodeDetector
        .detect(video)
        .then((barcodes) => {
          if (barcodes.length > 0) {
            result.textContent = `QR code detected: ${barcodes[0].rawValue}`;
          } else {
            result.textContent = 'No QR code found.';
          }
          stream.getTracks().forEach((track) => track.stop());
          scanBtn.disabled = false;
        })
        .catch((error) => {
          console.error('Barcode detection error:', error);
          result.textContent = 'An error occurred while scanning. Please try again.';
          stream.getTracks().forEach((track) => track.stop());
          scanBtn.disabled = false;
        });
    })
    .catch((error) => {
      console.error('Camera access error:', error);
      result.textContent = 'Unable to access the camera. Please ensure camera access is allowed.';
    });
}
