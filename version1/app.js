(async () => {
    const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MGY2MzY2Mi00MWQ1LTQyOGYtOTUxYS0wMDg1ODIwMjY2ZTYiLCJlbWFpbCI6InBjb3NoZWEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3NDJmOTBmN2QxYjcwZDZkNjUwNiIsInNjb3BlZEtleVNlY3JldCI6ImFkODU3YTJhNmJmMmQ1Y2Q5ODdiMzRlNjM4ZWIwNjAyYTk1ZTlmODZjMzYwYTA2ZjJlZmY5MTdkZmYwNWU1ZjIiLCJpYXQiOjE3MjYzMzkyMDJ9.HqFIo_7uTKZc-QwnEePMqjWByBc-21vFG-6AlUgX-so';
  
    // Elements
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const startCameraButton = document.getElementById('startCameraButton');
    const switchButton = document.getElementById('switchButton');
    const captureButton = document.getElementById('captureButton');
    const cameraContainer = document.getElementById('cameraContainer');
    const closeCameraButton = document.getElementById('closeCamera');
    const locationData = document.getElementById('locationData');
    const uploadLocalButton = document.getElementById('uploadLocalButton');
    const localImageInput = document.getElementById('localImageInput');

  
    let useFrontCamera = false;
    let stream = null;
    let location = { latitude: null, longitude: null };
    let map; // Map instance
  
    // Close camera modal when 'X' is clicked
    closeCameraButton.addEventListener('click', () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cameraContainer.style.display = 'none';
      startCameraButton.style.display = 'block';
    });
  
    // Function to start the camera
    async function startCamera() {
      // Stop any existing stream before starting a new one
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
  
      const constraints = {
        video: { facingMode: useFrontCamera ? 'user' : 'environment' },
        audio: false,
      };
  
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
  
        // Play the video stream
        video.srcObject = stream;
        video.style.display = 'block';
        video.setAttribute('playsinline', true);  // Ensure inline play on mobile devices
        await video.play();
  
        // Show camera container and controls
        cameraContainer.style.display = 'flex';
        captureButton.style.display = 'block';
        switchButton.style.display = 'block';
        startCameraButton.style.display = 'none';
      } catch (error) {
        console.error('Error accessing camera:', error);
  
        if (error.name === 'NotAllowedError') {
          alert('Camera access was denied. Please enable camera access for this site in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          alert('No camera found on this device.');
        } else {
          alert('Unable to access the camera. Please try again or use a different browser/device.');
        }
      }
    }
  
    // Capture photo and upload
    captureButton.addEventListener('click', async () => {
      await getLocation();
  
      // Draw video frame to canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Stop video stream and show captured image
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      video.style.display = 'none';
      canvas.style.display = 'block';
  
      // Hide camera modal and reset buttons
      cameraContainer.style.display = 'none';
      startCameraButton.style.display = 'block';
  
      // Convert the canvas image to a Blob and upload it
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'captured_image.png', { type: 'image/png' });
        await uploadImage(file);
      }, 'image/png');
    });
  
    // Switch camera between front and back
    switchButton.addEventListener('click', () => {
      useFrontCamera = !useFrontCamera;
      startCamera();
      
    });
  
    // Start camera when Start Camera button is clicked
    startCameraButton.addEventListener('click', async () => {
        await startCamera();
        await video.play();  // Ensure video starts after user interaction
    });
    
  
    // Get user's location
    async function getLocation() {
      return new Promise((resolve) => {
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
                alert('Location permission denied. Please enable location services.');
              } else {
                alert('Error retrieving location. Uploading without location.');
              }
              locationData.textContent = 'Location access denied. Uploading without location.';
              resolve();
            }
          );
        } else {
          alert('Geolocation is not supported by your browser.');
          resolve();
        }
      });
    }
  
    // Upload the image to Pinata IPFS
    async function uploadImage(file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
  
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
  
        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${JWT}`,
          },
        });
  
        alert(`Image uploaded successfully! IPFS CID: ${res.data.IpfsHash}`);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  
    // Local image upload event
    uploadLocalButton.addEventListener('click', () => {
      localImageInput.click();
    });
  
    localImageInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        await getLocation();
        await uploadImage(file);
      }
    });
  

  })();
  


