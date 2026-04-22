document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const qrCodeDiv = document.getElementById('qr-code');
    const placeholder = document.getElementById('qr-placeholder');
    const fgColorInput = document.getElementById('fg-color');
    const bgColorInput = document.getElementById('bg-color');

    // Target URL for the QR code
    const targetUrl = 'https://drive.google.com/drive/folders/1xvVafla1E0u0KHYhafDKcC_oT_UWaWTi';

    // Current colors
    let fgColor = fgColorInput.value;
    let bgColor = bgColorInput.value;

    // QR Code instance
    let qrCodeInstance = null;

    // Generate initial QR code
    function generateQRCode() {
        qrCodeDiv.innerHTML = '';
        qrCodeInstance = new QRCode(qrCodeDiv, {
            text: targetUrl,
            width: 250,
            height: 250,
            colorDark: fgColor,
            colorLight: bgColor,
            correctLevel: QRCode.CorrectLevel.H
        });
        qrCodeDiv.style.display = 'block';
        placeholder.style.display = 'none';
    }

    generateQRCode();

    // Color change handlers
    fgColorInput.addEventListener('input', function() {
        fgColor = this.value;
        generateQRCode();
    });

    bgColorInput.addEventListener('input', function() {
        bgColor = this.value;
        generateQRCode();
    });

    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabButtons.forEach(function(b) { b.classList.remove('active'); });
            tabContents.forEach(function(c) { c.classList.remove('active'); });

            this.classList.add('active');
            document.getElementById(tabId + '-tab').classList.add('active');

            // Stop camera when switching away from scan tab
            if (tabId !== 'scan' && html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop();
                document.getElementById('camera-btn').classList.remove('active');
            }
        });
    });

    // Download functions
    function downloadPNG(size) {
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        new QRCode(tempDiv, {
            text: targetUrl,
            width: size,
            height: size,
            colorDark: fgColor,
            colorLight: bgColor,
            correctLevel: QRCode.CorrectLevel.H
        });

        setTimeout(function() {
            const canvas = tempDiv.querySelector('canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = 'qr-code-' + size + 'px.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
            document.body.removeChild(tempDiv);
        }, 100);
    }

    function downloadSVG() {
        const size = 1000;
        const modules = getQRCodeModules(targetUrl);
        const moduleCount = modules.length;
        const cellSize = size / moduleCount;

        let svg = '<?xml version="1.0" encoding="UTF-8"?>\n';
        svg += '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">\n';
        svg += '<rect width="100%" height="100%" fill="' + bgColor + '"/>\n';

        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (modules[row][col]) {
                    const x = col * cellSize;
                    const y = row * cellSize;
                    svg += '<rect x="' + x + '" y="' + y + '" width="' + cellSize + '" height="' + cellSize + '" fill="' + fgColor + '"/>\n';
                }
            }
        }

        svg += '</svg>';

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = 'qr-code.svg';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'letter'
        });

        // Create high-res QR code for PDF
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        new QRCode(tempDiv, {
            text: targetUrl,
            width: 1500,
            height: 1500,
            colorDark: fgColor,
            colorLight: bgColor,
            correctLevel: QRCode.CorrectLevel.H
        });

        setTimeout(function() {
            const canvas = tempDiv.querySelector('canvas');
            if (canvas) {
                const imgData = canvas.toDataURL('image/png');

                // Page dimensions: 8.5 x 11 inches
                const pageWidth = 8.5;
                const pageHeight = 11;
                const qrSize = 4; // 4 inches square

                // Center the QR code
                const x = (pageWidth - qrSize) / 2;
                const y = (pageHeight - qrSize) / 2;

                // Add title
                doc.setFontSize(24);
                doc.setTextColor(51, 51, 51);
                doc.text('Scan to Access Resources', pageWidth / 2, y - 0.5, { align: 'center' });

                // Add QR code
                doc.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

                // Add URL below
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(targetUrl, pageWidth / 2, y + qrSize + 0.4, { align: 'center' });

                doc.save('qr-code-print.pdf');
            }
            document.body.removeChild(tempDiv);
        }, 150);
    }

    function getQRCodeModules(text) {
        const typeNumber = 0;
        const errorCorrectionLevel = 'H';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(text);
        qr.make();

        const moduleCount = qr.getModuleCount();
        const modules = [];

        for (let row = 0; row < moduleCount; row++) {
            modules[row] = [];
            for (let col = 0; col < moduleCount; col++) {
                modules[row][col] = qr.isDark(row, col);
            }
        }

        return modules;
    }

    // Event listeners for download buttons
    document.getElementById('download-png-small').addEventListener('click', function(e) {
        e.preventDefault();
        downloadPNG(250);
    });

    document.getElementById('download-png-medium').addEventListener('click', function(e) {
        e.preventDefault();
        downloadPNG(500);
    });

    document.getElementById('download-png-large').addEventListener('click', function(e) {
        e.preventDefault();
        downloadPNG(1000);
    });

    document.getElementById('download-png-print').addEventListener('click', function(e) {
        e.preventDefault();
        downloadPNG(1500);
    });

    document.getElementById('download-svg').addEventListener('click', function(e) {
        e.preventDefault();
        downloadSVG();
    });

    document.getElementById('download-pdf').addEventListener('click', function(e) {
        e.preventDefault();
        downloadPDF();
    });

    // QR Code Scanner
    let html5QrCode = null;
    const uploadBtn = document.getElementById('upload-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const fileInput = document.getElementById('file-input');
    const scanResult = document.getElementById('scan-result');
    const scanResultText = document.getElementById('scan-result-text');
    const copyBtn = document.getElementById('copy-btn');
    const readerDiv = document.getElementById('reader');

    function showResult(decodedText) {
        scanResultText.textContent = decodedText;
        scanResult.classList.add('show');
    }

    function onScanSuccess(decodedText) {
        showResult(decodedText);
        // Stop camera after successful scan
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop();
            cameraBtn.classList.remove('active');
        }
    }

    // Upload button
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode('reader');
        }

        html5QrCode.scanFile(file, true)
            .then(function(decodedText) {
                showResult(decodedText);
            })
            .catch(function(err) {
                alert('No QR code found in the image. Please try another image.');
            });

        // Reset file input
        fileInput.value = '';
    });

    // Camera button
    cameraBtn.addEventListener('click', function() {
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode('reader');
        }

        if (html5QrCode.isScanning) {
            html5QrCode.stop();
            cameraBtn.classList.remove('active');
            readerDiv.innerHTML = '';
        } else {
            cameraBtn.classList.add('active');
            html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess
            ).catch(function(err) {
                alert('Unable to access camera. Please check permissions or try uploading an image instead.');
                cameraBtn.classList.remove('active');
            });
        }
    });

    // Copy button
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(scanResultText.textContent).then(function() {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(function() {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });
});
