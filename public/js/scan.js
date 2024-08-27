function startScan() {
  const html5QrCode = new Html5Qrcode("scanner");
  html5QrCode
    .start(
      { facingMode: "environment" },
      {
        fps: 15, // Higher FPS for smoother scanning
        qrbox: { width: 300, height: 300 }, // Larger box for better focus
        formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
      },
      (decodedText, decodedResult) => {
        document.getElementById("bienInput").value = decodedText.slice(-5); // Only take the last 5 digits
        html5QrCode.stop(); // Stop scanning after a successful scan
      },
      (errorMessage) => {
        console.error("Scanning failed:", errorMessage); // Log errors
      }
    )
    .catch((err) => {
      console.error("Unable to start scanning:", err); // Handle start errors
    });
}
