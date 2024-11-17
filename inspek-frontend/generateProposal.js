const fs = require('fs');
const path = require('path');
const docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

// Path to the template file
const TEMPLATE_PATH = path.join(__dirname, '..', 'word_templates', 'proposal_template.docx');

// Function to generate the proposal
function generateProposal(clientData) {
    // Read the template file as a binary string
    const templateFile = fs.readFileSync(TEMPLATE_PATH, 'binary');

    // Create a PizZip instance to work with the binary file
    const zip = new PizZip(templateFile);

    // Create a docxtemplater instance
    const doc = new docxtemplater(zip);

    // Set the data (replacing placeholders)
    doc.setData(clientData);

    try {
        // Render the document (replace the placeholders with actual data)
        doc.render();
    } catch (error) {
        console.error(error);
        throw error;
    }

    // Generate the output file as a node buffer
    const outputFilePath = path.join(__dirname, '..', 'word_templates', `Proposal_${clientData.clientName}.docx`);
    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    // Write the generated DOCX file to disk
    fs.writeFileSync(outputFilePath, buf);
    console.log(`Proposal generated and saved as ${outputFilePath}`);
}

// Example client data (replace with actual dynamic data)
const clientData = {
    clientName: 'Tori Lynn',
    companyName: 'Lynn Enterprises',
    address: '789 Market St',
    cityStateZip: 'Los Angeles, CA 90001',
    date: 'November 17, 2024',
    propertyAddress: '101 Business Ave',
    buildingType: 'Steel Frame',
    squareFootage: '15000',
    structuralCharacteristics: 'Steel frame structure with reinforced concrete floors',
    uniqueFeatures: 'Eco-friendly design, solar panels installed',
    hvacElectrical: 'Central HVAC system, electrical system up to code',
    projectTitle: 'Building Inspection Proposal'
};

// Call the function to generate the proposal
generateProposal(clientData);
