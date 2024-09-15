function toggleIframe() {
  const iframe = document.getElementById('popupFrame');
  const button = event.target;  // Get the clicked button
  
  // If display is empty (not yet set) or 'none', show the iframe
  if (iframe.style.display === 'none' || iframe.style.display === '') {
      iframe.style.display = 'block';
      button.textContent = 'Hide'; // Change button text
  } else {
      iframe.style.display = 'none';
      button.textContent = 'about'; // Change button text back
  }
}