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

function aitoggleIframe() {
  const iframe = document.getElementById('aipopupFrame');
  // If display is empty (not yet set) or 'none', show the iframe
  if (iframe.style.display === 'none' || iframe.style.display === '') {
      iframe.style.display = 'block';
  }
}

function closeaitoggleIframe() {
  const iframe = document.getElementById('aipopupFrame');
  // Close iframe when 'X' is clicked
  if (iframe.style.display === 'block') {
    iframe.style.display = 'none';
  }
}

function metadatatoggleIframe() {
  const iframe = document.getElementById('metadatapopupFrame');
  // If display is empty (not yet set) or 'none', show the iframe
  if (iframe.style.display === 'none' || iframe.style.display === '') {
      iframe.style.display = 'block';
  }
}

function closemetadatatoggleIframe() {
  const iframe = document.getElementById('metadatapopupFrame');
  // Close iframe when 'X' is clicked
  if (iframe.style.display === 'block') {
    iframe.style.display = 'none';
  }
}
