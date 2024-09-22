function abouttoggleIframe() {
  const iframe = document.getElementById('aboutpopupFrame');
  // If display is empty (not yet set) or 'none', show the iframe
  if (iframe.style.display === 'none' || iframe.style.display === '') {
      iframe.style.display = 'block';
  }
}

function closeabouttoggleIframe() {
  const iframe = document.getElementById('aboutpopupFrame');
  // Close iframe when 'X' is clicked
  if (iframe.style.display === 'block') {
    iframe.style.display = 'none';
  }
}

function techtoggleIframe() {
  const iframe = document.getElementById('techpopupFrame');
  // If display is empty (not yet set) or 'none', show the iframe
  if (iframe.style.display === 'none' || iframe.style.display === '') {
      iframe.style.display = 'block';
  }
}

function closetechtoggleIframe() {
  const iframe = document.getElementById('techpopupFrame');
  // Close iframe when 'X' is clicked
  if (iframe.style.display === 'block') {
    iframe.style.display = 'none';
  }
}

