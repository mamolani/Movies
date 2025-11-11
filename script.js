const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzRIVUhDuMhfya-jZSvXmr0KlWMrsGh9W1r-W0qdxWeT3yXcqpjqGerCfM5i-FulqjEkQ/exec";

const output = document.getElementById("output");
const movieInfo = document.getElementById("movie-info");
const titleEl = document.getElementById("movie-title");
const yearEl = document.getElementById("movie-year");
const directorEl = document.getElementById("movie-director");
const genreEl = document.getElementById("movie-genre");
const posterEl = document.getElementById("movie-poster");

// Initialize QuaggaJS
Quagga.init({
  inputStream: {
    type: "LiveStream",
    target: document.querySelector("#preview"),
    constraints: { facingMode: "environment" }
  },
  decoder: { readers: ["ean_reader", "upc_reader", "upc_e_reader"] }
}, err => {
  if (err) { output.textContent = "Camera error: " + err; return; }
  Quagga.start();
});

// On barcode detected
Quagga.onDetected(data => {
  const barcode = data.codeResult.code;
  output.textContent = "📦 Scanned: " + barcode;
  sendBarcode(barcode);
});

// Send barcode to Google Apps Script
function sendBarcode(barcode) {
  output.textContent = "📡 Sending barcode...";
  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ barcode })
  })
  .then(res => res.json())
  .then(data => {
    // data should include movie info from your backend (adjust your Apps Script if needed)
    if (!data || !data.Title) {
      output.textContent = "❌ Movie not found";
      movieInfo.style.display = "none";
      return;
    }

    output.textContent = "✅ " + data.Title + " added!";
    movieInfo.style.display = "block";
    titleEl.textContent = data.Title;
    yearEl.textContent = "Year: " + data.Year;
    directorEl.textContent = "Director: " + data.Director;
    genreEl.textContent = "Genre: " + data.Genre;
    posterEl.src = data.Poster;
  })
  .catch(err => {
    console.error("Error sending to script:", err);
    output.textContent = "❌ Failed to send barcode";
  });
}
