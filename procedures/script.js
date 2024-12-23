let abbreviations = [];

function addAbbreviation() {
    const abbr = document.getElementById('abbr').value.trim();
    const desc = document.getElementById('desc').value.trim();

    if (abbr && desc) {
        const abbreviationItem = document.createElement('div');
        abbreviationItem.className = 'abbreviation-item';

        const abbreviationElement = document.createElement('abbr');
        abbreviationElement.title = desc;
        abbreviationElement.textContent = abbr;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = 'X';
        deleteButton.onclick = function() {
            abbreviationItem.remove();
            abbreviations = abbreviations.filter(item => item.abbr !== abbr);
            checkSubmitButton();
        };

        abbreviationItem.appendChild(abbreviationElement);
        abbreviationItem.appendChild(deleteButton);
        document.getElementById('abbreviationList').appendChild(abbreviationItem);

        abbreviations.push({ abbr, desc });

        document.getElementById('abbr').value = '';
        document.getElementById('desc').value = '';

        checkSubmitButton();
    } else {
        alert("Please fill in both fields.");
    }
}

function checkSubmitButton() {
    const text = document.getElementById('largeText').value.trim();
    const submitBtn = document.getElementById('submitBtn');
    
    if (abbreviations.length > 0 && text) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function submitText() {
    const text = document.getElementById('largeText').value.trim();
    let modifiedText = text;

    abbreviations.forEach(item => {
        const regex = new RegExp(`(<abbr[^>]*>\\s*${item.abbr}\\s*</abbr>)|(?<!\\([^)]+)\\b${item.abbr}s?\\b(?![^()]*\\))`, 'g'); 

        modifiedText = modifiedText.replace(regex, (match, abbrTag) => {
            if (abbrTag) {
                const newAbbrTag = abbrTag.replace(/title="[^"]*"/, `title="${item.desc}"`);
                return newAbbrTag;
            } else {
                if (match.endsWith("s")) {
                    return `<abbr title="${item.desc}">${item.abbr}</abbr>s`;
                } else {
                    return `<abbr title="${item.desc}">${item.abbr}</abbr>`;
                }
            }
        });
    });

    document.getElementById('modifiedText').value = modifiedText;
}

function toggleAbbreviation(checkbox) {
    const abbrValue = checkbox.value;

    // Find the description based on abbreviation
    const descriptionMap = {
        'CA': 'Compensation Advisor',
        'STAR': 'Standardized Testing and Assessment Reporting',
        'MGR': 'Manager',
        // Add more mappings as needed
    };

    const description = descriptionMap[abbrValue];

    if (checkbox.checked) {
        // Add abbreviation to the list
        abbreviations.push({ abbr: abbrValue, desc: description });
        const abbreviationItem = document.createElement('div');
        abbreviationItem.className = 'abbreviation-item';

        const abbreviationElement = document.createElement('abbr');
        abbreviationElement.title = description;
        abbreviationElement.textContent = abbrValue;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = 'X';
        deleteButton.onclick = function() {
            abbreviationItem.remove();
            abbreviations = abbreviations.filter(item => item.abbr !== abbrValue);
            checkSubmitButton();
        };

        abbreviationItem.appendChild(abbreviationElement);
        abbreviationItem.appendChild(deleteButton);
        document.getElementById('abbreviationList').appendChild(abbreviationItem);

    } else {
        // Remove abbreviation from the list
        abbreviations = abbreviations.filter(item => item.abbr !== abbrValue);
        const abbreviationList = document.getElementById('abbreviationList');
        const items = abbreviationList.getElementsByClassName('abbreviation-item');

        Array.from(items).forEach(item => {
            const abbrText = item.querySelector('abbr').textContent;
            if (abbrText === abbrValue) {
                item.remove();
            }
        });
    }

    checkSubmitButton();
}
