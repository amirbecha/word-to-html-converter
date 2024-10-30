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

function formatHTML(html) {
    const indentSize = 4; // Number of spaces for indentation
    let formatted = '';
    let indentLevel = 0;

    // Extract keywords from the table first
    const keywordsMatch = html.match(/<strong>\s*Keywords:\s*<\/strong>\s*<\/td>\s*<td[^>]*>\s*(.*?)\s*<\/td>/);
    let keywords = "";

    if (keywordsMatch) {
        // Look for the 'Keywords' label and get the next <td> in the same row
        const rowMatch = html.match(/<tr[^>]*>.*?<td[^>]*>\s*<strong>\s*Keywords:\s*<\/strong>\s*<\/td>\s*<td[^>]*>(.*?)<\/td>/);
        if (rowMatch) {
            keywords = rowMatch[1].trim(); // Get content from the next <td>
        }
    }

    // Clean up the keywords
    keywords = keywords.replace(/;\s*/g, ','); // Replace semicolons with commas
    keywords = keywords.replace(/[, ]+$/, ''); // Remove trailing commas or spaces

    // Remove <a id="_Toc...."></a> tags
    html = html.replace(/<a id="[^"]*"><\/a>/g, '');

    // Remove everything from the specified paragraph to the first <h1>
    html = html.replace(/<p>\s*<strong>\s*Web content submission template\s*<\/strong>\s*<\/p>.*?(?=<h1>)/s, '');

    // Replace <h1> tags to add properties
    html = html.replace(/<h1>(.*?)<\/h1>/g, (match, p1) => {
        return `<h1 property="name" id="wb-cont">${p1}</h1>`;
    });

    // Get the first h1 content for the title
    const titleMatch = html.match(/<h1 property="name" id="wb-cont">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : "Document Title";

    // Get the current date
    const currentDate = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

    // Extract description from the table
    const descriptionMatch = html.match(/<td>\s*<p>\s*<strong>\s*Description:\s*<\/strong>\s*(.*?)<\/p>\s*<\/td>\s*<td colspan="3">\s*<p>\s*(.*?)<\/p>\s*<\/td>/);
    const description = descriptionMatch ? descriptionMatch[2].trim() : "No description available.";

    // Add the HTML structure at the beginning
    formatted += `<!DOCTYPE html>
    <!--[if lt IE 9]><html class="no-js lt-ie9" lang="en" dir="ltr"><![endif]-->
    <!--[if gt IE 8]><!-->
    <html class="no-js" lang="en" dir="ltr">
    <head>
    <!--#include virtual="/includes/aa/AA_header.html" -->
    <meta charset="utf-8"/>
    <title>${title} - GCIntranet - PSPC</title>
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta name="description" content="${description}" /> 
    <meta name="dcterms.description" content="${description}" />
    <meta name="dcterms.creator" content="Government of Canada, Public Services and Procurement Canada, Public Service Pay Centre" />
    <meta name="dcterms.title" content="${title}" /> 
    <meta name="dcterms.issued" title="W3CDTF" content="${currentDate}" /> 
    <meta name="dcterms.modified" title="W3CDTF" content="<!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'-->" />
    <meta name="dcterms.subject" title="gccore" content="*Insert highlighted topics in the document*" /> 
    <meta name="dcterms.language" title="ISO639-2" content="eng" />
    <meta name="keywords" content="${keywords}" />
    <!--#include virtual="/includes/aa/AA_metadata.html" --> 
    </head>
    <body vocab="http://schema.org/" typeof="WebPage">
    <main role="main" property="mainContentOfPage" class="container">
    <!-- Start of Main Content -->\n`;

    // Indentation and formatting of the rest of the HTML
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

    formatted += `<!-- End of Main Content -->
    </main>
    </body>
    </html>`;
    
    return formatted.trim(); // Remove any leading/trailing whitespace
}

function addLineNumbers(html) {
    const lines = html.split('\n');
    const codeDisplay = document.getElementById("codeDisplay");
    codeDisplay.innerHTML = ''; // Clear previous output
    const lineNumbersDiv = document.createElement("div");
    const codeDiv = document.createElement("div");
    lineNumbersDiv.className = "line-numbers";
    codeDiv.className = "code";

    lines.forEach((line, index) => {
        const lineNumber = document.createElement("div"); // Use div for line numbers
        lineNumber.textContent = index + 1; // Line number
        const codeLine = document.createElement("div"); // Use div for code lines
        codeLine.textContent = line; // Code line
        lineNumbersDiv.appendChild(lineNumber);
        codeDiv.appendChild(codeLine);
    });

    codeDisplay.appendChild(lineNumbersDiv);
    codeDisplay.appendChild(codeDiv);
}

function copyToClipboard() {
    const textarea = document.getElementById("htmlCode");
    textarea.style.display = "block"; // Make textarea visible to select text
    textarea.select(); // Select the text in the textarea
    document.execCommand("copy"); // Copy the selected text to the clipboard
    textarea.style.display = "none"; // Hide textarea again
    alert("HTML code copied to clipboard!"); // Notify the user
}
