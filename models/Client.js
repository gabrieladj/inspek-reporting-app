const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  clientName: { type: String, required: true }, // Company/Client Name
  propertyRepresentativeName: { type: String, required: true }, // Name of Property Representative
  propertyRepresentativePhone: { type: String, required: true }, // Property Representative Phone Number
  propertyRepresentativeEmail: { type: String, required: true }, // Property Representative Email Address
  mailingAddress: { type: String, required: true }, // Mailing Address
  roleOrRelationship: { type: String, required: true }, // Role/Relationship to the Property
  onSiteContactName: { type: String, required: true }, // On-Site Contact Name
  onSiteContactPhone: { type: String, required: true }, // On-Site Contact Phone Number
  onSiteContactEmail: { type: String, required: false }, // On-Site Contact Email Address (optional)
  propertyAddress: { type: String, required: true }, // Property Address (required)
  clientSignature: { type: String, required: false }, // Default to not required

  preferredInspectionDate: { type: Date }, // Not required
  droneImagery: { type: Boolean }, // Not required
  typeOfInspection: { type: String }, // Not required
  numberOfFloors: { type: Number }, // Not required
});

// Custom validation for the signature
ClientSchema.pre('save', function (next) {
  if (this.isNew && !this.clientSignature) {
    return next(new Error('Signature is required when creating a new client via the web app.'));
  }
  next();
});

module.exports = mongoose.model('Client', ClientSchema);
