function formatHTML(html) {
    const indentSize = 4; // Number of spaces for indentation
    let formatted = '';
    let indentLevel = 0;

    // Remove <a id="_Toc...."></a> tags
    html = html.replace(/<a id="[^"]*"><\/a>/g, '');

    // Remove everything from the specified paragraph to the first <h1>
    html = html.replace(/<p>\s*<strong>\s*Web content submission template\s*<\/strong>\s*<\/p>.*?(?=<h1>)/s, '');

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
    const keywordsMatch = html.match(/<strong>\s*Keywords:\s*<\/strong>.*?<\/p>\s*<\/td>\s*<td[^>]*>\s*<p>\s*([\s\S]*?)\s*<\/p>/);
    let keywords = keywordsMatch ? keywordsMatch[1].trim() : "No keywords available.";

    // Replace semicolons with commas in keywords
    keywords = keywords.replace(/;\s*/g, ',');

    // Remove trailing commas or spaces
    keywords = keywords.replace(/[, ]+$/, '');

    // Add the HTML structure at the beginning
    formatted += `<!DOCTYPE html>
<!--[if lt IE 9]><html class="no-js lt-ie9" lang="en" dir="ltr"><![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en" dir="ltr">
<head>
<!--#include virtual="/includes/aa/AA_header.html" -->
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
<!--#include virtual="/includes/aa/AA_metadata.html" --> 
<!-- End of Metadata--> 
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
  <li class="wb-slc"> <a class="wb-sl" href="#wb-cont">Skip to main content</a> </li>
  <li class="wb-slc visible-sm visible-md visible-lg"> <a class="wb-sl" href="#wb-info">Skip to "About this site"</a> </li>
</ul>
<!--#include virtual="/site/wet4.0/html5/includes/banner_site-site_banner-eng.html" --> 
<!--#include virtual="/site/wet4.0/html5/includes/nav_mega-mega_nav-eng.html" -->
<nav role="navigation" id="wb-bc" class="" property="breadcrumb">
  <h2 class="wb-inv">You are here:</h2>
  <div class="container">
    <div class="row">
      <ol class="breadcrumb">
        <!-- Start of pain-bread-eng.html (main site and sub-site) / D&eacute;but de pain-bread-eng.html (site principale et sous-site) --> 
        <!--#include virtual="/site/wet4.0/html5/includes/pain-bread-eng.html" --> 
        <!-- End of pain-bread-eng.html (main site and sub-site) / Fin de pain-bread-eng.html (site principale et sous-site) -->
        <li><a href="/remuneration-compensation/index-eng.html">Compensation</a></li>
        <li><a href="/remuneration-compensation/comm-eng.html">Compensation community hub</a></li>
        <li><a href="/remuneration-compensation/instructions-eng.html">Pay system instructions and documentation </a></li>
        <li><a href="/remuneration-compensation/utiliser-use-eng.html">How to use the pay system</a></li>
        <li><a href="/remuneration-compensation/procedures/recherche-search-eng.html">Phoenix procedures, job aids and instructions</a></li>
      </ol>
    </div>
  </div>
</nav>
<main role="main" property="mainContentOfPage" class="container"> 
  <!-- Start of Main Content -->\n`;

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

    // Add the specified footer content after the main content
    formatted += `<!-- End of Main Content -->
  <div class="row pagedetails">
    <div class="col-sm-5 col-xs-12 datemod">
      <dl id="wb-dtmd">
        <dt>Date modified:&#32;</dt>
        <dd>
          <time property="dateModified"> 
            <!--#config timefmt='%Y-%m-%d'--> 
            <!--#echo var='LAST_MODIFIED'--> 
          </time>
        </dd>
      </dl>
    </div>
  </div>
</main>
<!--#include virtual="/site/wet4.0/html5/includes/pied_site-site_footer-eng.html" --> 
<!--#set var="piwikSiteId" value="308" --> 
<!--#include virtual="/includes/piwik/piwik.html" --> 
<!--#include virtual="/site/wet4.0/html5/includes/script-pied_site-site_footer.html" --> 
<!--#include virtual="/includes/aa/AA_footer.html" -->
</body>
</html>`;

    return formatted.trim(); // Remove any leading/trailing whitespace
}
