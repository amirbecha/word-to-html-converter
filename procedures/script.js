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

    // Loop through the abbreviations array and replace or update <abbr> tags
    abbreviations.forEach(item => {
        // Regex: Match abbreviations, but ignore those inside parentheses
        const regex = new RegExp(`(<abbr[^>]*>\\s*${item.abbr}\\s*</abbr>)|(?<!\\([^)]+)\\b${item.abbr}\\b(?![^()]*\\))`, 'g'); 

        modifiedText = modifiedText.replace(regex, (match, abbrTag) => {
            if (abbrTag) {
                // If it's an <abbr> tag, update the title attribute
                const newAbbrTag = abbrTag.replace(/title="[^"]*"/, `title="${item.desc}"`);
                return newAbbrTag; // Return the modified <abbr> tag
            } else {
                // If it's a standalone abbreviation, replace with new <abbr> tag
                return `<abbr title="${item.desc}">${item.abbr}</abbr>`;
            }
        });
    });

    // Display the modified text in the new textarea
    document.getElementById('modifiedText').value = modifiedText;
}
