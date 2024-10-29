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
                const lineCount = formattedHTML.split('\n').length;
                outputDiv.innerHTML = `<div id="lineNumbers">${generateLineNumbers(lineCount)}</div>
                                       <textarea id="htmlCode" rows="20" cols="80" readonly>${formattedHTML}</textarea>
                                       <button onclick="copyToClipboard()">Copy Code</button>`;
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

function generateLineNumbers(count) {
    let lines = '';
    for (let i = 1; i <= count; i++) {
        lines += i + '\n';
    }
    return lines;
}

function copyToClipboard() {
    const textarea = document.getElementById("htmlCode");
    textarea.select(); // Select the text in the textarea
    document.execCommand("copy"); // Copy the selected text to the clipboard
    alert("HTML code copied to clipboard!"); // Notify the user
}
