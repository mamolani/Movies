const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxlXlojyEtfy8XXBgvv5b7GBZFjjOy6Ioh9koguOA7Bm46b1zphGcfglXoSpB2kCgA3/exec"; // Replace with your /exec URL

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
  decoder: { readers: ["ean_reader","upc_reader","upc_e_reader"] }
}, err => {
  if (err) { output.textContent = "Camera error: " + err; return; }
  Quagga.start();
});

Quagga.onDetected(data => {
  const barcode = data.codeResult.code;
  output.textContent = "📦 Scanned: " + barcode;
  sendBarcode(barcode);
});

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
