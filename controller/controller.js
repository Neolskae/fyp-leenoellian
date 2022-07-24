const model = require('../models/model.js');
const express = require('express');
const app = express();

//GET STUDENT http://localhost:3001/api/student   --Retrieve Students
async function get_all_student(req, res) {
    //res.sendFile(__dirname + '\\1655600151130-Lee Noel Lian2.jpg');
    model.Student.find()
        .then(students => res.json(students))
        .catch(err => res.status(400).json('Error: ' + err))

}

//POST http://localhost:3001/api/admin/auth  --Authenticate Admin
async function admin_auth(req, res) {
    if (!req.body) console.log('request body not found');

    console.log("running /api/admin/auth");
    console.log("req.body --> ", req.body)
    console.log("req.body.username", req.body.adminUsername)
    console.log("req.body.password", req.body.adminPassword)

    await model.Admin.find({ "adminUsername": req.body.adminUsername, "adminPassword": req.body.adminPassword })
        .then((result) => {
            if (result.length === 0) {
                console.log("result is", result)
                console.log("admin not found")
                res.send(false)
            } else {
                console.log("result is", result)
                console.log("admin found")
                res.send(true)
            }

        })
        .catch((error) => {
            console.log("error-->", error);
        })
}

//POST http://localhost:3001/api/student/auth   --Authenticate Student
async function student_auth(req, res) {
    if (!req.body) console.log('request body not found');

    console.log("running /api/student/auth");
    console.log("req.body --> ", req.body)
    console.log("req.body.studentId", req.body.studentId)
    console.log("req.body.studentPassword", req.body.studentPassword)

    await model.Student.find({ "studentId": req.body.studentId, "password": req.body.studentPassword, "status" : true})
        .then((result) => {
            if (result.length === 0) {
                console.log("result is", result)
                console.log("student not found")
                res.send(false)
            } else {
                console.log("result is", result)
                console.log("student found")
                res.send(true)
            }

        })
        .catch((error) => {
            console.log("error-->", error);
        })
}

//POST http://localhost:3001/api/admin    --Create Admin
async function post_admin(req, res) {
    let { adminUsername, adminPassword } = req.body;

    const create = await new model.Admin({
        adminUsername,
        adminPassword
    });

    create.save(function (err) {
        if (!err) return res.json(create);
        return res.status(400).json({ message: `Error while creating transaction ${err}` })
    })
}

//POST http://localhost:3001/api/student    --Create Student
async function post_student(req, res) {
    console.log("req.body in post_student is-->", req.body)
    let { studentId, studentPassword, fullName, email, programme, imgUrl } = req.body;

    const create = await new model.Student({
        studentId,
        studentPassword,
        fullName,
        email,
        programme,
        ratingReceived: 0,
        accumulatedRating: 0,
        status: true,
        imgUrl
    });

    create.save(function (err) {
        if (!err) {
            return res.send(true)
        }
        return res.send(err);
    })
}

//GET http://localhost:3001/api/student/:studentId    --Get one Student
async function get_one_student(req, res) {
    //console.log("req.params in  get_one_student is-->", req.params)

    await model.Student.find({ "studentId": req.params.studentId })
        .then((result) => {
            if (result.length === 0) {
                //console.log("student not found")
                //console.log("result is", result)
                res.send(false)
            } else {
                //console.log("student found")
                //console.log("result is", result)
                res.send(result)
            }

        })
        .catch((error) => {
            console.log("error-->", error);
        })

}

//GET STUDENT http://localhost:3001/api/student/:studentId   --Retrieve Students based on Student Id
async function get_all_student_with_studentId(req, res) {
    console.log("req.params in  get_all_student_with_studentId -->", req.params)
    studentId = req.params.studentId;
    console.log("studentId-->", studentId)
    console.log("typeof studentId-->", typeof studentId)

    //studentId = parseInt(studentId)

    function filterByStudentId(student){
        if (student.studentId.toString().includes(studentId)===true){
            return true
        }else {
            return false;
        }
    }

    let finalResult = null;

    model.Student.find(/*{studentId}*/)
        .then(students => {
            console.log("\n\n\n\n\n")
            console.log(students)
            finalResult = students.filter(filterByStudentId);
            console.log(finalResult)
            res.json(finalResult)
        })
        .catch(err => res.status(400).json('Error: ' + err))

}

