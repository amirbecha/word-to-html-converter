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
                outputDiv.innerHTML = `<h3>Converted HTML Code:</h3><textarea rows="20" cols="80">${formattedHTML}</textarea>`;
            })
            .catch(function(err) {
                outputDiv.innerHTML = `<p>Error: ${err.message}</p>`;
            });
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}

function formatHTML(html) {
    const formatted = html
        .replace(/></g, ">\n<")   // Add a newline between tags
        .replace(/^\s+|\s+$/g, "") // Trim spaces at the start and end
        .replace(/(<[^\/>]+>)(?=[^<])/g, "$1\n") // Newline after opening tags without closing slash
        .replace(/(<\/[^>]+>)/g, "\n$1") // Newline before closing tags
        .replace(/\n\s*\n/g, "\n") // Remove extra empty lines
        .replace(/>\n\s*</g, ">\n    <"); // Indent nested tags
    return formatted;
}
