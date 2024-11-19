const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;
// import schemas
const reportModel = require('./Reports.Model')
const DATA_CONSTANTS = require('../config/dataConstants')

// Market Estimation schema
const MarketEstimationSchema = new Schema(
{
    base_year: {
        type: Number,
        required: [true, 'Base Year is required'],
        trim: true,
    },
    start_year: {
        type: Number,
        required: [true, 'Start Year is required'],
        trim: true,
    },
    end_year: {
        type: Number,
        required: [true, 'End Year is required'],
        trim: true,
    },
    segment: [{
        _id:false,
        name: {
            type: SchemaTypes.String,
            required: [true, 'Segment name is required'],
            trim: true
        },
        id : {
            type: SchemaTypes.String,
            required: [true, 'Segment Identifier (#) is required'],
            trim: true
        },
        pid : {
            type: SchemaTypes.String,
        }
    }],
    geo_segment: [{
      // _id: false,
      region: SchemaTypes.String,
      _id: SchemaTypes.String,
      id: SchemaTypes.String,
      countries: [{
        type: SchemaTypes.Mixed,
        trim: true
      }]
    }],
    bifurcationLevel:{
      type:Number,
      default: 1
    },
    data : {
        type: SchemaTypes.Mixed,
    },
    dataMetrics : {
        type: SchemaTypes.String,
        enum: Object.values(DATA_CONSTANTS.REPORT_DATA_UNIT),
        default: DATA_CONSTANTS.REPORT_DATA_UNIT.VALUE
    },
    status: {
        type: SchemaTypes.String,
        enum: Object.values(DATA_CONSTANTS.MODULES_STATUS),
        default: DATA_CONSTANTS.MODULES_STATUS.NOT_STARTED
    },
    analysts: {
        type: Schema.Types.ObjectId,
        //required: [true, 'Analysts details are required'],
        trim: true,
        ref: 'users'
    }
},
{
    timestamps: true,
}
);


module.exports = mongoose.model('me', MarketEstimationSchema);

const getMEGridDataForViews = async function (reportId, gridKeys) {

    // query
    const meGridViewData = await reportModel.Reports.aggregate([
        {
            "$match":{
                    "_id":mongoose.Types.ObjectId(reportId)
            }
        },
        {
                "$unwind":"$me.data"
        },
        {
            "$match": {
                "me.data.key": { "$in": gridKeys }
            }
        },
        {
            "$group":{
                "_id":"null",
                "gridData": {
                    "$addToSet":"$me.data"
                }
            }
        }
    ]);

    return meGridViewData;
}

const getMEViewsSegmentData = async function (reportId, value ) {
    // query to return only matching segments to passed segmentId
    const queryRes = await reportModel.Reports.aggregate([
        // I. find the relevant documents in the collection
        // uses index, if defined on me.segment.pid/id
        {
            $match:{
                "$and":[
                    {
                    "_id":mongoose.Types.ObjectId(reportId)
                    },
                    {
                    "me.segment":{
                        $elemMatch:{
                            "$or":[
                                {
                                    "pid": value
                                },
                                {
                                    "id": value
                                }
                            ]
                        }
                    }
                    },

                ]
            }
        },
        // II. flatten array documennts
        {
            $unwind:"$me.segment"
        },
        // III. match for elements, "me.segment" is no longer an array
        {
            $match:{
                "$or":[
                    {
                        "me.segment.pid": value
                    },
                    {
                        "me.segment.id": value
                    }
                ]
            }
        },
        {
            $sort: {
                "me.segment.pid": -1
            }
        },
        // IV. re-create me.segment array
        {
            $group:{
                _id:"$_id",
                viewRecords:{
                    $addToSet:"$me.segment"
                }
            }
        }
    ]);

    return queryRes;
}

const getMEViewsRegionData = async function (reportId, regionId) {
    const aggArr = [];
    aggArr.push({
        $match:{
                "_id":mongoose.Types.ObjectId(reportId)
        }
    });
    aggArr.push({
        $unwind:"$me.geo_segment"
    });
    if (regionId !== "-1")
        aggArr.push({
            $match:
            {
                "me.geo_segment._id": {"$in": [`${regionId}`]}
            }
        });
    aggArr.push({
        $project:{
            "geo": "$me.geo_segment"
        }
    });
    aggArr.push({
        $unwind: "$geo.countries"
    });
    aggArr.push({
        $group :{
            "_id": "geo",
            "regions": {
                "$addToSet": {"name": "$geo.region", "regionId": "$geo._id"}
            },
            "countries": {
                "$addToSet": {"region": "$geo.region", "country": "$geo.countries.name", "regionId": "$geo._id", "countryId": "$geo.countries._id"}
            }
        }
    });
    const queryPromise = reportModel.Reports.aggregate(aggArr);
    return queryPromise;
}

const getMEViewsWithoutRegionData = async function (reportId) {
  const aggArr = [];
  aggArr.push({
      $match:{
              "_id":mongoose.Types.ObjectId(reportId)
      }
  });
  aggArr.push({
      $unwind:"$me.geo_segment"
  });
  aggArr.push({
      $project:{
          "geo": "$me.geo_segment"
      }
  });
  aggArr.push({
      $unwind: "$geo.countries"
  });
  aggArr.push({
      $group :{
          "_id": "geo",
          "regions": {
              "$addToSet": {"name": "$geo.region"}
          },
          "countries": {
              "$addToSet": {"region": "$geo.region", "country": "$geo.countries.name", "countryId": "$geo.countries._id"}
          }
      }
  });
  const queryPromise = reportModel.Reports.aggregate(aggArr);
  return queryPromise;
}

// Exporting model to external world
module.exports = {
    getMEViewsSegmentData,
    getMEViewsWithoutRegionData,
    getMEViewsRegionData,
    getMEGridDataForViews,
};