//POST http://localhost:3001/api/student/:studentId   --Update one student
async function update_one_student(req, res) {
    console.log("req.params in  update_one_student is-->", req.params)
    console.log("req.body in  update_one_student is-->", req.body)

    let { studentId, studentPassword, fullName, email, programme, status, imgUrl } = req.body;
    //studentIdParams = req.params.studentId.toString();

    model.Student.updateOne({ studentId: studentId },
        { studentPassword, fullName, email, programme, status, imgUrl }, function (err) {
            if (!err) {
                return res.send(true)
            }
            return res.send(err);
        }
    );
}

//DELETE http://localhost:3001/api/viewStudent/:studentId   --Delete one student
async function delete_one_student(req, res) {
    console.log("req.params in delete_one_student is-->", req.params)

    let studentId = req.params.studentId

    model.Student.findOneAndDelete({ studentId: studentId }, function (err) {
        if (!err) {
            return res.send(true)
        }
        return res.send(err);
    });
}

//POST http://localhost:3001/api/activity --Create Activity 
async function create_activity(req, res) {
    console.log("req.body in create_activity is-->", req.body)

    let activityIdVariable = Date.now()

    console.log("1-->",activityIdVariable)
    let { activityName, activityDescription, startDateTime, endDateTime, activityType, maxMember, studentId} = req.body;

    const create = await new model.Activity({
        activityId : activityIdVariable ,activityName, activityDescription, hostId : studentId, startDateTime, endDateTime, activityType, activityStatus : 'Published', currentMember : 1, maxMember
    })
    console.log("2-->", activityIdVariable)
    create.save(async function (err) {
        if (!err) {
            const create2 = await new model.ActivityStudent({
                activityId : activityIdVariable,
                studentId,
                isRated : false
            })

            create2.save(function (err) {
                if (!err) {
                    return res.send(true)
                } else{
                    return res.send(err);
                }
            })
        } else{
            return res.send(err);
        }
    })    
}

