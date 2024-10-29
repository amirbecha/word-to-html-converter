function convertToHTML() {
    const fileInput = document.getElementById("upload");
    const outputDiv = document.getElementById("output");

    if (!fileInput.files[0]) {
        outputDiv.innerHTML = "<p>Please upload a .docx file first.</p>";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const arrayBuffer = event.target.result;

        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function(result) {
                // Format the HTML output
                const formattedHTML = formatHTML(result.value);
                outputDiv.innerHTML = `<h3>Converted HTML Code:</h3>
                                       <div class="code-container" id="codeDisplay"></div>
                                       <textarea id="htmlCode" style="display: none;">${formattedHTML}</textarea>
                                       <button onclick="copyToClipboard()">Copy Code</button>`;
                addLineNumbers(formattedHTML);
            })
            .catch(function(err) {
                outputDiv.innerHTML = `<p>Error: ${err.message}</p>`;
            });
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}

function formatHTML(html) {
    const indentSize = 4; // Number of spaces for indentation
    let formatted = '';
    let indentLevel = 0;

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

    lines.forEach((line, index) => {
        const lineNumber = document.createElement("span");
        lineNumber.className = "line-numbers";
        lineNumber.textContent = index + 1; // Line number

        const codeLine = document.createElement("span");
        codeLine.textContent = line; // Code line

        lineNumbersDiv.appendChild(lineNumber);
        codeDiv.appendChild(codeLine);
    });

    codeDisplay.appendChild(lineNumbersDiv);
    codeDisplay.appendChild(codeDiv);
}

function copyToClipboard() {
    const textarea = document.getElementById("htmlCode");
    textarea.select(); // Select the text in the textarea
    document.execCommand("copy"); // Copy the selected text to the clipboard
    alert("HTML code copied to clipboard!"); // Notify the user
}
