const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

//Admin schema
const admin_model = new Schema({
    adminUsername : {
        type : String
    },
    adminPassword:{
        type: String
    }
})

//Student Schema
const student_model = new Schema({
    studentId: {
        type: Number,
        unique: true
    },
    studentPassword: {
        type: String
    },
    fullName : {
        type : String
    },
    email: {
        type: String
    },
    programme : {
        type : String
    },
    ratingReceived : {
        type : Number
    },
    accumulatedRating : {
        type : Number
    },
    status : {
        type : Boolean
    },
    imgUrl : {
        type : String
    }
})

//Activity Schema
const activity_model = new Schema({
    activityId : {
        type: Number
    },
    activityName: {
        type: String
    },
    activityDescription : {
        type: String
    },
    hostId: {
        type: Number
    },
    startDateTime: {
        type: Date
    },
    endDateTime: {
        type: Date
    },
    activityType: {
        type: String
    },
    activityStatus: {
        type: String
    },
    currentMember: {
        type: Number
    },
    maxMember:{
        type: Number
    }
})

//Activity Student Schema
const activity_student_model = new Schema({
    activityId : {
        type : Number
    },
    studentId : {
        type: Number
    },
    isRated : {
        type : Boolean
    }
})

//Test Activity Scehema
const test_activity_model = new Schema({
    startDateTime : {
        type : Date
    },
    endDateTime : {
        type: Date
    }
})

const Admin = mongoose.model('admin', admin_model);
const Student = mongoose.model('student', student_model);
const TestActivity = mongoose.model('testactivity', test_activity_model );
const Activity = mongoose.model('activity', activity_model);
const ActivityStudent = mongoose.model('activityStudent', activity_student_model)

module.exports = {
    Admin,
    Student,
    TestActivity,
    Activity,
    ActivityStudent
}