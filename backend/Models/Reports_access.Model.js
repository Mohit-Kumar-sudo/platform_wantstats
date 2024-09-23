const mongoose = require("mongoose");
const {Schema} = mongoose;

const ReportAccessSchema = new Schema(
  {
    reportIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "reports" }],
      ref: "reports"
    },
    charts:{
      type:[{type:Object}],
      ref:"charts"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const ReportAccess = mongoose.model("report_access", ReportAccessSchema);

module.exports = ReportAccess;