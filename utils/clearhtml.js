// Removes all HTML tags from a string
function clearHtml(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/<[^>]*>/g, '');
}

module.exports = clearHtml;
