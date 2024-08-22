function startScan() {
  const html5QrCode = new Html5Qrcode("scanner");
  html5QrCode
    .start(
      { facingMode: "environment" },
      {
        fps: 10, // Optional, frame per second for barcode scanning
        qrbox: 250, // Optional, if you want bounded box UI
      },
      (decodedText, decodedResult) => {
        document.getElementById("bienInput").value = decodedText;
        html5QrCode.stop();
      },
      (errorMessage) => {
        // Handle scanning failure
        console.error(errorMessage);
      }
    )
    .catch((err) => {
      console.error("Unable to start scanning:", err);
    });
}