//GET http://localhost:3001/api/activity/byActivityType --Get Activity based on Filter {Activity Type}
async function get_activity(req, res) {
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("req.body in get_activity_byActivityType--> ", req.body)

    let sport = null;
    let study = null;
    let hangout = null;
    let other = null;
    let rsd = null;
    let rba = null;
    let raf = null;
    let dac = null;
    let dbf = null;
    let dba = null;
    let dma = null;
    let dit = null;
    let dse = null;
    let dhm = null;
    let rating = null;
    
    let {
        hostnameFilter,
        sportFilter,
        studyFilter,
        hangoutFilter,
        otherFilter,
        rsdFilter,
        rbaFilter,
        rafFilter,
        dacFilter,
        dbfFilter,
        dbaFilter,
        dmaFilter,
        ditFilter,
        dseFilter,
        dhmFilter,
        fiveStarFilter,
        fourStarFilter,
        threeStarFilter,
        twoStarFilter,
        oneStarFilter
    } = req.body;

    //If rating is not chosen, set rating to 0 (Which means 0 star and up)
    if((fiveStarFilter || fourStarFilter || threeStarFilter || twoStarFilter || oneStarFilter) === false ){
        rating = 0;
    }else if(fiveStarFilter===true){
        rating = 5;
    }else if(fourStarFilter===true){
        rating = 4;
    }else if(threeStarFilter===true){
        rating = 3;
    }else if(twoStarFilter===true){
        rating = 2;
    }else if(oneStarFilter===true){
        rating = 1;
    }

    //If all false, then switch all to true. Else, switch certain criteria to true
    if ((sportFilter ||
        studyFilter ||
        hangoutFilter ||
        otherFilter ||
        rsdFilter ||
        rbaFilter ||
        rafFilter ||
        dacFilter ||
        dbfFilter ||
        dbaFilter ||
        dmaFilter ||
        ditFilter || 
        dseFilter || 
        dhmFilter
        ) === false){
            sportFilter = true;
            studyFilter = true;
            hangoutFilter = true;
            otherFilter = true;
            rsdFilter = true;
            rbaFilter = true;
            rafFilter = true;
            dacFilter = true;
            dbfFilter = true;
            dbaFilter = true;
            dmaFilter = true;
            ditFilter = true;
            dseFilter = true;
            dhmFilter = true;
        }else{
            if (sportFilter === true) {
                sport = 'Sport'
            }
            if (studyFilter === true) {
                study = 'Study'
            }
            if (hangoutFilter === true) {
                hangout = 'Hangout'
            }
            if (otherFilter === true) {
                other = 'Other'
            }
            if (rsdFilter === true) {
                rsd = 'RSD'
            }
            if (rbaFilter === true) {
                rba = 'RBA'
            }
            if (rafFilter === true) {
                raf = 'RAF'
            }
            if (dacFilter === true) {
                dac = 'DAC'
            }
            if (dbfFilter === true) {
                dbf = 'DBF'
            }
            if (dbaFilter === true) {
                dba = 'DBA'
            }
            if (dmaFilter === true) {
                dma = 'DMA'
            }
            if (ditFilter === true) {
                dit = 'DIT'
            }
            if (dseFilter === true) {
                dse = 'DSE'
            }
            if (dhmFilter === true) {
                dhm = 'DHM'
            }
            
        }

    function filterByActivityType(activity) {
        if ((sportFilter || studyFilter || hangoutFilter || otherFilter)===false){
            return true;
        }else{
            if (activity.activityType === sport) {
                return true
            } else if (activity.activityType === study) {
                return true
            } else if (activity.activityType === hangout) {
                return true
            } else if (activity.activityType === other) {
                return true
            } else {
                return false
            }
        }
    }

    function filterByProgramme(activity){
        if ((rsdFilter || rbaFilter || rafFilter || dacFilter || dbfFilter || dbaFilter || dmaFilter || ditFilter || dseFilter || dhmFilter)===false){
                return true
        }else{
            if (activity.hostInfo.programme === rsd) {
                return true
            } else if (activity.hostInfo.programme === rba) {
                return true
            } else if (activity.hostInfo.programme === raf) {
                return true
            } else if (activity.hostInfo.programme === dac) {
                return true
            } else if (activity.hostInfo.programme === dbf) {
                return true
            } else if (activity.hostInfo.programme === dba) {
                return true
            } else if (activity.hostInfo.programme === dma) {
                return true
            } else if (activity.hostInfo.programme === dit) {
                return true
            } else if (activity.hostInfo.programme === dse) {
                return true
            } else if (activity.hostInfo.programme === dhm) {
                return true
            }
            else {
                return false
            }
        }
    }

    function filterByHostname(activity){
        if ((activity.hostInfo.fullName.toLowerCase().includes(hostnameFilter.toLowerCase()))===true){
            return true
        }else{
            return false
        }
    }

    function filterByRating(activity) {
        if(rating===0){
            return true
        } else if (rating === 5){
            return ((activity.hostInfo.accumulatedRating / activity.hostInfo.ratingReceived) === 5)
        } else if (rating === 4) {
            return ((activity.hostInfo.accumulatedRating / activity.hostInfo.ratingReceived) >= 4)
        } else if (rating === 3) {
            return ((activity.hostInfo.accumulatedRating / activity.hostInfo.ratingReceived) >= 3)
        }else if (rating === 2) {
            return ((activity.hostInfo.accumulatedRating / activity.hostInfo.ratingReceived) >= 2)
        } else if (rating === 1) {
            return ((activity.hostInfo.accumulatedRating / activity.hostInfo.ratingReceived) >= 1)
        }
        else{
            return false
        }
    }

    function filterByActivityStatusPublished(activity){
        if(activity.activityStatus === 'Published'){
            return true
        }else {
            return false;
        }
    }
    
    function checkStudentActive(activity){
        if (activity.hostInfo.status === true) {
            return activity
        }
    }

    let finalResult = null;
    if ((sportFilter && studyFilter && hangoutFilter && otherFilter && rsdFilter && rbaFilter && rafFilter && dacFilter && dbfFilter && dbaFilter && dmaFilter && ditFilter && dseFilter && dhmFilter) === true) {
        console.log("Running if Statement in get_activity")
        // model.Activity.find()
        //     .then(testActivity => res.json(testActivity))
        //     .catch(err => res.status(400).json('Error: ' + err))

        model.Activity.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: 'hostId',
                    foreignField: 'studentId',
                    as: 'hostInfo'
                }
            }
            ,
            {
                $unwind: '$hostInfo'
            }
        ]).then(result => {
            finalResult = result.filter(checkStudentActive)
            finalResult = finalResult.filter(filterByRating)
            finalResult = finalResult.filter(filterByHostname)
            finalResult = finalResult.filter(filterByActivityStatusPublished)
            res.json(finalResult);
        }).catch(error => {
            res.status(400).json("Lookup Collection Error");
        })

    } else {
        console.log("Running else Statement in get_activity")

        model.Activity.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: 'hostId',
                    foreignField: 'studentId',
                    as: 'hostInfo'
                }
            }
            ,
            {
                $unwind: '$hostInfo'
            }
        ]).then(result => { 
            finalResult = result.filter(filterByActivityType) 
            finalResult = finalResult.filter(filterByProgramme) 
            finalResult = finalResult.filter(checkStudentActive)
            finalResult = finalResult.filter(filterByRating)       
            finalResult = finalResult.filter(filterByHostname)
            finalResult = finalResult.filter(filterByActivityStatusPublished)
            res.json(finalResult);
        }).catch(error => {
            res.status(400).json("Lookup Collection Error");
        })
    }
}

