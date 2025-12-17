import { GetEmergencies,GetComplaints,UpdateComplaintStatus,UpdateEmergencyStatus } from './db.js';

// Function to refresh the feed (currently a placeholder)
async function RefreshFeed() {
  try{
    const Emergency = await GetEmergencies()
    const Complaint = await GetComplaints()

    return {
      success:true,
      emr:Emergency,
      cmp:Complaint
    }
  }catch (e){
    console.log('Emergency fetch error');
  }
}

// Function to Mark a Report as DISPATCHED
async function MarkDispatched(mid) {
  const suffix = mid.split('-')[0]
  if (suffix==='EMR') {
    try {
      const emergencyResult = await UpdateEmergencyStatus(mid, 'Dispatched');

      // If neither update worked, the ID doesn't exist
      if (!emergencyResult) {
        throw new Error('Document not found');
      }

      // SUCCESS! Return JSON string
      return JSON.stringify({
        success: true,
        message: `Report ${mid} marked as dispatched.`
      });

    } catch (error) {
      // ERROR! Return JSON string
      return JSON.stringify({
        success: false,
        message: error.message
      });
    }
  } else if (suffix==='CMP') {
    try {
      const complaintResult = await UpdateComplaintStatus(mid, 'Dispatched');

      // If neither update worked, the ID doesn't exist
      if (!complaintResult) {
        throw new Error('Document not found');
      }

      // SUCCESS! Return JSON string
      return JSON.stringify({
        success: true,
        message: `Report ${mid} marked as dispatched.`
      });

    } catch (error) {
      // ERROR! Return JSON string
      return JSON.stringify({
        success: false,
        message: error.message
      });
    }
  }  
}

// Function to Mark a Report as COMPLETED
async function MarkCompleted(mid) {
  const suffix = mid.split('-')[0]
  if (suffix==='EMR') {
    try {
      // Try to update both types
      const emergencyResult = await UpdateEmergencyStatus(mid, 'Completed');

      if (!emergencyResult) {
        throw new Error('Document not found');
      }

      // SUCCESS!
      return JSON.stringify({
        success: true,
        message: `Report ${mid} marked as completed.`
      });

    } catch (error) {
      // ERROR!
      return JSON.stringify({
        success: false,
        message: error.message
      });
    }
  }else if (suffix==='CMP'){
    try {
      const complaintResult = await UpdateComplaintStatus(mid, 'Completed');

      if (!complaintResult) {
        throw new Error('Document not found');
      }

      // SUCCESS!
      return JSON.stringify({
        success: true,
        message: `Report ${mid} marked as completed.`
      });

    } catch (error) {
      // ERROR!
      return JSON.stringify({
        success: false,
        message: error.message
      });
    }
  }
  
}

// Export the functions so index.js can use them
export {RefreshFeed, MarkCompleted, MarkDispatched};