function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam)
    {
      return sParameterName[1];
    }
  }
}

function replaceInText(element, pattern, replacement) {
  for (let node of element.childNodes) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        replaceInText(node, pattern, replacement);
        break;
      case Node.TEXT_NODE:
        node.textContent = node.textContent.replace(pattern, replacement);
        break;
      case Node.DOCUMENT_NODE:
        replaceInText(node, pattern, replacement);
    }
  }
}

var labHost = getUrlParameter('h');
var labHost = (labHost === undefined) ? localStorage.getItem('labHost') : labHost;
if (labHost == '' || labHost == '_') {
  localStorage.removeItem('labHost');
} else if (typeof labHost !== undefined && labHost !== null ) {
  localStorage.setItem('labHost', labHost);
  replaceInText(document.body, "://localhost", "://" + labHost );
}
