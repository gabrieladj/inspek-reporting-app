const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Could be generated or derived
  description: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'done'], default: 'draft' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // Reference to the Client model

  propertyInfo: {
    propertyName: { type: String, required: true }, // Property Name
    propertyAddress: { type: String, required: true }, // Property Address
    propertyType: { type: String, default: '' }, // Property Type
    yearBuilt: { type: Number, default: null }, // Year Built
    totalBuildingSqFt: { type: Number, default: null }, // Total Building Square Footage
    numFloors: { type: Number, default: null }, // Number of Floors
  },

  inspectionScope: {
    typeOfInspection: { type: String, required: true }, // Type of Inspection
    droneImagery: { type: Boolean, default: false }, // Drone Imagery
    specificAreasOfConcern: { type: String, default: '' }, // Specific Areas of Concern
  },

  inspectionDetails: {
    preferredDate: { type: Date, default: null }, // Preferred Inspection Date
    preferredTime: { type: String, default: '' }, // Preferred Inspection Time
    alternateDate1: { type: Date, default: null }, // Alternate Preferred Date 1
    alternateDate2: { type: Date, default: null }, // Alternate Preferred Date 2
    alternateTime: { type: String, default: '' }, // Alternate Preferred Time
    specialRequests: { type: String, default: '' }, // Other Specific Concerns/Requests
  },

  buildingDetails: {
    recentMaintenance: { type: String, default: '' }, // Recent maintenance/repair work details
    ongoingIssues: { type: String, default: '' }, // Ongoing/recurring maintenance issues
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
    hazardousMaterials: { type: String, default: '' }, // Hazardous materials
    accessibilityIssues: { type: String, default: '' }, // Accessibility issues (e.g., ADA compliance)
    structuralModifications: { type: String, default: '' }, // Known structural modifications
    warranties: { type: String, default: '' }, // Outstanding warranties/guarantees
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
