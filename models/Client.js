const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  clientName: { type: String, required: true }, // Company/Client Name
  propertyRepresentativeName: { type: String, required: true }, // Name of Property Representative
  propertyRepresentativePhone: { type: String, required: true }, // Property Representative Phone Number
  propertyRepresentativeEmail: { type: String, required: true }, // Property Representative Email Address
  mailingAddress: { type: String, required: true }, // Mailing Address
  roleOrRelationship: { type: String, required: true }, // Role/Relationship to the Property
  onSiteContactName: { type: String, required: false }, // On-Site Contact Name
  onSiteContactPhone: { type: String, required: false }, // On-Site Contact Phone Number
  onSiteContactEmail: { type: String, required: false }, // On-Site Contact Email Address
});

module.exports = mongoose.model('Client', ClientSchema);
