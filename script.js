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
});
