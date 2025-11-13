
// This function is called by "Mark Dispatched"
async function markDispatched(buttonElement) {
  
  // 1. Find the parent .report-card to get its ID
  const reportCard = buttonElement.closest('.report-card');
  const messageId = reportCard.id;
  
  // 2. Log to the F12 browser console so we can see it work
  console.log(`Sending MarkDispatched for ID: ${messageId}`);

  try {
    // 3. This is the API Request to the "road" in index.js
    const response = await fetch('/dashboard/gov/MarkDispatched', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 4. Send the ID in the body as "mid" (this is what index.js expects)
      body: JSON.stringify({ mid: messageId }) 
    });

    // 5. Wait for the server's JSON response
    const result = await response.json();

    if (result.success) {
      // It worked! Log the success message from the server
      console.log('Success:', result.message);
      // Make the card fade out a little so we know it's done
      reportCard.style.opacity = '0.5'; 
    } else {
      // It failed! Log the server error message
      console.error('Server Error:', result.message);
    }
  } catch (error) {
    // This catches network errors or if the server crashes
    console.error('Fetch Error:', error);
  }
}

// This function is called by "Mark Completed"
async function markCompleted(buttonElement) {
  
  // 1. Find the parent .report-card to get its ID
  const reportCard = buttonElement.closest('.report-card');
  const messageId = reportCard.id;
  
  // 2. Log to the F12 browser console
  console.log(`Sending MarkCompleted for ID: ${messageId}`);

  try {
    // 3. This is the API Request to the "road" in index.js
    const response = await fetch('/dashboard/gov/MarkCompleted', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 4. Send the ID in the body as "mid"
      body: JSON.stringify({ mid: messageId }) 
    });

    // 5. Wait for the server's JSON response
    const result = await response.json();

    if (result.success) {
      // It worked! Log the success message
      console.log('Success:', result.message);
      // Make the card disappear
      reportCard.style.display = 'none';
    } else {
      // It failed! Log the server error message
      console.error('Server Error:', result.message);
    }
  } catch (error) {
    // This catches network errors or if the server crashes
    console.error('Fetch Error:', error);
  }
}