//GET  http://localhost:3001/api/getActivityDetails/:activityId  --Get Activity Details
async function get_activity_details(req,res){
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("req.params in get_activity_details--> ", req.params)

    function filterByActivityId(activity) {
        if (activity.activityId==req.params.activityId) {
            return true;
        } else {
            return false;
        }
    }
    let finalResult = null;
    model.Activity.aggregate([
        {
            $lookup: {
                from: "students",
                localField: 'hostId',
                foreignField: 'studentId',
                as: 'hostInfo'
            }
        }
        ,
        {
            $unwind: '$hostInfo'
        }
    ]).then(result => {
        finalResult = result.filter(filterByActivityId)
        res.json(finalResult);
    }).catch(error => {
        res.status(400).json("Lookup Collection Error");
    })
}

//GET  http://localhost:3001/api/getMemberList/:activityId  --Get Member List
async function get_member_list(req, res) {
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("req.params in get_member_list--> ", req.params)

    function filterByActivityId(activity) {
        if (activity.activityId == req.params.activityId) {
            return true;
        } else {
            return false;
        }
    }

    model.ActivityStudent.aggregate([
        {
            $lookup: {
                from: "students",
                localField: 'studentId',
                foreignField: 'studentId',
                as: 'memberInfo'
            }
        }
        ,
        {
            $unwind: '$memberInfo'
        }
    ]).then(result => {
        finalResult = result.filter(filterByActivityId)
        res.json(finalResult);
    }).catch(error => {
        res.status(400).json("Lookup Collection Error");
    })

    /*
        model.Activity.aggregate([
        {
            $lookup: {
                from: "students",
                localField: 'hostId',
                foreignField: 'studentId',
                as: 'hostInfo'
            }
        }
        ,
        {
            $unwind: '$hostInfo'
        }
    ]).then(result => {
        finalResult = result.filter(filterByActivityId)
        res.json(finalResult);
    }).catch(error => {
        res.status(400).json("Lookup Collection Error");
    })
    */
    
}

