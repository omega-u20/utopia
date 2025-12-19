import {AttachToast,toast} from '../../toast.js'
import { card } from '../../card.js';

document.addEventListener('DOMContentLoaded', ()=> {

// Function for "Mark Dispatched" button
window.markDispatched = async function (buttonElement) {
    
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
window.markCompleted= async function (buttonElement) {
    
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
  window.Refresh = async function () {
    try {
      await fetch('/dashboard/gov/Refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split(';')[0].split('=')[1]}`
        }
      }).then(res => res.json()).then((data) => {
        console.log(data);

        if (data.success) {
          toast.success('Feed Refreshed !')

          var emList = data.emr;
          var cmList = data.cmp;

          if (!emList) emList = [];
          if (!cmList) cmList = []
          emList.forEach(e => {
            if (e.ReqStatus === 'N') {
              const emCard = card.emr[e.ReqType](e);
              const htm = window.document.getElementById('emp-cont-l').innerHTML
              window.document.getElementById('emp-cont-l').innerHTML = emCard + htm
            } else {
              const emCard = card.emr[e.ReqType](e);
              const htm = window.document.getElementById('pend-cont-l').innerHTML
              
              if (htm.includes(e.ReqID.split('-')[0]+'-'+e.ReqID.split('-')[2])) {
                return;
              } else {
                window.document.getElementById('pend-cont-l').innerHTML = emCard + htm
              }
            }
          });

          cmList.forEach(c => {
            if (c.ReqStatus === 'N') {
              const cmCard = card.cmp[c.CmType](c);
              const htm = window.document.getElementById('cmp-cont-l').innerHTML
              if (htm.includes(c.ReqID.split('-')[0]+'-'+c.ReqID.split('-')[2])) {
                return;
              } else {
                window.document.getElementById('cmp-cont-l').innerHTML = cmCard + htm
              }
            } else {
              const emCard = card.emr[e.ReqType](e);
              const htm = window.document.getElementById('pend-cont-l').innerHTML
              window.document.getElementById('pend-cont-l').innerHTML = emCard + htm
            }
          });
        } else {
          toast.error('Feed Refresh Failed !')
        }
      })
    }catch (error) {
      console.error('Fetch Error:', error);
    }
  }

  // Call the Refresh function when the page loads
  window.Refresh();
});