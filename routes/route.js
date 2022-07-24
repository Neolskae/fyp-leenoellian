const routes = require('express').Router();
const controller = require('../controller/controller.js');
const model = require('../models/model.js');
const express = require('express');
const app = express();

//use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes.get('/api/students', controller.get_all_student) //--Retrieve All Students   1

routes.get('/api/student/:studentId', controller.get_one_student) //--Get one Student   2

routes.post('/api/admin/auth', controller.admin_auth)  //--Authenticate Admin   3

routes.post('/api/student/auth', controller.student_auth) //--Authenticate Student   4

routes.post('/api/admin', controller.post_admin) //--Create Admin    5

routes.post('/api/student', controller.post_student)  //--Create Student   6

routes.post('/api/student/:studentId', controller.update_one_student)  //--Create Student   7

routes.get('/api/viewStudent/:studentId', controller.get_all_student_with_studentId)  //--Retrieve Students based on Student Id    8

routes.delete('/api/viewStudent/:studentId', controller.delete_one_student)  //--Delete Students based on Student Id    9

routes.post('/api/createActivity/', controller.create_activity)  //--Create Activity   10

routes.post('/api/getActivity/', controller.get_activity)  //--Get Activity by Filters  11

routes.get('/api/getActivityDetails/:activityId', controller.get_activity_details)  //--Get Activity Details  12

routes.get('/api/getMemberList/:activityId', controller.get_member_list)  //--Get Member List  13

routes.post('/api/joinActivity/', controller.post_join_activity)  //--Join an activity  14

routes.post('/api/getActivityDashboard/', controller.get_activity_dashboard)  //--Get activity for activity Dashboard  15

routes.post('/api/cancelActivity/', controller.cancel_activity) //-- Host Cancel an activity  16

routes.post('/api/removeMember/', controller.remove_member) //-- Remove Member from activity  17

routes.post('/api/confirmActivity/', controller.confirm_activity) //-- Confirm an activity  18

routes.post('/api/completeActivity/', controller.complete_activity) //-- Change activity status to Completed  19

routes.post('/api/submitRating/:studentId', controller.submit_rating) //--Submit Rating  20

routes.post('/api/checkIsRated', controller.check_isRated) //--Check is Rated  21

routes.post('/api/unjoinActivity', controller.unjoin_activity) //--Student Unjoin activity  22

routes.get('/api/getActivityHistory/:studentId', controller.get_activity_history) // --Get Activity History for Chart  23

module.exports = routes;
