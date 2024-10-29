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
                // Escape HTML to show the actual code
                const htmlOutput = result.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                outputDiv.innerHTML = `<h3>Converted HTML:</h3><pre>${htmlOutput}</pre>`;
            })
            .catch(function(err) {
                outputDiv.innerHTML = `<p>Error: ${err.message}</p>`;
            });
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}
