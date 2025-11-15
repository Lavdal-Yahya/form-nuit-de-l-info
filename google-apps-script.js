/**
 * Google Apps Script for Nuit de l'Info Form
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Z_27ttnn6Gv2NHz3niSL0BrL2nm7YgtRifLEOl8HZG0/edit
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Deploy" > "New deployment"
 * 5. Click the gear icon (⚙️) next to "Select type" and choose "Web app"
 * 6. Set:
 *    - Description: "Nuit de l'Info Form Handler"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Click "Deploy"
 * 8. Copy the "Web app URL" that appears
 * 9. Paste that URL into your React app's .env file as VITE_GOOGLE_SCRIPT_URL
 */

const SPREADSHEET_ID = '1Z_27ttnn6Gv2NHz3niSL0BrL2nm7YgtRifLEOl8HZG0';
const SHEET_NAME = 'nuit de linfo';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet and sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 5).setValues([['Matricule', 'Name', 'Work Area', 'Technologies', 'Submitted At']]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    
    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([['Matricule', 'Name', 'Work Area', 'Technologies', 'Submitted At']]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    
    // Check for duplicate matricule
    const matricule = data.matricule.toUpperCase();
    const matriculeColumn = 1; // Column A
    const lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      const existingMatricules = sheet.getRange(2, matriculeColumn, lastRow - 1, 1).getValues().flat();
      if (existingMatricules.includes(matricule)) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'This matricule has already been submitted'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Prepare the row data
    const technologies = Array.isArray(data.technologies) ? data.technologies.join(', ') : data.technologies;
    const workAreaLabels = {
      'frontend': 'Front-end',
      'backend': 'Back-end',
      'documentation': 'Documentation',
      'deployment': 'Deployment'
    };
    const workArea = workAreaLabels[data.workArea] || data.workArea;
    const submittedAt = data.submittedAt || new Date().toISOString();
    
    // Append the new row
    sheet.appendRow([
      matricule,
      data.name,
      workArea,
      technologies,
      submittedAt
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Form submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Nuit de l\'Info Form Handler is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

