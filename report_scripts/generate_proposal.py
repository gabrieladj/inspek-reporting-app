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
print(f"TEMPLATE_PATH: {TEMPLATE_PATH}")


# Connect to MongoDB (adjust connection details as needed)
client = pymongo.MongoClient(os.getenv("MONGODB_URI"))
db = client.get_database()  # Use the correct database name
client_collection = db["clients"]  # Use the correct collection name
report_collection = db["reports"]  # Use the correct collection name

def generate_proposal(client_id, report_id):
    if not ObjectId.is_valid(client_id):
        print("Error: Invalid client_id: {client_id}")
        sys.exit(1)
    if not ObjectId.is_valid(report_id):
        print("Error: Invalid report_id: {report_id}")
        sys.exit(1)

    client_data = client_collection.find_one({"_id": ObjectId(client_id)})
    if not client_data:
        print("Error: Client not found for ID: {client_id}")
        sys.exit(1)

    report_data = report_collection.find_one({"_id": ObjectId(report_id)})
    if not report_data:
        print("Error: Report not found for ID: {report_id}")
        sys.exit(1)

    if not os.path.exists(TEMPLATE_FILE):
        print("Error: Template file not found at {TEMPLATE_FILE}")
        sys.exit(1)

    doc = Document(TEMPLATE_FILE)
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

    print("Arguments passed to the script:", sys.argv)
    if len(sys.argv) < 2:
        print("Error: Insufficient arguments passed to the script.")
        sys.exit(1)

    # Parse client and report IDs from the argument
    try:
        data = json.loads(sys.argv[1])
        client_id = data.get('clientId')
        report_id = data.get('reportId')
        print(f"Received clientId: {client_id}, reportId: {report_id}")
    except json.JSONDecodeError as e:
        print(f"Error parsing arguments: {e}")
        sys.exit(1)


    for placeholder, value in placeholders.items():
        print(f"Replacing placeholder: {placeholder} with value: {value}")
        for paragraph in doc.paragraphs:
            if placeholder in paragraph.text:
                print(f"Found placeholder: {placeholder} in paragraph: {paragraph.text}")
                for run in paragraph.runs:
                    if placeholder in run.text:
                        print(f"Replacing in run: {run.text}")
                        run.text = run.text.replace(placeholder, value)


    output_file = os.path.join(
    TEMPLATE_PATH, f"Proposal_{client_data['clientName']}_{report_data['propertyName']}.docx"
    )
    print(f"Saving document to: {output_file}")
    doc.save(output_file)

    if os.path.exists(output_file):
        print(f"File saved successfully: {output_file}")
    else:
        print("Error: File did not save properly.")

    if __name__ == "__main__":
        print("Python script started")
        generate_proposal(client_id, report_id)
