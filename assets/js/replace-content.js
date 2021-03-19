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
  // replace href
  if(element.hasAttribute("href")){
    element.setAttribute("href", element.getAttribute("href").replace(pattern, replacement));
  }
}

var replaceWith = (getUrlParameter('h') === undefined) ? localStorage.getItem('replaceWith') : getUrlParameter('h')
var replacePattern = "{{ .Site.Params.ReplaceLabContent }}"; 
switch (replaceWith) {
  // reset localStorage and assign default value
  case '':
  case '_':
    localStorage.removeItem('replaceWith');
    replaceWith = replacePattern.toLowerCase();
    break;
  // no valid data, assign default value
  case undefined:
  case null:
    replaceWith = replacePattern.toLowerCase();
    break;
  // default: make sure the value is persited
  default:
    localStorage.setItem('replaceWith', replaceWith);
}
replaceInText(document.body, replacePattern, replaceWith);
