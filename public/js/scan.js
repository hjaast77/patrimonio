function startScan() {
  const html5QrCode = new Html5Qrcode("scanner");

  // Configure the scanner to focus on CODE_128 and other barcode types
  const config = {
    fps: 10, // Frames per second
    qrbox: 250, // Optional, specify the dimensions of the scanning area
    formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
  };

  html5QrCode
    .start(
      { facingMode: "environment" }, // Use the back camera on mobile devices
      config,
      (decodedText, decodedResult) => {
        document.getElementById("bienInput").value = decodedText;
        html5QrCode.stop();
      },
      (errorMessage) => {
        // Handle scanning failures
        console.error(errorMessage);
      }
    )
    .catch((err) => {
      console.error("Unable to start scanning:", err);
    });
}
