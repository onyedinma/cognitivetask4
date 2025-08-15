/**
 * Task Results Utility
 * Manages storing, retrieving, and exporting task results for all cognitive tasks.
 */

// Save task results to localStorage
export const saveTaskResults = (taskName, results) => {
  try {
    // Get existing results from localStorage
    const allResults = getAllTaskResults();
    
    // Add or update the results for this task
    allResults[taskName] = results;
    
    // Save back to localStorage
    localStorage.setItem('cognitiveTasksResults', JSON.stringify(allResults));
    
    return true;
  } catch (error) {
    console.error(`Error saving ${taskName} results:`, error);
    return false;
  }
};

// Get all task results from localStorage
export const getAllTaskResults = () => {
  try {
    const resultsJSON = localStorage.getItem('cognitiveTasksResults');
    return resultsJSON ? JSON.parse(resultsJSON) : {};
  } catch (error) {
    console.error('Error retrieving task results:', error);
    return {};
  }
};

// Get results for a specific task
export const getTaskResults = (taskName) => {
  const allResults = getAllTaskResults();
  return allResults[taskName] || null;
};

// Clear all task results
export const clearAllTaskResults = () => {
  try {
    localStorage.removeItem('cognitiveTasksResults');
    return true;
  } catch (error) {
    console.error('Error clearing task results:', error);
    return false;
  }
};

// Helper function to process and format REFUSED responses for CSV export
const formatRefusedResponse = (value) => {
  // For numeric values, return -9 (conventional missing data code)
  if (typeof value === 'number') {
    return value === -9 ? "REFUSED" : value;
  }
  
  // For string values, handle 'Refused' or other formats
  if (typeof value === 'string') {
    if (value === 'Refused' || value === 'REFUSED' || value === '-9') {
      return "REFUSED";
    }
  }
  
  return value;
};

/**
 * Properly escapes a value for CSV export
 * - Converts non-string values to strings
 * - Wraps text in double quotes
 * - Escapes any double quotes in the text by doubling them
 */
