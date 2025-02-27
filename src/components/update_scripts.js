const fs = require('fs');

// Read the file
const filePath = 'scripts.js';
const content = fs.readFileSync(filePath, 'utf8');

// Find the displayOverview function and update it
const updated = content.replace(
  /function displayOverview\(overview\) \{\s*overviewContent\.innerHTML = "";\s*for \(const \[key, value\] of Object\.entries\(overview\)\) \{[^}]*\}\s*\}/s,
  `function displayOverview(overview) {
    overviewContent.innerHTML = "";
    
    // Add format badge if present
    if (overview.format) {
      overviewContent.innerHTML += '<div class="format-badge">Log Format: ' + overview.format + '</div>';
    }
    
    // Display all other metrics
    for (const [key, value] of Object.entries(overview)) {
      // Skip format as we display it separately
      if (key === 'format') continue;
      
      const cssClass = key === "success" ? (value ? "success" : "error") : "";
      const displayValue = value === true ? "✓" : value === false ? "✗" : value;
      
      overviewContent.innerHTML += 
        "<div class=\\"metric\\">" +
          "<div class=\\"metric-label\\">" + formatLabel(key) + "</div>" +
          "<div class=\\"metric-value " + cssClass + "\\">" + displayValue + "</div>" +
        "</div>";
    }
  }`
);

// Write the updated content back to the file
fs.writeFileSync(filePath, updated, 'utf8');
console.log('Updated successfully\!');
