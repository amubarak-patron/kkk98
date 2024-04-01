// returns all the text nodes that match the search string
export default function findInPage(str, selector) {
  const regex = new RegExp(str, 'gi');
  const nodes = [];
  const walk = (node) => {
    if (node.nodeType === 3) {
      const match = node.data.match(regex);
      if (match) {
        nodes.push({
          node,
          match,
        });
      }
    }
    if (
      node.nodeType === 1 &&
      node.childNodes &&
      node.tagName !== 'SCRIPT' &&
      node.tagName !== 'STYLE'
    ) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < node.childNodes.length; i++) {
        walk(node.childNodes[i]);
      }
    }
  };

  if (selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      walk(element);
    });
  } else {
    walk(document.body);
  }

  return nodes;
}
