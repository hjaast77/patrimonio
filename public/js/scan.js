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
        // Extract the last 5 digits from the decoded text
        const lastFiveDigits = decodedText.slice(-5);
        const bienInput = document.getElementById("bienInput");
        bienInput.value = lastFiveDigits;

        // Manually trigger the input event
        const inputEvent = new Event("input", { bubbles: true });
        bienInput.dispatchEvent(inputEvent);

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
