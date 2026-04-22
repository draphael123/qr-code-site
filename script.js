document.addEventListener('DOMContentLoaded', function() {
    const qrCodeDiv = document.getElementById('qr-code');
    const placeholder = document.getElementById('qr-placeholder');

    // Target URL for the QR code
    const targetUrl = 'https://drive.google.com/drive/folders/1xvVafla1E0u0KHYhafDKcC_oT_UWaWTi';

    // Generate QR code on page load
    new QRCode(qrCodeDiv, {
        text: targetUrl,
        width: 250,
        height: 250,
        colorDark: '#333333',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    qrCodeDiv.style.display = 'block';
    placeholder.style.display = 'none';

    // Download functions
    function downloadPNG(size) {
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        new QRCode(tempDiv, {
            text: targetUrl,
            width: size,
            height: size,
            colorDark: '#333333',
            colorLight: '#ffffff',
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
        svg += '<rect width="100%" height="100%" fill="#ffffff"/>\n';

        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (modules[row][col]) {
                    const x = col * cellSize;
                    const y = row * cellSize;
                    svg += '<rect x="' + x + '" y="' + y + '" width="' + cellSize + '" height="' + cellSize + '" fill="#333333"/>\n';
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
});
