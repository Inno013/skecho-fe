var urlParams = new URLSearchParams(window.location.search);
var tourId = urlParams.get("tourId");

// Gunakan nilai tourId sesuai kebutuhan
// console.log("Tour ID:", tourId);
document.getElementById("tourId").value = tourId;
