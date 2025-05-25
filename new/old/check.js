const axios = require('axios');

const getFileMetadata = async (ipfsHash) => {
    try {
      const res = await axios.get(`https://api.pinata.cloud/data/pinList?hashContains=${ipfsHash}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MGY2MzY2Mi00MWQ1LTQyOGYtOTUxYS0wMDg1ODIwMjY2ZTYiLCJlbWFpbCI6InBjb3NoZWEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3NDJmOTBmN2QxYjcwZDZkNjUwNiIsInNjb3BlZEtleVNlY3JldCI6ImFkODU3YTJhNmJmMmQ1Y2Q5ODdiMzRlNjM4ZWIwNjAyYTk1ZTlmODZjMzYwYTA2ZjJlZmY5MTdkZmYwNWU1ZjIiLCJpYXQiOjE3MjYzMzkyMDJ9.HqFIo_7uTKZc-QwnEePMqjWByBc-21vFG-6AlUgX-so`,
        },
      });
  
      // Log metadata content
      res.data.rows.forEach((row) => {
        console.log("Metadata:", row.metadata);
      });
  
    } catch (error) {
      console.error('Error retrieving metadata:', error);
    }
  };
  
  // Usage:
  getFileMetadata('QmQEzG4BmfSnJtpANUjf5CZWNx3XM74GhAE8KCsuuqsznc');
  