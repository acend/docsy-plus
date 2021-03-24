window.addEventListener("load", () => {
  const PLACEHOLDERS_KEY = "replaceContentPlaceholders";
  const DELETION_VALUE = "_";
  const ROOT_NODE = document.querySelector("main");

  const config = {{ .Site.Params.ReplaceContent.Placeholders | jsonify }};
  const allowedHosts =
    {{ .Site.Params.ReplaceContent.AllowedHrefHosts | jsonify }};
  const allowedHostsRegex =
    allowedHosts &&
    new RegExp(
      `^https?://([-a-z0-9]+\\.)*(${allowedHosts
        .map((h) => h.replace(".", "\\."))
        .join("|")})(:[0-9]+)?$`
    );
  const storedPlaceholders = readPlaceholders();

  const replacements = config.map(
    ({ placeholder, defaultValue, queryParam, href }) => ({
      placeholder,
      value: getReplacementValue(placeholder, defaultValue, queryParam, href),
      defaultValue,
      href,
    })
  );

  replaceInTextNodes(replacements, ROOT_NODE);
  replaceInHrefs(replacements, ROOT_NODE);

  savePlaceholders(replacements);

  function getReplacementValue(placeholder, defaultValue, queryParam, href) {
    let newValue = getQueryParameter(queryParam);
    if (!newValue || newValue !== DELETION_VALUE) {
      if (newValue && isValidReplacementValue(newValue, href)) {
        return newValue;
      } else if (storedPlaceholders[placeholder]) {
        return storedPlaceholders[placeholder];
      }
    }
    return defaultValue;
  }

  /**
   * Replacement values that are going to be used in href attributes
   * must match a strict regexp to avoid XSS
   */
  function isValidReplacementValue(value, href) {
    if (href) {
      const valid = allowedHostsRegex && allowedHostsRegex.test(value);
      if (!valid) {
        console.warn("Invalid href replacement value:", value);
      }
      return valid;
    }
    return true;
  }

  function getQueryParameter(param) {
    const queryParams = window.location.search.substring(1).split("&");
    for (let queryParam of queryParams) {
      const [key, value] = queryParam.split("=");
      if (key === param) {
        return value || null;
      }
    }
    return null;
  }

  function readPlaceholders() {
    const placeholders = localStorage.getItem(PLACEHOLDERS_KEY);
    return placeholders ? JSON.parse(placeholders) : {};
  }

  function savePlaceholders(replacements) {
    const placeholders = replacements.reduce(
      (acc, { placeholder, value, defaultValue }) => ({
        ...acc,
        [placeholder]: value !== defaultValue ? value : undefined,
      }),
      {}
    );
    localStorage.setItem(PLACEHOLDERS_KEY, JSON.stringify(placeholders));
  }

  function replaceInTextNodes(replacements, target) {
    [
      target,
      ...target.querySelectorAll("*:not(script):not(noscript):not(style)"),
    ].forEach((node) =>
      node.childNodes.forEach((childNode) => {
        if (childNode.nodeType === Node.TEXT_NODE) {
          replaceInTextNode(childNode, replacements);
        }
      })
    );
  }

  function replaceInTextNode(node, replacements) {
    node.textContent = replacements.reduce(
      (textContent, { placeholder, value }) =>
        textContent.replace(placeholder, value),
      node.textContent
    );
  }

  function replaceInHrefs(replacements, target) {
    const hrefReplacements = replacements.filter(({ href }) => href);
    if (hrefReplacements.length === 0) {
      return;
    }

    target.querySelectorAll("[href]").forEach((node) =>
      node.setAttribute(
        "href",
        hrefReplacements.reduce(
          (hrefValue, { placeholder, value }) =>
            hrefValue.replace(placeholder, value),
          node.getAttribute("href")
        )
      )
    );
  }
});
