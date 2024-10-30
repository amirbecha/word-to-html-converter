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
                outputDiv.innerHTML = <h3>Converted HTML Code:</h3> <div class="code-container" id="codeDisplay"></div> <textarea id="htmlCode" style="display: none;">${formattedHTML}</textarea> <button onclick="copyToClipboard()">Copy Code</button>;
                addLineNumbers(formattedHTML);
            })
            .catch(function(err) {
                outputDiv.innerHTML = <p>Error: ${err.message}</p>;
                console.error(err); // Log the error
            });
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}

function formatHTML(html) {
    const indentSize = 4; // Number of spaces for indentation
    let formatted = '';
    let indentLevel = 0;

    // Extract keywords using the new function
    const keywords = extractKeywords(html);
    console.log("Extracted Keywords:", keywords); // Debugging line

    // Clean up the keywords
    const cleanedKeywords = keywords.replace(/;\s*/g, ','); // Replace semicolons with commas
    const finalKeywords = cleanedKeywords.replace(/[, ]+$/, ''); // Remove trailing commas or spaces

    // Remove <a id="_Toc...."></a> tags
    html = html.replace(/<a id="[^"]*"><\/a>/g, '');

    // Get the current date in Eastern Time
    const currentDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());

    // Reformat the date to YYYY-MM-DD
    const [month, day, year] = currentDate.split('/');
    const formattedCurrentDate = ${year}-${month}-${day}; // Format to YYYY-MM-DD
    
    // Replace <h1> tags to add properties
    html = html.replace(/<h1>(.*?)<\/h1>/g, (match, p1) => {
        return <h1 property="name" id="wb-cont">${p1}</h1>;
    });

    // Get the first h1 content for the title
    const titleMatch = html.match(/<h1 property="name" id="wb-cont">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : "Document Title";

    // Extract description from the table
    const description = extractDescription(html);

    // Add the HTML structure at the beginning
    formatted += <!DOCTYPE html>
    <!--[if lt IE 9]><html class="no-js lt-ie9" lang="en" dir="ltr"><![endif]-->
    <!--[if gt IE 8]><!-->
    <html class="no-js" lang="en" dir="ltr">
    <head>
    <meta charset="utf-8"/>
    <title>${title} - GCIntranet - PSPC</title>
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta name="description" content="${description}" /> 
    <meta name="dcterms.description" content="${description}" />
    <meta name="dcterms.creator" content="Government of Canada, Public Services and Procurement Canada, Public Service Pay Centre" />
    <meta name="dcterms.title" content="${title}" /> 
    <meta name="dcterms.issued" title="W3CDTF" content="${formattedCurrentDate}" /> 
    <meta name="dcterms.modified" title="W3CDTF" content="<!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'-->" />
    <meta name="dcterms.subject" title="gccore" content="*Insert highlighted topics in the document*" /> 
    <meta name="dcterms.language" title="ISO639-2" content="eng" />
    <meta name="keywords" content="${finalKeywords}" />
    </head>
    <body vocab="http://schema.org/" typeof="WebPage">
    <main role="main" property="mainContentOfPage" class="container">
    <!-- Start of Main Content -->\n;

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

    formatted += <!-- End of Main Content -->
    </main>
    </body>
    </html>;
    
    return formatted.trim(); // Remove any leading/trailing whitespace
}

// Function to extract keywords from the HTML content
function extractKeywords(html) {
    const regex = /<td[^>]*>\s*<p>\s*<strong>\s*Keywords:\s*<\/strong>\s*(.*?)<\/p>\s*<\/td>\s*<td[^>]*>(.*?)<\/td>/i;
    const match = html.match(regex);

    if (match && match[2]) {
        // Extract the second <td> content, ignoring nested tags
        const keywordsContent = match[2].replace(/<[^>]*>/g, '').trim(); // Remove any remaining HTML tags
        return keywordsContent; // Return the cleaned keywords
    }
    
    return ""; // Return empty if no match found
}

// Enhanced function to extract description from the HTML
function extractDescription(html) {
    const regex = /<td>\s*<p>\s*<strong>\s*Description:\s*<\/strong>\s*(.*?)<\/p>\s*<\/td>\s*<td colspan="3">\s*<p>\s*(.*?)<\/p>\s*<\/td>/;
    const match = html.match(regex);

    if (match) {
        // Extract the description content, handling possible nested tags
        let description = match[2].trim();

        // Remove nested HTML tags, keeping the text content
        description = description.replace(/<[^>]*>/g, '');

        // Additional cleaning: replace multiple spaces with a single space
        description = description.replace(/\s+/g, ' ');

        // Optional: limit the description length for output
        const maxLength = 200; // Change this value as needed
        if (description.length > maxLength) {
            description = description.substring(0, maxLength) + '...'; // Truncate with ellipsis
        }

        return description; // Return the cleaned description
    }

    return "No description available."; // Return default if no match found
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
