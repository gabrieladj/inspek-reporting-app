import os
from urllib import request
from docx import Document
from datetime import datetime
from dotenv import load_dotenv
import sys
import json
import pymongo
from bson import ObjectId  # Import ObjectId from bson
import argparse

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug("Debug mode activated.")

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
client_collection = db["Client"]  # Use the correct collection name
report_collection = db["Report"]  # Use the correct collection name

# Parse arguments
parser = argparse.ArgumentParser(description="Generate a proposal document")
parser.add_argument("client_id", help="Client ID")
parser.add_argument("report_id", help="Report ID")
# Modify argparse to accept additional fields
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


def generate_proposal(client_id, report_id):
    report_id = args.report_id
    client_name = args.clientName
    mailing_address = args.mailingAddress
    property_name = args.propertyName
    property_address = args.propertyAddress
    office_space_percentage = args.officeSpacePercentage
    warehouse_space_percentage = args.warehouseSpacePercentage
    retail_space_percentage = args.retailSpacePercentage
    other_space_percentage = args.otherSpacePercentage
    property_representative_name = args.propertyRepresentativeName
    print(f"Received reportId: {report_id}")
    # Fetch the report data based on report_id


    # Validate IDs
    if not ObjectId.is_valid(client_id):
        print(f"Error: Invalid client_id: {client_id}")
        sys.exit(1)
    if not ObjectId.is_valid(report_id):
        print(f"Error: Invalid report_id: {report_id}")
        sys.exit(1)

    # Fetch data from MongoDB
    report_data = report_collection.find_one({"_id": ObjectId(report_id)})
    
    client_data = client_collection.find_one({"_id": ObjectId(client_id)})
    if client_data:
        logger.debug(f"Client Data: {client_data}")
    else:
        logger.error(f"Client data not found for client_id: {client_id}")

    
    if not client_data or not report_data:
        print("Error: Missing data for given clientId or reportId.")
        sys.exit(1)

    # Load template
    if not os.path.exists(TEMPLATE_FILE):
        print(f"Error: Template file not found at {TEMPLATE_FILE}")
        sys.exit(1)
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
    for placeholder, value in placeholders.items():
        for paragraph in doc.paragraphs:
            if placeholder in paragraph.text:
                for run in paragraph.runs:
                    run.text = run.text.replace(placeholder, value)

    logger.debug(f"Placeholders: {placeholders}")

    # Save output
    output_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f"Proposal_{client_data['clientName']}_{report_data['propertyName']}.docx")


    # Confirm saved file
    if os.path.exists(output_file):
        print(f"File saved successfully: {output_file}")
    else:
        print("Error: File did not save properly.")
