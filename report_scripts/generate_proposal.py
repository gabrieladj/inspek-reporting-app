import os
from docx import Document
from datetime import datetime
from dotenv import load_dotenv

import sys
import json

# Receive data from the Flask API
client_data = json.loads(sys.argv[1])  # Ensure correct parsing of input

# Load environment variables from the .env file
load_dotenv()

# Path to your proposal template
TEMPLATE_PATH = os.getenv('TEMPLATE_PATH')  # Read the template path from the .env file

# Check if TEMPLATE_PATH is set
if TEMPLATE_PATH is None:
    print("TEMPLATE_PATH environment variable is not set!")
else:
    print(f"TEMPLATE_PATH is set to: {TEMPLATE_PATH}")

# Receive data from the Flask API
try:
    client_data = json.loads(sys.argv[1])  # Ensure correct parsing of input
except json.JSONDecodeError as e:
    print(f"JSON Decode Error: {e}")
    sys.exit(1)  # Exit the script if there's an issue

# Normalize path separator and ensure proper path handling across platforms
TEMPLATE_FILE = os.path.join(os.getcwd(), TEMPLATE_PATH.replace('/', os.sep), 'proposal_template.docx')

def generate_proposal(client_data):
    """
    This function generates a proposal document by replacing placeholders in the Word template.
    
    :param client_data: A dictionary containing the client details.
    """

    # Check if the template exists
    if not os.path.exists(TEMPLATE_FILE):
        print(f"Template not found: {TEMPLATE_FILE}")
        return

    # Load the template
    doc = Document(TEMPLATE_FILE)
    print(f"Template loaded: {TEMPLATE_FILE}")

    # Define placeholders and their corresponding keys in client_data
    placeholders = {
        "{ClientName}": client_data["clientName"],
        "[Client's Company Name]": client_data["company_name"],
        "[Client's Address]": client_data["propertyAddress"],
        "[City, State, ZIP]": client_data["city_state_zip"],
        "[Date]": datetime.now().strftime("%B %d, %Y"),
        "[Property Address]": client_data["property_address"],
        "[Type of Building]": client_data["building_type"],
        "[Square Footage]": str(client_data["square_footage"]),
        "[Structural Characteristics]": client_data["structural_characteristics"],
        "[Unique Features]": client_data["unique_features"],
        "[HVAC & Electrical Units]": client_data["hvac_electrical"],
        "[Project Title]": client_data["project_title"],
    }

    # Debug: Print placeholders and their values
    print("Replacing the following placeholders:")
    for placeholder, value in placeholders.items():
        print(f"{placeholder} -> {value}")

    # Replace placeholders in the document
    for paragraph in doc.paragraphs:
        for placeholder, value in placeholders.items():
            if placeholder in paragraph.text:
                for run in paragraph.runs:
                    if placeholder in run.text:
                        print(f"Replacing '{placeholder}' with '{value}'")
                        run.text = run.text.replace(placeholder, value)

    # Save the updated document
    output_file = os.path.join(TEMPLATE_PATH, f"Proposal_{client_data['client_name']}.docx")
    doc.save(output_file)
    print(f"Proposal generated and saved as {output_file}")
    return output_file


if __name__ == "__main__":
    # Example client data
    client_data = {
        "client_name": "Tori Lynn",
        "company_name": "Lynn Enterprises",
        "address": "789 Market St",
        "city_state_zip": "Los Angeles, CA 90001",
        "property_address": "101 Business Ave",
        "building_type": "Steel Frame",
        "square_footage": 15000,
        "structural_characteristics": "Steel frame structure with reinforced concrete floors",
        "unique_features": "Eco-friendly design, solar panels installed",
        "hvac_electrical": "Central HVAC system, electrical system up to code",
        "project_title": "Building Inspection Proposal"
    }
    
    generate_proposal(client_data)
