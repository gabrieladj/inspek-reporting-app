const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Could be generated or derived
  description: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'done'], default: 'draft' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // Reference to the Client model

  propertyInfo: {
    propertyName: { type: String, required: false }, // Property Name
    propertyAddress: { type: String, required: false }, // Property Address
    propertyType: { type: String, default: '' }, // Property Type
    yearBuilt: { type: Number, default: null }, // Year Built
    totalBuildingSqFt: { type: Number, default: null }, // Total Building Square Footage
    numFloors: { type: Number, default: null }, // Number of Floors
  },

  inspectionScope: {
    typeOfInspection: { type: String, required: false }, // Type of Inspection
    droneImagery: { type: Boolean, required: false  }, // Drone Imagery
    specificAreasOfConcern: { type: String, default: '' }, // Specific Areas of Concern
  },

  inspectionDetails: {
    preferredDate: { type: Date, default: null }, // Preferred Inspection Date
    preferredTime: { type: String, default: '' }, // Preferred Inspection Time
    alternateDate: { type: Date, default: null }, // Alternate Preferred Date 1
    alternateTime: { type: String, default: '' }, // Alternate Preferred Time
    additionalInfo: { type: String, default: '' }, // Other Specific Concerns/Requests
  },

  buildingDetails: {
    recentMaintenance: { type: String, default: '' }, // Recent maintenance/repair work details
    ongoingIssues: { type: String, default: '' }, // Ongoing/recurring maintenance issues
    // New fields:
    additionalSpaces: { type: String, default: '' }, // Set as optional
    officeSpacePercentage: { type: Number, default: null },
    warehouseSpacePercentage: { type: Number, default: null },
    retailSpacePercentage: { type: Number, default: null },
    manufacturingSpacePercentage: { type: Number, default: null },
    otherSpacePercentage: { type: Number, default: null },
    
    waterIntrusion: { type: String, default: '' }, // Water intrusion or leaks
    structuralIssues: { type: String, default: '' }, // Structural defects or damages
    plannedWork: { type: String, default: '' }, // Planned/ongoing work
    hvacDetails: { type: String, default: '' }, // HVAC system details
    specializedSystems: { type: String, default: '' }, // Specialized systems/equipment
    utilityIssues: { type: String, default: '' }, // Issues with electrical/plumbing/utilities
    environmentalAssessments: { type: String, default: '' }, // Environmental assessments/testing
    environmentalConcerns: { type: String, default: '' }, // Environmental concerns
    codeViolations: { type: String, default: '' }, // Open code violations
    previousInspections: { type: String, default: '' }, // Details of previous inspections
    insuranceClaims: { type: String, default: '' }, // Previous insurance claims
    
    pestInfestations: { type: String, default: '' }, // Known pest infestations
    specialAttention: { type: String, default: ''},
    hazardousMaterials: { type: String, default: '' }, // Hazardous materials
    recentConstruction: {type: String, default: ''},
    accessibilityIssues: { type: String, default: '' }, // Accessibility issues (e.g., ADA compliance)
    structuralModifications: { type: String, default: '' }, // Known structural modifications
    warranties: { type: String, default: '' }, // Outstanding warranties/guarantees
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
