// get file name and its folder name
// we are using this method to append the file name to the Logger 'winston' message
const getModuleFileName = function (callingModule) {
    var parts = callingModule.split('/');
    return parts[parts.length - 2] + '/' + parts.pop() + ':';
};

module.exports = getModuleFileName;