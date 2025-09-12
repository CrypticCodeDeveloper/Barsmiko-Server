// Checks if a string is a valid URL
function isValidLink(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = isValidLink;
