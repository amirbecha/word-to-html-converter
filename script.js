function convertToHTML() {
    console.log("Convert button clicked."); // Log when button is clicked
    const fileInput = document.getElementById("upload");
    const outputDiv = document.getElementById("output");
    if (!fileInput.files[0]) {
        outputDiv.innerHTML = "<p>Please upload a .docx file first.</p>";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        console.log("File loaded."); // Log when file is loaded
        const arrayBuffer = event.target.result;

        // Convert .docx to HTML using Mammoth.js
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function(result) {
                console.log("Conversion successful."); // Log when conversion is successful
                const formattedHTML = formatHTML(result.value);
                outputDiv.innerHTML = `<h3>Converted HTML Code:</h3> <div class="code-container" id="codeDisplay"></div> <textarea id="htmlCode" style="display: none;">${formattedHTML}</textarea> <button onclick="copyToClipboard()">Copy Code</button>`;
                addLineNumbers(formattedHTML);
            })
            .catch(function(err) {
                outputDiv.innerHTML = `<p>Error: ${err.message}</p>`;
                console.error(err); // Log the error
            });
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}

// Function to format HTML with indentation and metadata
function formatHTML(html) {
    const indentSize = 4; // Number of spaces for indentation
    let formatted = '';
    let indentLevel = 0;

    // Remove <a id="_Toc...."></a> tags
    html = html.replace(/<a id="[^"]*"><\/a>/g, '');

    // Remove content before the first <h1>
    html = html.replace(/<p>\s*<strong>\s*Web content submission template\s*<\/strong>\s*<\/p>.*?(?=<h1>)/s, '');

    // Replace <h1> tags to add properties
    html = html.replace(/<h1>(.*?)<\/h1>/g, (match, p1) => {
        return `<h1 property="name" id="wb-cont">${p1}</h1>`;
    });

    // Extract title, description, and keywords
    const titleMatch = html.match(/<h1 property="name" id="wb-cont">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : "Document Title";
    const currentDate = new Date().toISOString().split("T")[0];

    const descriptionMatch = html.match(/<td>\s*<p>\s*<strong>\s*Description:\s*<\/strong>\s*(.*?)<\/p>\s*<\/td>\s*<td colspan="3">\s*<p>\s*(.*?)<\/p>\s*<\/td>/);
    const description = descriptionMatch ? descriptionMatch[2].trim() : "No description available.";

    const keywordsMatch = html.match(/<tr>\s*<td>\s*<p>\s*<strong>\s*Keywords:\s*<\/strong>.*?<\/p>\s*<\/td>\s*<td[^>]*>\s*<p>\s*(.*?)<\/p>\s*<\/td>/);
    let keywords = keywordsMatch ? keywordsMatch[1].trim() : "No keywords available.";
    keywords = keywords.replace(/;\s*/g, ',').replace(/[, ]+$/, '');

    // Begin HTML with metadata
    formatted += `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${title} - GCIntranet - PSPC</title>
<meta name="description" content="${description}" /> 
<meta name="dcterms.description" content="${description}" />
<meta name="dcterms.title" content="${title}" /> 
<meta name="dcterms.issued" content="${currentDate}" /> 
<meta name="keywords" content="${keywords}" />
</head>
<body>
<main role="main">`;

    // Format the remaining HTML content
    html.split(/(?=<)|(?<=>)/g).forEach((part) => {
        if (part.match(/<[^/!][^>]*>/)) { // Opening tag
            formatted += ' '.repeat(indentLevel * indentSize) + part.trim() + '\n';
            indentLevel++;
        } else if (part.match(/<\/[^>]+>/)) { // Closing tag
            indentLevel--;
            formatted += ' '.repeat(indentLevel * indentSize) + part.trim() + '\n';
        } else { // Text node
            formatted += ' '.repeat(indentLevel * indentSize) + part.trim() + '\n';
        }
    });

    // Close the HTML structure
    formatted += `</main>
</body>
</html>`;

    return formatted.trim();
}

// Function to add line numbers for displaying code
function addLineNumbers(html) {
    const lines = html.split('\n');
    const codeDisplay = document.getElementById("codeDisplay");
    codeDisplay.innerHTML = ''; // Clear previous output

    const lineNumbersDiv = document.createElement("div");
    const codeDiv = document.createElement("div");
    lineNumbersDiv.className = "line-numbers";
    codeDiv.className = "code";

    lines.forEach((line, index) => {
        const lineNumber = document.createElement("div");
        lineNumber.textContent = index + 1; // Line number
        const codeLine = document.createElement("div");
        codeLine.textContent = line; // Code line
        lineNumbersDiv.appendChild(lineNumber);
        codeDiv.appendChild(codeLine);
    });

    codeDisplay.appendChild(lineNumbersDiv);
    codeDisplay.appendChild(codeDiv);
}

// Function to copy HTML code to clipboard
function copyToClipboard() {
    const textarea = document.getElementById("htmlCode");
    textarea.style.display = "block"; // Make textarea visible to select text
    textarea.select(); // Select the text in the textarea
    document.execCommand("copy"); // Copy the selected text to the clipboard
    textarea.style.display = "none"; // Hide textarea again
    alert("HTML code copied to clipboard!"); // Notify the user
}
