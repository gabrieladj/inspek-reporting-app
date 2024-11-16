const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'done'], default: 'draft' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // New field referencing the Client model
  clientInfo: {
    clientName: { type: String, default: '' },
    companyName: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    mailingAddress: { type: String, default: '' },
    contactPerson: { type: String, default: '' },
    contactEmailAddress: { type: String, default: '' },
  },
  propertyInfo: {
    propertyName: { type: String, default: '' },
    propertyAddress: { type: String, default: '' },
    propertyType: { type: String, default: '' },
    yearBuilt: { type: Number, default: null },
    totalBuildingSqFt: { type: Number, default: null },
    totalBuildingHeight: { type: Number, default: null },
    numFloors: { type: Number, default: null },
  },
  inspectionScope: {
    typeOfInspection: { type: String, default: '' },
    specificAreasOfConcern: { type: String, default: '' },
    previousReportsAvailable: { type: Boolean, default: false },
    attachedCopies: { type: [String], default: [] },
  },
  inspectionDetails: {
    preferredDate: { type: Date, default: null },
    preferredTime: { type: String, default: '' },
    onSiteContact: { type: String, default: '' },
    onSitePhone: { type: String, default: '' },
    accessInstructions: { type: String, default: '' },
    limitations: { type: String, default: '' },
    parkingInfo: { type: String, default: '' },
    specialRequests: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
