import os
from docx import Document
from datetime import datetime
from dotenv import load_dotenv
import sys
import pymongo
from bson import ObjectId  # Import ObjectId from bson
import argparse
from io import BytesIO

# Load environment variables
load_dotenv()

# Path to your proposal template
TEMPLATE_PATH = os.getenv('TEMPLATE_PATH')
if TEMPLATE_PATH is None:
    print("Error: TEMPLATE_PATH is not set in the environment variables!")
    sys.exit(1)
print(f"UPLOAD_FOLDER: {os.getenv('UPLOAD_FOLDER')}")


# Normalize path separator for cross-platform compatibility
TEMPLATE_FILE = os.path.join(TEMPLATE_PATH, 'proposal_template.docx')
print(f"TEMPLATE_PATH: {TEMPLATE_PATH}")

# Connect to MongoDB (adjust connection details as needed)
client = pymongo.MongoClient(os.getenv("MONGODB_URI"))
db = client.get_database()  # Use the correct database name
client_collection = db["clients"]  
report_collection = db["reports"]  
print(f"Connected to DB...")

# Parse arguments
parser = argparse.ArgumentParser(description="Generate a proposal document")
parser.add_argument("client_id", help="Client ID")
parser.add_argument("report_id", help="Report ID")
parser.add_argument("clientName", help="Client name")
parser.add_argument("mailingAddress", help="Client mailing address")
parser.add_argument("propertyName", help="Property name")
parser.add_argument("propertyAddress", help="Property address")
parser.add_argument("officeSpacePercentage", help="Percentage of office space")
parser.add_argument("warehouseSpacePercentage", help="Percentage of warehouse space")
parser.add_argument("retailSpacePercentage", help="Percentage of retail space")
parser.add_argument("otherSpacePercentage", help="Percentage of other space")
parser.add_argument("propertyRepresentativeName", help="Property representative name")
args = parser.parse_args()

client_id = args.client_id
report_id = args.report_id

# Validate IDs
if not ObjectId.is_valid(client_id):
    print(f"Error: Invalid client_id: {client_id}")
    sys.exit(1)
if not ObjectId.is_valid(report_id):
    print(f"Error: Invalid report_id: {report_id}")
    sys.exit(1)

def generate_proposal(client_id, report_id, client_name, mailing_address, property_name,
                      property_address, office_space_percentage, warehouse_space_percentage,
                      retail_space_percentage, other_space_percentage, property_representative_name):
    print(f"Received reportId: {report_id}")
    # Fetch the report data based on report_id

# Convert clientId and reportId to ObjectId
client_id = ObjectId(args.client_id)
report_id = ObjectId(args.report_id)

# Fetch data from MongoDB
print(f"Querying client collection with client_id: {client_id}")
client_data = client_collection.find_one({"_id": client_id})

print(f"Querying report collection with report_id: {report_id}")
report_data = report_collection.find_one({"_id": report_id})

if not client_data:
    print(f"No client data found for clientId: {client_id}")
    sys.exit(1)
if not report_data:
    print(f"No report data found for reportId: {report_id}")
    sys.exit(1)

print(f"Client ID: {args.client_id}")
print(f"Report ID: {args.report_id}")

# Load template
if not os.path.exists(TEMPLATE_FILE):
    print(f"Error: Template file not found at {TEMPLATE_FILE}")
    sys.exit(1)

# Open the template document
doc = Document(TEMPLATE_FILE)

# Placeholder replacements
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

# Loop through paragraphs and replace placeholders
for paragraph in doc.paragraphs:
    for placeholder, value in placeholders.items():
        if placeholder in paragraph.text:
            paragraph.text = paragraph.text.replace(placeholder, value)

# Save the document to a BytesIO buffer
# Save the document to a BytesIO buffer
buffer = BytesIO()
doc.save(buffer)
buffer.seek(0)

# Save the file to disk
output_filename = f"Proposal_{client_data.get('clientName', 'Unknown')}_{report_data.get('propertyName', 'Unknown')}.docx"
file_path = os.path.join(os.getenv('UPLOAD_FOLDER'), output_filename)
print(f"Generated file saved at: {file_path}")  # confirm correct path    

with open(file_path, 'wb') as f:
    f.write(buffer.getvalue())  # Make sure buffer content is properly written as Word doc

# Return the file path to the Node.js app
sys.stdout.write(file_path)

# Calling the function with arguments
generate_proposal(
    args.client_id,
    args.report_id,
    args.clientName,
    args.mailingAddress,
    args.propertyName,
    args.propertyAddress,
    args.officeSpacePercentage,
    args.warehouseSpacePercentage,
    args.retailSpacePercentage,
    args.otherSpacePercentage,
    args.propertyRepresentativeName
)
