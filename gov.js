/*
  This is the FINAL, REAL gov.js file.
  It connects to the database using the functions exported from db.js.
*/

// We import the specific update functions we created in db.js
import { 
  UpdateEmergencyStatus, 
  UpdateComplaintStatus, 
  GetEmergencies, 
  GetComplaints 
} from './db.js';

// These helper functions are available if needed later
function GetEmergency() {
    
}
function GetComplaints() {
    
}

// Function to refresh the feed (currently a placeholder)
async function RefreshFeed() {
  console.log(`LOGIC: RefreshFeed`);
  
  return JSON.stringify({
    success: true,
    message: "Feed refreshed (not implemented yet)"
  });
}

// Function to Mark a Report as DISPATCHED
async function MarkDispatched(mid) {
  console.log(`LOGIC: MarkDispatched for ${mid}`);
  
  try {
    // We don't know if 'mid' is a Complaint or an Emergency, so we try to update BOTH.
    // Ideally, we would know the type, but this ensures it works for either.
    
    const emergencyResult = await UpdateEmergencyStatus(mid, 'Dispatched');
    const complaintResult = await UpdateComplaintStatus(mid, 'Dispatched');

    // If neither update worked, the ID doesn't exist
    if (!emergencyResult && !complaintResult) {
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

// Function to Mark a Report as COMPLETED
async function MarkCompleted(mid) {
  console.log(`LOGIC: MarkCompleted for ${mid}`);
  
  try {
    // Try to update both types
    const emergencyResult = await UpdateEmergencyStatus(mid, 'Completed');
    const complaintResult = await UpdateComplaintStatus(mid, 'Completed');

    if (!emergencyResult && !complaintResult) {
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

// Export the functions so index.js can use them
export {RefreshFeed, MarkCompleted, MarkDispatched};