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
                outputDiv.innerHTML = `<h3>Converted HTML Code:</h3> <div class="code-container" id="codeDisplay"></div> <textarea id="htmlCode" style="display: none;">${formattedHTML}</textarea> <button onclick="copyToClipboard()">Copy Code</button>`;
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

    // Remove the section between the specified <p> and the first <h1>
    html = html.replace(/<p>\s*<strong>\s*Web content submission template\s*<\/strong>\s*<\/p>\s*(.*?)<h1>/s, '<h1>'); // Removing the unwanted section

    // Extract keywords using the new function
    const keywords = extractKeywords(html);
    console.log("Extracted Keywords:", keywords); // Debugging line

    // Clean up the keywords
    const cleanedKeywords = keywords.replace(/;\s*/g, ','); // Replace semicolons with commas
    const finalKeywords = cleanedKeywords.replace(/[, ]+$/, ''); // Remove trailing commas or spaces

    // Remove <a id="_Toc...."></a> tags
    html = html.replace(/<a id="[^"]*"><\/a>/g, '');

    // Get the current date in Eastern Time
    const currentDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());

    // Reformat the date to YYYY-MM-DD
    const [month, day, year] = currentDate.split('/');
    const formattedCurrentDate = `${year}-${month}-${day}`; // Format to YYYY-MM-DD

    // Replace <h1> tags to add properties
    html = html.replace(/<h1>(.*?)<\/h1>/g, (match, p1) => {
        return `<h1 property="name" id="wb-cont">${p1}</h1>`;
    });

    // Get the first h1 content for the title
    const titleMatch = html.match(/<h1 property="name" id="wb-cont">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : "Document Title";

    // Extract description from the table
    const description = extractDescription(html);

    // Add the HTML structure at the beginning
    formatted += `<!DOCTYPE html>
    <!--[if lt IE 9]><html class="no-js lt-ie9" lang="fr" dir="ltr"><![endif]-->
    <!--[if gt IE 8]><!-->
    <html class="no-js" lang="fr" dir="ltr">
    <head>
    <!--#include virtual="/includes/aa/AA_header.html" -->
    <meta charset="utf-8"/>
    <!-- Start of Title -->
    <title>${title} - GCIntranet - SPAC</title>
    <!-- End of Title --> 
    <!-- Start of Metadata -->
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta name="description" content="${description}" /> 
    <meta name="dcterms.description" content="${description}" />
    <meta name="dcterms.creator" content="Gouvernement du Canada, Services publics et Approvisionnement Canada" />
    <meta name="dcterms.title" content="${title}" /> 
    <meta name="dcterms.issued" title="W3CDTF" content="${formattedCurrentDate}" /> 
    <meta name="dcterms.modified" title="W3CDTF" content="<!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'-->" />
    <meta name="dcterms.subject" title="gccore" content="*Insert highlighted topics in the document*" /> 
    <meta name="dcterms.language" title="ISO639-2" content="fra" />
    <meta name="keywords" content="${finalKeywords}" />
    <!--#include virtual="/includes/aa/AA_metadata.html" -->
    <!-- End of Metadata-->
    <!-- Start of tete-head.html / D&eacute;but de tete-head.html -->
    <!--#include virtual="/site/wet4.0/html5/includes/tete-head.html" -->
    <!-- Start of Custom CSS -->
    <!-- End of Custom CSS--> 
    <!-- Start of no script code -->
    <noscript>
    <link rel="stylesheet" href="/boew-wet/wet4.0/css/noscript.min.css"/>
    </noscript>
    <!-- End of no script code--> 
    <script>dataLayer1 = [];</script>
    </head>
    <body vocab="http://schema.org/" typeof="WebPage">
    <ul id="wb-tphp">
      <li class="wb-slc"> <a class="wb-sl" href="#wb-cont">Passer au contenu principal</a></li>
      <li class="wb-slc visible-sm visible-md visible-lg"> <a class="wb-sl" href="#wb-info">Passer &agrave; &laquo;&#160;&Agrave; propos de ce site&#160;&raquo;</a></li>
    </ul>
    <!-- Start of banner_site-site_banner-fra.html / D&eacute;but de banner_site-site_banner-fra.html --> 
    <!--#include virtual="/site/wet4.0/html5/includes/banner_site-site_banner-fra.html" --> 
    <!-- End of banner_site-site_banner-fra.html / Fin de banner_site-site_banner-fra.html --> 
    <!-- Start of nav_mega-mega_nav-fra.html / D&eacute;but de nav_mega-mega_nav-fra.html --> 
    <!--#include virtual="/site/wet4.0/html5/includes/nav_mega-mega_nav-fra.html" --> 
    <!-- End of nav_mega-mega_nav-fra.html / Fin de nav_mega-mega_nav-fra.html -->
    <nav id="wb-bc" class="" property="breadcrumb">
      <h2 class="wb-inv">Vous &ecirc;tes ici&nbsp;:</h2>
      <div class="container">
        <div class="row">
          <ol class="breadcrumb">
            <!-- Start of pain-bread-fra.html (main site and sub-site) / D&eacute;but de pain-bread-fra.html (site principale et sous-site) --> 
            <!--#include virtual="/site/wet4.0/html5/includes/pain-bread-fra.html" --> 
            <!-- End of pain-bread-fra.html (main site and sub-site) / Fin de pain-bread-fra.html (site principale et sous-site) -->
            <li><a href="/remuneration-compensation/index-fra.html">Rémunération</a></li>
            <li><a href="/remuneration-compensation/comm-fra.html">Carrefour de la communauté de la rémunération</a></li>
            <li><a href="/remuneration-compensation/instructions-fra.html">Instructions et documentation sur le système de paye</a></li>
            <li><a href="/remuneration-compensation/utiliser-use-fra.html">Comment utiliser le système de paye</a></li>
            <li><a href="/remuneration-compensation/procedures/recherche-search-fra.html">Procédures, outils de travail et instructions de Phénix</a></li>
          </ol>
        </div>
      </div>
    </nav>
    <main property="mainContentOfPage" class="container">
    <!-- Start of Main Content -->\n`;

    // Indentation and formatting of the rest of the HTML
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

    formatted += `<!-- End of Main Content -->
    <div class="row pagedetails">
    <div class="col-sm-5 col-xs-12 datemod">
      <dl id="wb-dtmd">
        <dt>Date de modification&#160;:&#32;</dt>
        <dd>
          <time property="dateModified"><!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'--></time>
        </dd>
      </dl>
    </div> 
  </div>
</main>
<!-- End of Main Content --> 
<!-- Start of pied_site-site_footer-fra.html / D&eacute;but de pied_site-site_footer-fra.html --> 
<!--#include virtual="/site/wet4.0/html5/includes/pied_site-site_footer-fra.html" --> 
<!-- End of pied_site-site_footer-fra.html / Fin de pied_site-site_footer-fra.html --> 
<!-- Start of script-pied_site-site_footer.html / D&eacute;but de script-pied_site-site_footer.html --> 
<!--#include virtual="/site/wet4.0/html5/includes/script-pied_site-site_footer.html" --> 
<!-- End of script-pied_site-site_footer.html / Fin de script-pied_site-site_footer.html --> 
<!-- Start of Custom Scripts --> 
<!--#set var="piwikSiteId" value="308" --> 
<!--#include virtual="/includes/piwik/piwik.html" --> 
<!-- End of Custom Scripts --> 
<!--#include virtual="/includes/aa/AA_footer.html" -->
</body>
</html>`;
    
    return formatted.trim(); // Remove any leading/trailing whitespace
}

