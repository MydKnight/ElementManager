const {createJWT, getToken, createExportPackage} = require('./elementManagerAPI');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const user = {
    name: process.env.sourceUser,
    email: process.env.sourceEmail, 
};

const jwtToken = createJWT(user);

const readJsonFile = (filename) => {
    const jsonFile = path.join(__dirname, filename);
    try {
        if (!fs.existsSync(jsonFile)) {
            console.error('File not found:', jsonFile);
            process.exit(1);
        }else{
            const json = fs.readFileSync(jsonFile, 'utf8');
            const elements = JSON.parse(json);
            return elements;
        }
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

(async () => {
    try {
        // Generate the token
        const token = await getToken(jwtToken, process.env.sourceInterface, process.env.sourceSite);

        // Read the JSON file
        const elements = readJsonFile('export.json');

        // Validate all elements in JSON

        // Export all elements from the JSON file
        const res = await createExportPackage(token, elements, process.env.sourceInterface, process.env.sourceSite).catch(error => {
            console.error("Something Fishy....");
        });

        // Validate the export

        // Download the export

        // Commit the export to ADO

        // Generate a toen to the destination system

        // Import the Package to the destination system

        // Validate the import

    } catch (error) {
        console.error('An error occurred:', error);
    }
})();

