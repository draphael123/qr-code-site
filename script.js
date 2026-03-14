document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url-input');
    const generateBtn = document.getElementById('generate-btn');
    const qrCodeDiv = document.getElementById('qr-code');
    const placeholder = document.getElementById('qr-placeholder');

    function generateQRCode() {
        const text = urlInput.value.trim();

        if (!text) {
            qrCodeDiv.style.display = 'none';
            placeholder.style.display = 'block';
            return;
        }

        // Clear previous QR code
        qrCodeDiv.innerHTML = '';

        // Generate new QR code
        QRCode.toCanvas(text, {
            width: 200,
            margin: 2,
            color: {
                dark: '#333333',
                light: '#ffffff'
            }
        }, function(error, canvas) {
            if (error) {
                console.error(error);
                return;
            }

            qrCodeDiv.appendChild(canvas);
            qrCodeDiv.style.display = 'block';
            placeholder.style.display = 'none';
        });
    }

    // Generate on button click
    generateBtn.addEventListener('click', generateQRCode);

    // Generate on Enter key
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });
});
