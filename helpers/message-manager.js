module.exports = function MessageCreate(message, type) {
    return { text: message.toString(), type: type.toString() };
}
