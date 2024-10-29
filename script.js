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
                outputDiv.innerHTML = `<h3>Converted HTML Code:</h3>
                                       <div class="code-container" id="codeDisplay"></div>
                                       <textarea id="htmlCode" style="display: none;">${formattedHTML}</textarea>
                                       <button onclick="copyToClipboard()">Copy Code</button>`;
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

    // Remove <a id="_Toc...."></a> tags
    html = html.replace(/<a id="[^"]*"><\/a>/g, '');

    // Replace <h1> tags to add properties
    html = html.replace(/<h1>(.*?)<\/h1>/g, '<h1 property="name" id="wb-cont">$1</h1>');

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
