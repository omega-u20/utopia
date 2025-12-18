import {AttachToast,toast} from '../../toast.js'
import { card } from '../../card.js';

// Function for "Mark Dispatched" button
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
        'Authorization':`Bearer ${document.cookie.split(';')[0].split('=')[1]}`
      },
      // 4. Send the ID in the body as "mid" (this is what index.js expects)
      body: JSON.stringify({ mid: messageId }) 
    });

    // 5. Wait for the server's JSON response
    const result = await response.json();

    if (result.success) {
      toast.success('Marked Dispatched !')
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

// Function for "Mark Completed" button
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
        'Authorization':`Bearer ${document.cookie.split(';')[0].split('=')[1]}`
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

async function Refresh() {
  try {
    const res = await fetch('/dashboard/gov/Refresh',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${document.cookie.split(';')[0].split('=')[1]}`
      }
    })

    const result = res.json()

    if (result.success) {
      toast.success('Feed Refreshed !')

      var emList = {
            uid:emr.uid,
            ReqID:emr.mid,
            ReqType:emr.reqType,
            ReqStatus:emr.status,
            ReqLoc:emr.location,
            ReqTime:emr.timestamp
      }/* result.emr */;
      var cmList = result.cmp;
      emList.forEach(e => {

      });

      document.getElementById('emp-cont').insertBefore(emList,this.firstChild)
      document.getElementById('cmp-cont').insertBefore(cmList,this.firstChild)
    } else {
      
    }
  }
  catch (error) {
  
  }
}