function devhammed() {
  var copyrightYear = document.getElementById('copyright-year')
  copyrightYear.innerText = new Date().getFullYear()
}

if (document.readyState === 'complete') {
  devhammed()
} else {
  document.addEventListener('DOMContentLoaded', devhammed)
}