const escapeCSVField = (value) => {
  if (value === null || value === undefined) {
    return '""';
  }
  
  // Convert to string if not already
  const stringValue = String(value);
  
  // Replace any double quotes with two double quotes (proper CSV escaping)
  const escapedValue = stringValue.replace(/"/g, '""');
  
  // Always wrap in quotes to safely handle commas, newlines, etc.
  return `"${escapedValue}"`;
};

// Update the formatForCSV function to use the new escaping function
const formatForCSV = (value) => {
  // Handle special cases for numbers and boolean values
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  
  // Use the new escapeCSVField function for text values
  return escapeCSVField(value);
};

// Export all task results as a single CSV file with task-specific headers
export const exportAllTaskResults = () => {
  try {
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const counterBalance = localStorage.getItem('counterBalance') || 'unknown';
    const timestamp = new Date().toISOString();
    
    console.log('Exporting all task results for student ID:', studentId);
    
    // Create CSV content with detailed header rows for all tasks
    let csvContent = [];
    
    // Add file header
    csvContent.push(['COGNITIVE TASK RESULTS']);
    csvContent.push(['Student ID:', studentId]);
    csvContent.push(['Export Date:', timestamp]);
    csvContent.push([]);  // Blank row
    
    // Retrieve all results
    const allResults = getAllTaskResults();
    console.debug('All task results to be exported:', allResults);
    
    // ===== DEMOGRAPHIC INFORMATION SECTION =====
    // This section will stand out in the CSV file
    csvContent.push(['========== DEMOGRAPHIC INFORMATION ==========']);
    
    // Get demographic data from localStorage (all questionnaire data stored in localStorage)
    const aceiqDataStr = localStorage.getItem('aceiqResults');
    const sesDataStr = localStorage.getItem('sesResults');
    
    // Add demographic headers
    csvContent.push(['Data Type', 'Category', 'Value', 'Source']);
    
    // Extract demographic information from the ACEIQ questionnaire if available
    if (aceiqDataStr) {
      try {
        const aceiqData = JSON.parse(aceiqDataStr);
        // Get the most recent entry if there are multiple
        const mostRecentData = Array.isArray(aceiqData) ? aceiqData[aceiqData.length - 1] : aceiqData;
        
        // First check for the dedicated demographics object (new format)
        if (mostRecentData.demographics) {
          const demographics = mostRecentData.demographics;
          
          // Add each demographic field
          Object.entries(demographics).forEach(([key, value]) => {
            if (value) { // Only add if there's a value
              const fieldName = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
              csvContent.push(['DEMOGRAPHIC', fieldName, `"${value}"`, 'ACE-IQ']);
            }
          });
        }
        // If no demographics object, check for formData (old format)
        else {
          // Get the formData if available, otherwise try with direct properties
          const demographicData = mostRecentData.formData || mostRecentData;
          
          // Add extracted demographic data
          if (demographicData) {
            // Sex
            if (demographicData.sex) {
              csvContent.push(['DEMOGRAPHIC', 'Sex', `"${demographicData.sex}"`, 'ACE-IQ']);
            }
            
            // Age
            if (demographicData.age) {
              csvContent.push(['DEMOGRAPHIC', 'Age', demographicData.age, 'ACE-IQ']);
            }
            
            // Birth Date
            if (demographicData.birthDate) {
              csvContent.push(['DEMOGRAPHIC', 'Birth Date', `"${demographicData.birthDate}"`, 'ACE-IQ']);
            }
            
            // Ethnicity
            if (demographicData.ethnicity) {
              csvContent.push(['DEMOGRAPHIC', 'Ethnicity', `"${demographicData.ethnicity}"`, 'ACE-IQ']);
            }
          }
        }
      } catch (error) {
        console.error('Error extracting demographic data from ACE-IQ:', error);
        csvContent.push(['DEMOGRAPHIC', 'Error', '"Error extracting ACE-IQ demographic data"', 'System']);
      }
    } else {
      csvContent.push(['DEMOGRAPHIC', 'ACE-IQ Data', '"Not available"', 'System']);
    }
    
    // Add any additional demographic information that might be available
    const additionalDemoData = {
      'Participant ID': studentId,
      'Testing Date': new Date().toLocaleDateString()
    };
    
    // Add each additional demographic item
    Object.entries(additionalDemoData).forEach(([key, value]) => {
      csvContent.push(['DEMOGRAPHIC', key, `"${value}"`, 'System']);
    });
    
    // Add a blank separator row
    csvContent.push([]);
    csvContent.push([]);

    // Process Forward Digit Span Task - Explicit handling
    if (allResults.digitSpanForward && allResults.digitSpanForward.length > 0) {
      console.log('Found digitSpanForward results:', allResults.digitSpanForward.length, 'entries');
      
      // Add section header for Forward Digit Span
      csvContent.push(['FORWARD DIGIT SPAN TASK']);
      
      // Add task-specific headers
      csvContent.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Span Length',
        'Presented Sequence',
        'Expected Response',
        'User Response',
        'Correct (1/0)',
        'Max Span Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max span reached for forward digit span
      const maxSpan = allResults.digitSpanForward.reduce((max, result) => {
        return result.isCorrect && result.spanLength > max ? result.spanLength : max;
      }, 0);
      
      // Calculate overall accuracy
      const totalTrials = allResults.digitSpanForward.length;
      const correctTrials = allResults.digitSpanForward.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.digitSpanForward.forEach((result, index) => {
        csvContent.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.spanLength || ''),
          formatForCSV(result.sequence || ''),
          formatForCSV(result.expectedResponse || ''),
          formatForCSV(result.userResponse || ''),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(maxSpan),
          formatForCSV(overallAccuracy)
        ]);
      });
      
      // Add blank separator row
      csvContent.push(['']);
    }
    
    // Process Backward Digit Span Task - Explicit handling
    if (allResults.digitSpanBackward && allResults.digitSpanBackward.length > 0) {
      console.log('Found digitSpanBackward results:', allResults.digitSpanBackward.length, 'entries');
      
      // Add section header for Backward Digit Span
      csvContent.push(['BACKWARD DIGIT SPAN TASK']);
      
      // Add task-specific headers
      csvContent.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Span Length',
        'Presented Sequence',
        'Expected Response',
        'User Response',
        'Correct (1/0)',
        'Max Span Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max span and accuracy
      const maxSpan = allResults.digitSpanBackward.reduce((max, result) => {
        return result.isCorrect && result.spanLength > max ? result.spanLength : max;
      }, 0);
      
      const totalTrials = allResults.digitSpanBackward.length;
      const correctTrials = allResults.digitSpanBackward.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.digitSpanBackward.forEach((result, index) => {
        csvContent.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.spanLength || ''),
          formatForCSV(result.sequence || ''),
          formatForCSV(result.expectedResponse || ''),
          formatForCSV(result.userResponse || ''),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(maxSpan),
          formatForCSV(overallAccuracy)
        ]);
      });
      
      // Add blank separator row
      csvContent.push(['']);
    }
    

    

    
    // Check for legacy data format and include if present
    // (Removed legacy digitSpan export)

    // Process Shape Counting Task
    if (allResults.shapeCounting && allResults.shapeCounting.length > 0) {
      // Add section header for Shape Counting
      csvContent.push(['SHAPE COUNTING TASK']);
      
      // Add task-specific headers
      csvContent.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Level',
        'Question Text',
        'Expected Answer',
        'User Answer',
        'Correct (1/0)',
        'Max Level Reached',
        'Overall Accuracy',
        'Squares Correct',
        'Triangles Correct',
        'Circles Correct',
        'Category Score',
        'Category Scoring Accuracy',
        'Cumulative Category Score',
        'Cumulative Category Percentage'
      ]);
      
      // Calculate max level reached and overall accuracy
      const maxLevel = allResults.shapeCounting.reduce((max, result) => {
        // Don't require isCorrect for tracking max level
        const newMax = result.level > max ? result.level : max;
        console.log(`ShapeCounting level check: result.level=${result.level}, isCorrect=${result.isCorrect}, current max=${max}, new max=${newMax}`);
        return newMax;
      }, 0);
      
      console.log('Shape Counting max level calculated:', maxLevel);
      
      const totalTrials = allResults.shapeCounting.length;
      const correctTrials = allResults.shapeCounting.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Track cumulative category scores across all trials
      let cumulativeCorrectCategories = 0;
      let cumulativeTotalCategories = 0;
      
      // Add data rows
      allResults.shapeCounting.forEach((result, index) => {
        // Format the expected and user answers in a more compact representation
        let formattedExpectedAnswer = '';
        let formattedUserAnswer = '';
        
        try {
          // For expected answer - try to parse the JSON if it's in that format
          if (result.correctAnswer) {
            let correctAnswer;
            if (typeof result.correctAnswer === 'string' && (result.correctAnswer.startsWith('{') || result.correctAnswer.startsWith('['))) {
              correctAnswer = JSON.parse(result.correctAnswer);
            } else {
              correctAnswer = result.correctAnswer;
            }
            
            // If it's an object with shape counts
            if (correctAnswer && typeof correctAnswer === 'object') {
              // Format for standard shape counting
              const parts = [];
              if (correctAnswer.squares > 0) parts.push(`${correctAnswer.squares}squares`);
              if (correctAnswer.triangles > 0) parts.push(`${correctAnswer.triangles}triangles`);
              if (correctAnswer.circles > 0) parts.push(`${correctAnswer.circles}circles`);
              formattedExpectedAnswer = parts.join(' ');
            } else if (typeof correctAnswer === 'string' && correctAnswer.includes('Squares:')) {
              // Handle string format like "Squares: 2, Triangles: 3, Circles: 1"
              const squares = correctAnswer.match(/Squares: (\d+)/);
              const triangles = correctAnswer.match(/Triangles: (\d+)/);
              const circles = correctAnswer.match(/Circles: (\d+)/);
              
              const parts = [];
              if (squares && squares[1] && parseInt(squares[1]) > 0) parts.push(`${squares[1]}squares`);
              if (triangles && triangles[1] && parseInt(triangles[1]) > 0) parts.push(`${triangles[1]}triangles`);
              if (circles && circles[1] && parseInt(circles[1]) > 0) parts.push(`${circles[1]}circles`);
              
              formattedExpectedAnswer = parts.join(' ');
            } else {
              formattedExpectedAnswer = result.correctAnswer;
            }
          }
          
          // For user answer - check both userAnswer and answer fields
          // First try userAnswer field
          let userAnswer = result.userAnswer;
          
          // If not found, try the answer field instead
          if (!userAnswer && result.answer) {
            userAnswer = result.answer;
          }
          
          // Also look for userCounts object which might be nested
          if (!userAnswer && result.userCounts) {
            userAnswer = result.userCounts;
          }
          
          if (userAnswer) {
            // If it's a string and looks like JSON, parse it
            if (typeof userAnswer === 'string' && (userAnswer.startsWith('{') || userAnswer.startsWith('['))) {
              try {
                userAnswer = JSON.parse(userAnswer);
              } catch (e) {
                // If parsing fails, leave as is
                console.log("Failed to parse user answer JSON:", e);
              }
            }
            
            // If it's an object with shape counts
            if (userAnswer && typeof userAnswer === 'object') {
              // Format for standard shape counting
              const parts = [];
              if (userAnswer.squares > 0) parts.push(`${userAnswer.squares}squares`);
              if (userAnswer.triangles > 0) parts.push(`${userAnswer.triangles}triangles`);
              if (userAnswer.circles > 0) parts.push(`${userAnswer.circles}circles`);
              formattedUserAnswer = parts.join(' ');
            } else if (typeof userAnswer === 'string' && userAnswer.includes('Squares:')) {
              // Handle string format like "Squares: 2, Triangles: 3, Circles: 1"
              const squares = userAnswer.match(/Squares: (\d+)/);
              const triangles = userAnswer.match(/Triangles: (\d+)/);
              const circles = userAnswer.match(/Circles: (\d+)/);
              
              const parts = [];
              if (squares && squares[1] && parseInt(squares[1]) > 0) parts.push(`${squares[1]}squares`);
              if (triangles && triangles[1] && parseInt(triangles[1]) > 0) parts.push(`${triangles[1]}triangles`);
              if (circles && circles[1] && parseInt(circles[1]) > 0) parts.push(`${circles[1]}circles`);
              
              formattedUserAnswer = parts.join(' ');
            } else {
              formattedUserAnswer = userAnswer.toString();
            }
          }
        } catch (e) {
          // Fallback to original values if parsing fails
          console.error('Error formatting shape counts:', e);
          formattedExpectedAnswer = result.correctAnswer || '';
          formattedUserAnswer = result.userAnswer || result.answer || '';
        }
        
        // Get category scoring data if available
        const categoryScores = result.categoryScores || {};
        const squaresCorrect = categoryScores.squaresCorrect !== undefined ? categoryScores.squaresCorrect : 0;
        const trianglesCorrect = categoryScores.trianglesCorrect !== undefined ? categoryScores.trianglesCorrect : 0;
        const circlesCorrect = categoryScores.circlesCorrect !== undefined ? categoryScores.circlesCorrect : 0;
        const totalCorrectCategories = categoryScores.totalCorrectCategories !== undefined ? categoryScores.totalCorrectCategories : 0;
        const totalCategories = categoryScores.totalCategories !== undefined ? categoryScores.totalCategories : 3;
        const categoryAccuracy = result.categoryAccuracy || 
          (totalCategories > 0 ? (totalCorrectCategories / totalCategories * 100).toFixed(2) + '%' : '0%');
        
        // Update cumulative scores
        cumulativeCorrectCategories += totalCorrectCategories;
        cumulativeTotalCategories += totalCategories;
        
        // Calculate cumulative percentage
        const cumulativePercentage = cumulativeTotalCategories > 0 
          ? (cumulativeCorrectCategories / cumulativeTotalCategories * 100).toFixed(2) + '%' 
          : '0%';
        
        // Format using Excel formula to prevent date conversion
        csvContent.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.level || ''),
          formatForCSV(result.questionText || ''),
          formatForCSV(formattedExpectedAnswer),
          formatForCSV(formattedUserAnswer),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(maxLevel),
          formatForCSV(overallAccuracy),
          formatForCSV(squaresCorrect),
          formatForCSV(trianglesCorrect),
          formatForCSV(circlesCorrect),
          formatForCSV(`=\"${totalCorrectCategories}/${totalCategories}\"`),
          formatForCSV(categoryAccuracy),
          formatForCSV(`=\"${cumulativeCorrectCategories}/${cumulativeTotalCategories}\"`),
          formatForCSV(cumulativePercentage)
        ]);
      });
      
      // Add blank separator row
      csvContent.push(['']);
    }
    
    // Process Ecological Counting Task (if available)
    // (Removed ecological counting export)

    // Process Spatial Working Memory Task
    if (allResults.spatialWorkingMemory && allResults.spatialWorkingMemory.length > 0) {
      console.log('Found spatialWorkingMemory results:', allResults.spatialWorkingMemory.length, 'entries');
      
      // Add section header for Spatial Working Memory
      csvContent.push(['SPATIAL WORKING MEMORY TASK']);
      
      // Add task-specific headers matching the image
      csvContent.push([
        'Participant ID',
        'Timestamp',
        'Trial Num',
        'Difficulty Level',
        'Grid Size',
        'Target Positions',
        'Selected Positions',
        'Correct Selections',
        'Incorrect Selections',
        'Score',
        'Total Selections Made',
        'Total Moved Shapes',
        'Completion Time (ms)',
        'Max Level Reached',
        'Overall Accuracy',
        'Cumulative Correct Selections',
        'Cumulative Incorrect Selections',
        'Cumulative Total Score'
      ]);
      
      // Calculate max level reached
      const maxLevel = allResults.spatialWorkingMemory.reduce((max, result) => {
        return result.level > max ? result.level : max;
      }, 0);
      
      // Calculate overall accuracy based on cumulative score vs total possible selections
      const totalCorrectSelections = allResults.spatialWorkingMemory.reduce((sum, result) => 
        sum + (result.correctSelections || 0), 0);
      const totalIncorrectSelections = allResults.spatialWorkingMemory.reduce((sum, result) => 
        sum + (result.incorrectSelections || 0), 0);
      const totalPossibleSelections = allResults.spatialWorkingMemory.reduce((sum, result) => 
        sum + (result.totalMovedShapes || 0), 0);
      
      // Calculate accuracy using the formula: ((TotalCorrectSelections - TotalIncorrectSelections) / TotalPossibleSelections) × 100
      const overallAccuracy = totalPossibleSelections > 0 
        ? (((totalCorrectSelections - totalIncorrectSelections) / totalPossibleSelections) * 100).toFixed(2) + '%'
        : '0%';
      
      console.log(`Spatial Working Memory accuracy calculation:`);
      console.log(`- Total Correct Selections: ${totalCorrectSelections}`);
      console.log(`- Total Incorrect Selections: ${totalIncorrectSelections}`);
      console.log(`- Total Possible Selections: ${totalPossibleSelections}`);
      console.log(`- Overall Accuracy: ${overallAccuracy}`);
      
      // Track cumulative values
      let cumulativeCorrect = 0;
      let cumulativeIncorrect = 0;
      let cumulativeScore = 0;
      
      // Add data rows with expanded fields
      allResults.spatialWorkingMemory.forEach((result, index) => {
        // Update cumulative values
        cumulativeCorrect += (result.correctSelections || 0);
        cumulativeIncorrect += (result.incorrectSelections || 0);
        cumulativeScore += (result.score || 0);
        
        csvContent.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(result.trial || result.trialNumber || index + 1),
          formatForCSV(result.difficultyLevel || result.level || ''),
          formatForCSV(result.gridSize || ''),
          formatForCSV(result.targetPositions || ''),
          formatForCSV(result.selectedPositions || ''),
          formatForCSV(result.correctSelections || 0),
          formatForCSV(result.incorrectSelections || 0),
          formatForCSV(result.score || (result.correctSelections - result.incorrectSelections) || 0),
          formatForCSV(result.totalSelectionsCount || (result.correctSelections + result.incorrectSelections) || 0),
          formatForCSV(result.totalMovedShapes || 0),
          formatForCSV(result.completionTime || ''),
          formatForCSV(maxLevel),
          formatForCSV(overallAccuracy),
          formatForCSV(cumulativeCorrect),
          formatForCSV(cumulativeIncorrect),
          formatForCSV(cumulativeScore)
        ]);
      });
      
      // Add blank separator row
      csvContent.push(['']);
    }
    
    // Create CSV content - each field is already properly formatted for CSV by the formatForCSV function
    const csvContentString = csvContent.map(row => row.join(',')).join('\n');
    
    // Create a Blob and trigger download
    const blob = new Blob([csvContentString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cognitive_assessment_results_${studentId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting task results:', error);
    return false;
  }
}; 