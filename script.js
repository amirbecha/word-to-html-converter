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
                // Display the HTML code directly
                outputDiv.innerHTML = `<h3>Converted HTML Code:</h3><textarea rows="20" cols="80">${result.value}</textarea>`;
            })
            .catch(function(err) {
                outputDiv.innerHTML = `<p>Error: ${err.message}</p>`;
            });
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}
