import os
from docx import Document
from datetime import datetime
from dotenv import load_dotenv
import sys
import json
import pymongo
from bson import ObjectId  # Import ObjectId from bson

# Load environment variables
load_dotenv()

# Path to your proposal template
TEMPLATE_PATH = os.getenv('TEMPLATE_PATH')

if TEMPLATE_PATH is None:
    print("Error: TEMPLATE_PATH is not set in the environment variables!")
    sys.exit(1)

# Normalize path separator for cross-platform compatibility
TEMPLATE_FILE = os.path.join(TEMPLATE_PATH, 'proposal_template.docx')

# Connect to MongoDB (adjust connection details as needed)
client = pymongo.MongoClient(os.getenv("MONGODB_URI"))
db = client.get_database()  # Use the correct database name
client_collection = db["clients"]  # Use the correct collection name
report_collection = db["reports"]  # Use the correct collection name

def generate_proposal(client_id, report_id):
    """
    Generates a proposal document by replacing placeholders in the Word template.
    Fetches client and report data from the database based on provided IDs.

    :param client_id: MongoDB ObjectId for the client.
    :param report_id: MongoDB ObjectId for the report.
    """
    # Validate the client_id and report_id to ensure they are valid ObjectId strings
    if not ObjectId.is_valid(client_id):
        print(f"Error: Invalid client_id: {client_id}")
        sys.exit(1)
    if not ObjectId.is_valid(report_id):
        print(f"Error: Invalid report_id: {report_id}")
        sys.exit(1)

    # Fetch client and report data from the database
    client_data = client_collection.find_one({"_id": ObjectId(client_id)})
    report_data = report_collection.find_one({"_id": ObjectId(report_id)})

    if not client_data or not report_data:
        print(f"Error: Client or Report not found for IDs: {client_id}, {report_id}")
        sys.exit(1)

    # Check if the template exists
    if not os.path.exists(TEMPLATE_FILE):
        print(f"Error: Template file not found at {TEMPLATE_FILE}")
        sys.exit(1)

    # Load the template
    doc = Document(TEMPLATE_FILE)

    # Define placeholders and map them to data from client_data and report_data
    placeholders = {
        "{clientName}": client_data.get("clientName", ""),
        "{mailingAddress}": client_data.get("mailingAddress", ""),
        "{propertyName}": report_data.get("propertyName", ""),
        "{propertyAddress}": report_data.get("propertyAddress", ""),
        "{officeSpacePercentage}": str(report_data.get("officeSpacePercentage", "")),
        "{warehouseSpacePercentage}": str(report_data.get("warehouseSpacePercentage", "")),
        "{retailSpacePercentage}": str(report_data.get("retailSpacePercentage", "")),
        "{otherSpacePercentage}": str(report_data.get("otherSpacePercentage", "")),
        "{propertyRepresentativeName}": report_data.get("propertyRepresentativeName", ""),
    }

    # Replace placeholders in the document
    for paragraph in doc.paragraphs:
        for placeholder, value in placeholders.items():
            if placeholder in paragraph.text:
                for run in paragraph.runs:
                    run.text = run.text.replace(placeholder, value)

    # Save the updated document
    output_file = os.path.join(TEMPLATE_PATH, f"Proposal_{client_data['clientName']}.docx")
    doc.save(output_file)
    print(f"Proposal generated: {output_file}")
    return output_file

if __name__ == "__main__":
    # Expecting JSON data passed as command-line argument
    try:
        input_data = json.loads(sys.argv[1])
        client_id = input_data.get("client_id", "")
        report_id = input_data.get("report_id", "")
    except (IndexError, json.JSONDecodeError) as e:
        print(f"Error processing input data: {e}")
        sys.exit(1)

    # Generate the proposal
    output_file = generate_proposal(client_id, report_id)

    # Output the file path for the frontend to handle download
    print(json.dumps({"outputFile": output_file}))