//POST  http://localhost:3001/api/joinActivity  --Join activity
async function post_join_activity(req, res) {
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("req.body in post_join_activity--> ", req.body)
    let { activityId, studentId } = req.body;
    
    model.ActivityStudent.countDocuments({ activityId, studentId }, async function(err, count){
        if(count>0){
            console.log("running if")
            res.send(false)
        }else{
            console.log("running else")
            checkMaxMember();
        }
    })

    let currentMember = null;
    let maxMember = null

    const checkMaxMember = async () => {
        console.log("running checkMaxMember")
        model.Activity.find({ activityId })
            .then(activity =>{
                console.log("res is------>", activity)
                console.log("activity[0].currentMember",activity[0].currentMember)

                if(activity[0].currentMember!==activity[0].maxMember){
                    console.log("Running if 9000")
                    currentMember = activity[0].currentMember
                    maxMember = activity[0].maxMember
                    console.log("currentMember assigned is -->", currentMember)
                    addCurrentMember();
                }else{
                    console.log("Running else 9000");
                    res.send(false);
                    console.log("Hello???")
                }
            }).catch(err => 
                res.status(400).json('Error: ' + err)
            )
    }

    const addCurrentMember = async () => {
        console.log("Running addCurrentMember")
        await model.Activity.updateOne({activityId}, {currentMember : currentMember + 1});
        console.log("currentMember + 1 is--->", currentMember + 1)
        if (currentMember + 1 === maxMember){
            updateToPending();
        }else{
            createActivityStudent();
        }
        
        console.log("Finish Running addCurrentMember")
    }

    const updateToPending = async () => {
        console.log("------updateToPending1------")
        await model.Activity.updateOne({ activityId }, { activityStatus: 'Pending' });     
        console.log("------updateToPending2------")
        createActivityStudent();
    }

    const createActivityStudent = async() => {
        console.log("Running createActivityStudent")
        const create = await new model.ActivityStudent({
                activityId, studentId, isRated : false
            })
            create.save(function (err) {
                if (err) {
                    return res.send(err); 
                } else{
                    res.send(true);
                }
            })
        console.log("Finish Running createActivityStudent")
    }
}

//POST  http://localhost:3001/api/getActivityDashboard/  --Get activity for activity Dashboard
async function get_activity_dashboard(req, res) {
    console.log('');
    console.log('');
    console.log('');
    console.log('req.body in get_activity_dashboard is--->', req.body);
    console.log("typeof req.body.studentId-->",typeof req.body.studentId)

    let { studentId, hostByYouFilter, hostByOtherFilter, publishedFilter, pendingFilter, confirmedFilter, completedFilter, cancelledFilter } = req.body

    if (hostByYouFilter===true){
        if(publishedFilter===true){
            findActivityHostByYou('Published');
        } else if (pendingFilter===true){
            findActivityHostByYou('Pending');
        } else if (confirmedFilter===true){
            findActivityHostByYou('Confirmed');
        } else if (completedFilter===true){
            findActivityHostByYou('Completed');
        }else{
            findActivityHostByYou('Cancelled');
        }
    }else{
        console.log('RUNNING ELSE')
        if (publishedFilter === true) {
            findActivityHostByOthers('Published')
        } else if (pendingFilter === true){
            findActivityHostByOthers('Pending')
        } else if (confirmedFilter === true){
            findActivityHostByOthers('Confirmed')
        } else if (completedFilter === true) {
            findActivityHostByOthers('Completed')
        }else{
            findActivityHostByOthers('Cancelled')
        }
    }

    function findActivityHostByYou(activityStatus) { //FIND ACTIVITY HOST BY YOU
        console.log("activityStatus-->", activityStatus)
        
        function filterByActivityStatus(activity) {
            if (activity.activityStatus === activityStatus) {
                return true;
            } else {
                return false;
            }
        }

        function filterByHostId(activity) {
            if (parseInt(activity.hostId) === parseInt(studentId)) {
                return true;
            } else {
                return false;
            }
        }

        model.Activity.aggregate([
            {
                $lookup: { from: "students", localField: 'hostId', foreignField: 'studentId', as: 'hostInfo' }
            }
            ,
            {
                $unwind: '$hostInfo'
            }
        ]).then(result => {
            
            finalResult = result.filter(filterByActivityStatus);
            finalResult = finalResult.filter(filterByHostId);
            console.log("finalResult-->", finalResult)
            res.json(finalResult)
            //res.json(result)
        }).catch(error => {
            res.status(400).json("Lookup Collection Error");
        })
    }

    function findActivityHostByOthers(activityStatus) { //FIND ACTIVITY HOST BY OTHERS
        console.log("activityStatus--->",activityStatus)

        function filterByActivityStatus(activity) {
            if (activity.activityStatus === activityStatus) {
                return true;
            } else {
                return false;
            }
        }

        function filterByStudentId(activity) {
            if (parseInt(activity.activityStudentInfo.studentId) === parseInt(studentId)) {
                return true;
            } else {
                return false;
            }
        }

        function filterOutStudentHost(activity){
            if (parseInt(activity.hostId) === parseInt(studentId)){
                return false;
            }else{
                return true;
            }
        }

        model.Activity.aggregate([
            {
                $lookup: { from: "students", localField: 'hostId', foreignField: 'studentId', as: 'hostInfo' }
                //,$lookup: { from: "activitystudents", localField: 'activityId', foreignField: 'activityId', as: 'activityStudentInfo' }
            }
            ,
            {
                $unwind: '$hostInfo'
            },
            {
                $lookup: { from: "activitystudents", localField: 'activityId', foreignField: 'activityId', as: 'activityStudentInfo' }
            },
            {
                $unwind: '$activityStudentInfo'
            }
        ]).then(result => {

            finalResult = result.filter(filterByActivityStatus);
            finalResult = finalResult.filter(filterByStudentId);
            finalResult = finalResult.filter(filterOutStudentHost);
            //console.log("finalResult-->", finalResult)
            res.json(finalResult)
            //res.json(result)
        }).catch(error => {
            res.status(400).json("Lookup Collection Error");
        })
       
        /*model.ActivityStudent.aggregate([
            {
                $lookup : {from: "activities", localField : "activityId", foreignField : "activityId", as : "activityInfo"}
            },
            {
                $unwind: "$activityInfo"
            }
        ]).then(result =>{
            res.json([])
        }).catch(error => {
            res.status(400).json("Lookup Collection Error");
        })*/
    }
}

