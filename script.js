document.addEventListener('DOMContentLoaded', function() {
    const qrCodeDiv = document.getElementById('qr-code');
    const placeholder = document.getElementById('qr-placeholder');

    // Target URL for the QR code
    const targetUrl = 'https://drive.google.com/drive/folders/1xvVafla1E0u0KHYhafDKcC_oT_UWaWTi';

    // Generate QR code on page load
    QRCode.toCanvas(targetUrl, {
        width: 250,
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
});
