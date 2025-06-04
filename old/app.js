(async () => {
  const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MGY2MzY2Mi00MWQ1LTQyOGYtOTUxYS0wMDg1ODIwMjY2ZTYiLCJlbWFpbCI6InBjb3NoZWEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3NDJmOTBmN2QxYjcwZDZkNjUwNiIsInNjb3BlZEtleVNlY3JldCI6ImFkODU3YTJhNmJmMmQ1Y2Q5ODdiMzRlNjM4ZWIwNjAyYTk1ZTlmODZjMzYwYTA2ZjJlZmY5MTdkZmYwNWU1ZjIiLCJpYXQiOjE3MjYzMzkyMDJ9.HqFIo_7uTKZc-QwnEePMqjWByBc-21vFG-6AlUgX-so';

  // Elements
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const startCameraButton = document.getElementById('startCameraButton');
  const switchButton = document.getElementById('switchButton');
  const captureButton = document.getElementById('captureButton');
  const locationData = document.getElementById('locationData');
  const uploadLocalButton = document.getElementById('uploadLocalButton');
  const localImageInput = document.getElementById('localImageInput');
  const pinnedFilesList = document.getElementById('pinnedFilesList');

  let useFrontCamera = false;
  let stream = null;
  let location = { latitude: null, longitude: null };

  // Function to start the camera
  async function startCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: { facingMode: useFrontCamera ? 'user' : 'environment' },
      audio: false,
    };

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;

      // Show video and capture controls
      video.style.display = 'block';
      switchButton.style.display = 'block';
      captureButton.style.display = 'block';
      startCameraButton.style.display = 'none';
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access the camera. Please allow camera access.');
    }
  }

  // Get location data
// Get location data with better error handling and feedback
async function getLocation() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.latitude = position.coords.latitude;
          location.longitude = position.coords.longitude;
          locationData.textContent = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
          resolve();
        },
        (error) => {
          console.error('Error getting location:', error);
          if (error.code === error.PERMISSION_DENIED) {
            alert('Location permission denied. Please enable location services in your browser settings.');
          } else {
            alert('Error retrieving location. Uploading without location.');
          }
          locationData.textContent = 'Location access denied. Uploading without location.';
          resolve(); // Continue without location
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Set timeout and high accuracy
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      resolve();
    }
  });
}


  // Function to upload the image
  async function uploadImage(file) {
    try {
      // Create FormData for Pinata
      const formData = new FormData();
      formData.append('file', file);

      // Add metadata including location data
      const pinataMetadata = JSON.stringify({
        name: file.name || 'Captured Image',
        keyvalues: {
          latitude: location.latitude !== null ? location.latitude.toString() : 'unknown',
          longitude: location.longitude !== null ? location.longitude.toString() : 'unknown',
        },
      });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', pinataOptions);

      // Upload to Pinata
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      });

      alert(`Image uploaded successfully! IPFS CID: ${res.data.IpfsHash}`);
      await fetchPinnedFiles();  // Refresh file list after upload
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  }

  // Function to fetch and display pinned files
  async function fetchPinnedFiles() {
    try {
      const res = await axios.get('https://api.pinata.cloud/data/pinList', {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      });

      const pinnedFiles = res.data.rows;
      pinnedFilesList.innerHTML = ''; // Clear previous list

      if (pinnedFiles.length === 0) {
        pinnedFilesList.innerHTML = '<li>No pinned files found.</li>';
        return;
      }

      // Filter out unpinned files
      const activeFiles = pinnedFiles.filter(file => file.date_unpinned === null);

      if (activeFiles.length === 0) {
        pinnedFilesList.innerHTML = '<li>No active pinned files found.</li>';
        return;
      }

      activeFiles.forEach(file => {
        const listItem = document.createElement('li');
        const metadata = file.metadata?.keyvalues || {}; // Extract metadata if present
        const name = file.metadata?.name || 'No name';

        listItem.innerHTML = `
          <strong>${name}</strong>
          <br>
          <img src="https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}" alt="Pinned Image" style="max-width: 100px;" />
          <br>
          <strong>Metadata:</strong>
          <br>
          Latitude: ${metadata.latitude || 'unknown'}
          <br>
          Longitude: ${metadata.longitude || 'unknown'}
        `;
        pinnedFilesList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching pinned files:', error);
      alert('Failed to fetch pinned files. Please try again.');
    }
  }

  // Call fetchPinnedFiles on page load
  await fetchPinnedFiles();

  // Switch camera event
  switchButton.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
  });

  // Start camera event
  startCameraButton.addEventListener('click', () => {
    startCamera();
  });

  // Capture photo and upload
  captureButton.addEventListener('click', async () => {
    await getLocation();

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video onto the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Display the captured image
    canvas.style.display = 'block';
    video.style.display = 'none';
    switchButton.style.display = 'none';
    captureButton.style.display = 'none';
    startCameraButton.style.display = 'block';
    startCameraButton.textContent = 'Retake Photo';

    // Stop the video stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Convert the canvas image to a Blob and upload
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'captured_image.png', { type: 'image/png' });
      await uploadImage(file);
    }, 'image/png');
  });

  // Local image upload event
  uploadLocalButton.addEventListener('click', () => {
    localImageInput.click();
  });

  // Handle file input change event for local image upload
  localImageInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      await getLocation();
      await uploadImage(file);
    }
  });

})();
