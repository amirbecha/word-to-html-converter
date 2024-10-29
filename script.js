<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Word to HTML Converter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            background-color: #f4f4f4; /* Light gray background */
            color: #333; /* Dark text color */
        }
        h1 {
            color: #2c3e50; /* Dark blue heading */
            text-align: center; /* Center align heading */
        }
        #output {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            background-color: #ffffff; /* White background for output */
            border-radius: 5px; /* Rounded corners for output */
        }
        button {
            margin: 10px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border: none;
            border-radius: 5px; /* Rounded corners */
            transition: background-color 0.3s, transform 0.2s; /* Smooth transition for hover effects */
        }
        .convert-btn {
            background-color: #3498db; /* Blue button */
            color: white;
        }
        .convert-btn:hover {
            background-color: #2980b9; /* Darker blue on hover */
        }
        .code-container {
            display: flex;
            white-space: pre; /* Maintain whitespace */
            font-family: monospace; /* Use a monospaced font for code */
        }
        .line-numbers {
            display: inline-block;
            width: 40px; /* Fixed width for line numbers */
            padding-right: 10px; /* Space between line numbers and code */
            text-align: right; /* Right align numbers */
            color: #888; /* Light color for line numbers */
            user-select: none; /* Prevent selection of line numbers */
            border-right: 1px solid #ddd; /* Optional: border between numbers and code */
        }
        .code {
            flex-grow: 1; /* Take up the remaining space */
            padding-left: 10px; /* Space between numbers and code */
            overflow-x: auto; /* Enable horizontal scrolling */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 property="name" id="wb-cont">Word to HTML Converter</h1>
        <input type="file" id="upload" accept=".docx" />
        <button class="convert-btn" onclick="convertToHTML()">Convert to HTML</button>
        <div id="output"></div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js"></script>
    <script>
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

            // Replace <h1>, <h2>, <h3>, and <p> tags to add properties and ensure they are inline
            html = html.replace(/<h1>(.*?)<\/h1>/g, '<h1 property="name" id="wb-cont">$1</h1>');
            html = html.replace(/<h2>(.*?)<\/h2>/g, '<h2>$1</h2>');
            html = html.replace(/<h3>(.*?)<\/h3>/g, '<h3>$1</h3>');
            html = html.replace(/<p>(.*?)<\/p>/g, '<p>$1</p>');

            // Remove line breaks between tags to keep them inline
            html = html.replace(/>\s*</g, '><');

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
    </script>
</body>
</html>
