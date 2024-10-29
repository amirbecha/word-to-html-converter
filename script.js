function formatHTML(html) {
    const indentSize = 4; // Number of spaces for indentation
    let formatted = '';
    let indentLevel = 0;

    // Remove <a id="_Toc...."></a> tags
    html = html.replace(/<a id="[^"]*"><\/a>/g, '');

    // Replace <h1> tags to add properties
    html = html.replace(/<h1>(.*?)<\/h1>/g, (match, p1) => {
        return `<h1 property="name" id="wb-cont">${p1}</h1>`;
    });

    // Get the first h1 content for the title
    const titleMatch = html.match(/<h1 property="name" id="wb-cont">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : "Document Title";

    // Get the current date
    const currentDate = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

    // Extract description from the table
    const descriptionMatch = html.match(/<td>\s*<p>\s*<strong>\s*Description:\s*<\/strong>\s*(.*?)<\/p>\s*<\/td>\s*<td colspan="3">\s*<p>\s*(.*?)<\/p>\s*<\/td>/);
    const description = descriptionMatch ? descriptionMatch[2].trim() : "No description available.";

    // Extract keywords from the table
    const keywordsMatch = html.match(/<td>\s*<p>\s*<strong>\s*Keywords:\s*<\/strong>\s*(.*?)<\/p>\s*<\/td>\s*<td colspan="3">\s*<p>\s*(.*?)<\/p>\s*<\/td>/);
    let keywords = keywordsMatch ? keywordsMatch[2].trim() : "No keywords available.";
    
    // Replace semicolons with commas in keywords
    keywords = keywords.replace(/;\s*/g, ', ');

    // Add the HTML structure at the beginning
    formatted += `<!DOCTYPE html>
<!--[if lt IE 9]><html class="no-js lt-ie9" lang="en" dir="ltr"><![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en" dir="ltr">
<head>
<!--#include virtual="/includes/aa/AA_header.html" />
<meta charset="utf-8"/>
<!-- Start of Title -->
<title>${title} - GCIntranet - PSPC</title>
<!-- End of Title -->
<!-- Start of Metadata -->
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<meta name="${description}" /> 
<meta name="dcterms.description" content="${description}" />
<meta name="dcterms.creator" content="Government of Canada, Public Services and Procurement Canada, Public Service Pay Centre" />
<meta name="dcterms.title" content="${title}" /> 
<meta name="dcterms.issued" title="W3CDTF" content="${currentDate}" /> 
<meta name="dcterms.modified" title="W3CDTF" content="<!--#config timefmt='%Y-%m-%d'--><!--#echo var='LAST_MODIFIED'-->" />
<meta name="dcterms.subject" title="gccore" content="*Insert highlighted topics in the document*" /> 
<meta name="dcterms.language" title="ISO639-2" content="eng" />
<meta name="keywords" content="${keywords}" />
<!-- End of Metadata -->\n`;

    // Split and format the remaining HTML
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