//POST  http://localhost:3001/api/cancelActivity/  --Host Cancel an activity
async function cancel_activity(req, res) {
    console.log("")
    console.log("")
    console.log("")
    console.log("req.body in cancel_activity is--->", req.body)

    let {hostId, activityId} = req.body

    let noOfMember = null;
    let oldRatingReceived = null;
    let newRatingReceived = null;

    //1.Change activity status to cancelled
    await model.Activity.updateOne({ activityId }, { activityStatus: 'Cancelled' });

    //2.Get number of member excluding host
    model.Activity.find({activityId})
        .then(activity => {
            console.log(activity)
            noOfMember = activity[0].currentMember
            noOfMember = parseInt(noOfMember) - 1;
            console.log("NoOfMember-->", noOfMember)
            getRatingReceived();
        })
        .catch (err=> res.status(400).json('Error: ' + err))

    //3.Get RatingReceived of host
    const getRatingReceived = () => {
        model.Student.find({ studentId: hostId })
            .then(student => {
                oldRatingReceived = student[0].ratingReceived;
                console.log("hostRatingReceived-->", oldRatingReceived)
                insertNewRatingReceived();
            })
            .catch(err => res.status(400).json('Error: ' + err))
    }
    
    //4.Add "ratingReceived" depending on NoOfMember without adding "accumulatedRating"
    const insertNewRatingReceived = async() => {
        newRatingReceived = oldRatingReceived + noOfMember;
        console.log(typeof newRatingReceived)
        console.log(newRatingReceived)
        await model.Student.updateOne({ studentId: hostId }, { ratingReceived: newRatingReceived });
        res.send(true);
    }
   
    
}

//POST  http://localhost:3001/api/removeMember/  -- Remove Member from activity
async function remove_member(req,res){
    console.log("req.body in remove_member--->",req.body)
    let {studentId, activityId} = req.body;

    let oldCurrentMember = null;
    let newCurrentMember = null;
    
    

    //2.Retrieve currentMember
    const retrieveCurrentMember = async() => {
        await model.Activity.find({activityId})
            .then(activity=>{
                console.log(activity)
                oldCurrentMember = parseInt(activity[0].currentMember)
            }).catch(error => {
                res.status(400).json("Lookup Collection Error");
            })
    }

    //3.Decrement current member by 1 & change activity status to published
    const decrementCurrentMember = async() => {
        console.log("oldCurrentMember-->", oldCurrentMember)
        newCurrentMember = oldCurrentMember - 1;
        console.log("newCurrentMember-->", newCurrentMember)
        await model.Activity.updateOne({ activityId }, { activityStatus: 'Published', currentMember: newCurrentMember }).then(res.send(true));
    }

    //1.Remove Student from activitystudent collection
    await model.ActivityStudent.deleteOne({ studentId, activityId })

    await retrieveCurrentMember()
    await decrementCurrentMember()

    
    
}

