// JQuery is bloat, so just made my own function
/**
 * Returns the element selected by the element
 * @param {string} selector Selector, looks like the css selectors
 * @returns {Element | NodeListOf<Element> | undefined}
 */
function $(selector) {
    let result = document.querySelectorAll(selector);
    if (result.length === 0) {
        // Nothing found
        return;
    }
    if (result.length > 1) {
        // More than one found
        return result;
    }
    if (result.length == 1) {
        // One was found, return it
        return result[0];
    }
}
;
export default $;
export { $ };
