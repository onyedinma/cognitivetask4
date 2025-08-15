/**
 * Configuration for Cognitive Task Application (React Version)
 */

// Task Configuration
export const TASK_CONFIG = {
  // Digit Span Task Config
  digitSpan: {
    minSpan: 3,
    maxSpan: 9,
    displayTime: 1000,
    blankTime: 500
  },
  
  // Spatial Memory Task Config
  spatialMemory: {
    practice: { maxShapes: 5, displayTime: 30000 },
    real: { maxShapes: 20, displayTime: 90000 }
  }
};

// Data Format Specifications for Result Export
export const EXPORT_FORMATS = {
  digitSpan: {
    csv: {
      headers: [
        'participant_id',
        'counter_balance',
        'task_type',
        'span_mode',
        'trial_number',
        'timestamp',
        'span_length',
        'attempt_number',
        'is_correct',
        'max_span_reached'
      ],
      filename: (taskType, studentId, timestamp) => 
        `${taskType}_results_${studentId}_${timestamp}.csv`
    }
  }
};

// Utility Functions 
export const UTILS = {
  // Format timestamp for filenames
  formatTimestamp: () => {
    const now = new Date();
    return now.getFullYear() + 
      String(now.getMonth() + 1).padStart(2, '0') + 
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') + 
      String(now.getMinutes()).padStart(2, '0');
  },
  
  // Convert a JS object to CSV string
  objectToCSV: (headers, dataRows) => {
    const csvHeader = headers.join(',');
    const csvRows = dataRows.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? 
        `"${value}"` : value
      ).join(',')
    );
    return [csvHeader, ...csvRows].join('\n');
  },
  
  // Download data as a CSV file
  downloadCSV: (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}; 