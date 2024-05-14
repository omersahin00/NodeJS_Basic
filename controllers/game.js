const path = require("path");

exports.getGame = async (req, res) => {
    try {
        const projectDir = path.resolve(__dirname, '../');
        res.sendFile(path.join(projectDir, 'public', 'index.html'));
    }
    catch (error) {
        console.error(error);
    }
}