// Function to extract keywords from the HTML content
function extractKeywords(html) {
    const regex = /<td[^>]*>\s*<p>\s*<strong>\s*Mots clés\s*:\s*<\/strong>\s*(.*?)<\/p>\s*<\/td>\s*<td[^>]*>(.*?)<\/td>/i;
    const match = html.match(regex);

    if (match && match[2]) {
        // Extract the second <td> content, ignoring nested tags
        const keywordsContent = match[2].replace(/<[^>]*>/g, '').trim(); // Remove any remaining HTML tags
        // Split by comma and join with space to add space between keywords
        return keywordsContent.split(',').map(keyword => keyword.trim()).join(' '); // Return cleaned keywords with space
    }
    
    return ""; // Return empty if no match found
}

// Enhanced function to extract description from the HTML
function extractDescription(html) {
    const regex = /<td>\s*<p>\s*<strong>\s*Description\s*:\s*<\/strong>\s*(.*?)<\/p>\s*<\/td>\s*<td colspan="3">\s*<p>\s*(.*?)<\/p>\s*<\/td>/;
    const match = html.match(regex);

    if (match) {
        // Extract the description content, handling possible nested tags
        let description = match[2].trim();

        // Remove nested HTML tags, keeping the text content
        description = description.replace(/<[^>]*>/g, '');

        // Additional cleaning: replace multiple spaces with a single space
        description = description.replace(/\s+/g, ' ');

        // Optional: limit the description length for output
        const maxLength = 200; // Change this value as needed
        if (description.length > maxLength) {
            description = description.substring(0, maxLength) + '...'; // Truncate with ellipsis
        }

        return description; // Return the cleaned description
    }

    return "No description available."; // Return default if no match found
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