//POST  http://localhost:3001/api/confirmActivity/  -- Confirm an activity
async function confirm_activity(req,res){
    console.log("req.body in confirm_activity--->", req.body)
    let {activityId} = req.body
    await model.Activity.updateOne({ activityId }, { activityStatus: 'Confirmed'});
    res.send(true);
}

//POST http://localhost:3001/api/completeActivity/   --Change activity status to Completed
async function complete_activity(req,res){
    console.log("req.body in confirm_activity--->", req.body)
    let { activityId } = req.body
    await model.Activity.updateOne({ activityId }, { activityStatus: 'Completed' });
    res.send(true);
}

//POST http://localhost:3001/api/submitRating   --Submit Rating
async function submit_rating(req,res){
    console.log("req.body in test_api",req.body)
    console.log("req.params in test_api", req.params)
    let hostId = parseInt(req.params.studentId)
    let activityId = req.body[0].activityId;

    req.body.forEach(async(item) => {
        console.log("iii", item);
        let { studentId, rating } = item
        rating = parseInt(rating);

        console.log("studentId", studentId);
        console.log("rating", rating);
        console.log("activityId", activityId);

        let oldAccumulatedRating = null;
        let oldRatingReceived = null;
        let newAccumulatedRating = null;
        let newRatingReceived = null;

        //1.Get Student Info
        await model.Student.find({studentId})
            .then(async(student) => {
                console.log("Hello??");
                oldAccumulatedRating = student[0].accumulatedRating;
                oldRatingReceived = student[0].ratingReceived;

                //2.Modify the variables
                newAccumulatedRating = oldAccumulatedRating + rating;
                newRatingReceived = oldRatingReceived+1;
                console.log("newAccumulatedRating", newAccumulatedRating);
                console.log("newRatingReceived", newRatingReceived);

                //3.Update the modified variable back into Student collection
                await model.Student.updateOne({ studentId }, { accumulatedRating: newAccumulatedRating, ratingReceived: newRatingReceived })
            })
            .catch(err=> res.status(400).json('Error: ' + err))
    })

    //4.Update status in activityStudents collection to true
    await model.ActivityStudent.updateOne({ studentId: hostId, activityId }, { isRated: true })
    res.send(true)

    //1.Get Student Info
    //2.Modify the variables
    //3.Update the modified variable back into Student collection
    //4.Update status in activityStudents collection
}

//POST http://localhost:3001/api/checkIsRated   --Check Is Rated
async function check_isRated(req,res){
    console.log("req.body in check_isRated--->",req.body)
    let {studentId, activityId} = req.body;

    model.ActivityStudent.find({ studentId, activityId })
        .then(result => {
            console.log(result)
            if(result[0].isRated===false){
                res.send(false)
            }else{
                res.send(true);
            }
        })
        .catch (err=> res.status(400).json('Error: ' + err))
}

