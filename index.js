function devhammedOnReady() {
  var copyrightYear = document.getElementById('copyright-year')

  if (copyrightYear) {
    copyrightYear.innerText = new Date().getFullYear()
  }
}

if (document.readyState === 'complete') {
  devhammedOnReady()
} else {
  document.addEventListener('DOMContentLoaded', devhammedOnReady)
}
