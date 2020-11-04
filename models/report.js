const mongoose = require('mongoose');

const ReportSchema = mongoose.Schema({
    problem: String,
    description: String,
    explaination: String,
    useremail: String,
    errscreenshot: {
        type: String,
    },
    ticketsolution:String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Reports', ReportSchema);