//POST http://localhost:3001/api/unjoinActivity --Student Unjoin activity
async function unjoin_activity(req, res){
    console.log("")
    console.log("")
    console.log("")
    console.log("req.body in unjoin_activity--->", req.body)

    let {studentId, activityId} = req.body;
    studentId = parseInt(studentId);
    console.log("studentId :", studentId)
    console.log("activityId :", activityId)

    let oldAccumulatedRating = null;
    let oldRatingReceived = null;
    let oldCurrentMember = null;
    let newAccumulatedRating = null;
    let newRatingReceived = null;
    let newCurrentMember = null;

    //1.Remove record in activitystudent collection
    model.ActivityStudent.findOneAndDelete({ studentId, activityId }, async function (err) {
        if (!err) {
            console.log("Hello1")  
            await getAccumulatedRating(); 
            await updateAccumulatedRating();
            await getCurrentMember();
            await decrementMember();
            res.send(true)   
        }else{
            return res.send(err);
        } 
    });

    //2.Get accumulated rating by student
    const getAccumulatedRating = async() => {
        await model.Student.find({ studentId })
            .then(async (student) => {
                oldRatingReceived = student[0].ratingReceived
                console.log("oldRatingReceived-->", oldRatingReceived)
                console.log("Hello2")
            })
    }

    //3.Update new accumulated rating into student record
    const updateAccumulatedRating = async() => {
        newRatingReceived = oldRatingReceived + 1;
        console.log("newRatingReceived-->", newRatingReceived)
        await model.Student.updateOne({ studentId: studentId }, { ratingReceived: newRatingReceived });
        console.log("Hello3") 
    }
    
    //4.Get current member of activity 
    const getCurrentMember = async() => {
        await model.Activity.find({activityId})
        .then(activity => {
            oldCurrentMember = activity[0].currentMember;
            console.log("oldCurrentMember :", oldCurrentMember)
            console.log("Hello4") 
        }).catch(err => res.status(400).json('Error: ' + err))
    }
    
    //5.Decrement current member by one and update into Activity collection
    const decrementMember = async() => {
        newCurrentMember = oldCurrentMember - 1;
        console.log("newCurrentMember :",newCurrentMember)
        await model.Activity.updateOne({ activityId }, { currentMember: newCurrentMember, activityStatus : "Published" })
        console.log("Hello5") 
    }
}

//GET http://localhost:3001/api/viewStudentDetails/:studentId  //--Get Activity History for Chart
async function get_activity_history(req,res){
    console.log("req.params in get_activity_history-->", req.params)

    let { studentId } = req.params;

    let finalResult = null;

    function filterBySport(activitystudent) {
        if (activitystudent.activityInfo.activityType === 'Sport') {
            return true;
        } else {
            return false;
        }
    }

    function filterByStudy(activitystudent) {
        if (activitystudent.activityInfo.activityType === 'Study') {
            return true;
        } else {
            return false;
        }
    }

    function filterByHangout(activitystudent) {
        if (activitystudent.activityInfo.activityType === 'Hangout') {
            return true;
        } else {
            return false;
        }
    }

    function filterByOther(activitystudent) {
        if (activitystudent.activityInfo.activityType === 'Other') {
            return true;
        } else {
            return false;
        }
    }

    function filterByStudentId(activitystudent) {
        if (parseInt(activitystudent.studentId) === parseInt(studentId)) {
            return true;
        } else {
            return false;
        }
    }
    
    model.ActivityStudent.aggregate([
        {
            $lookup: { from: "activities", localField: 'activityId', foreignField: 'activityId', as: 'activityInfo' }
        },
        {
            $unwind: '$activityInfo'
        }
    ]).then(async(result) => {
        result = result.filter(filterByStudentId);
        console.log("result.length--->",result.length)

        totalCount = result.length
        //console.log("\nfinalResult-->",finalResult)
        sportCount = result.filter(filterBySport).length
        console.log("sportCount-->", sportCount)

        studyCount = result.filter(filterByStudy).length
        console.log("studyCount-->", studyCount)

        hangoutCount = result.filter(filterByHangout).length
        console.log("hangoutCount-->", hangoutCount)

        otherCount = result.filter(filterByOther).length
        console.log("otherCount-->", otherCount)

        res.send([sportCount, studyCount, hangoutCount, otherCount, totalCount])
        
        //res.json(result)
    }).catch(error => {
        res.status(400).json("Lookup Collection Error");
    })
}

module.exports = {
    get_all_student,
    get_one_student,
    post_admin,
    admin_auth,
    student_auth,
    post_student,
    update_one_student,
    get_all_student_with_studentId,
    delete_one_student,
    get_activity,
    create_activity,
    get_activity_details,
    get_member_list,
    post_join_activity,
    get_activity_dashboard,
    cancel_activity,
    remove_member,
    confirm_activity,
    complete_activity,
    submit_rating,
    check_isRated,
    unjoin_activity,
    get_activity_history
}

