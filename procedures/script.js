let abbreviations = [];

function addAbbreviation() {
    // Get the values from the input fields
    const abbr = document.getElementById('abbr').value.trim();
    const desc = document.getElementById('desc').value.trim();

    // Check if both fields are filled
    if (abbr && desc) {
        // Create a new abbreviation item
        const abbreviationItem = document.createElement('div');
        abbreviationItem.className = 'abbreviation-item';

        // Create the abbreviation element and add the title for the description
        const abbreviationElement = document.createElement('abbr');
        abbreviationElement.title = desc;
        abbreviationElement.textContent = abbr;

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = 'X';
        deleteButton.onclick = function() {
            abbreviationItem.remove();
            // Remove abbreviation from the list
            abbreviations = abbreviations.filter(item => item.abbr !== abbr);
            checkSubmitButton(); // Recheck submit button status
        };

        // Append the abbreviation and delete button to the item
        abbreviationItem.appendChild(abbreviationElement);
        abbreviationItem.appendChild(deleteButton);

        // Append the new abbreviation item to the list
        document.getElementById('abbreviationList').appendChild(abbreviationItem);

        // Add abbreviation to the abbreviation list array
        abbreviations.push({ abbr, desc });

        // Clear the input fields for the next entry
        document.getElementById('abbr').value = '';
        document.getElementById('desc').value = '';

        // Recheck submit button status
        checkSubmitButton();
    } else {
        alert("Please fill in both fields.");
    }
}

function checkSubmitButton() {
    const text = document.getElementById('largeText').value.trim();
    const submitBtn = document.getElementById('submitBtn');
    
    // Enable the Submit button if there is at least one abbreviation and text in the textarea
    if (abbreviations.length > 0 && text) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function submitText() {
    const text = document.getElementById('largeText').value.trim();
    let modifiedText = text;

    // Loop through the abbreviations array and replace text with <abbr> tags
    abbreviations.forEach(item => {
        const regex = new RegExp(`\\b${item.abbr}\\b`, 'g'); // Match whole words (case-sensitive)
        modifiedText = modifiedText.replace(regex, `<abbr title="${item.desc}">${item.abbr}</abbr>`);
    });

    // Display the modified text in the new textarea
    document.getElementById('modifiedText').value = modifiedText;
}
