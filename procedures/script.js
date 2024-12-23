// script.js

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

        // Add the abbreviation to the item
        abbreviationItem.appendChild(abbreviationElement);

        // Append the new abbreviation item to the list
        document.getElementById('abbreviationList').appendChild(abbreviationItem);

        // Clear the input fields for the next entry
        document.getElementById('abbr').value = '';
        document.getElementById('desc').value = '';
    } else {
        alert("Please fill in both fields.");
    }
}

