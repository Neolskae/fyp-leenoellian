import React, { Component, useEffect, useState } from 'react'
import NavBar from './NavBar.js';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import { intToMonth, activityTypeLogo } from '../../helper/helper.js'
import { base_url } from '../../helper/helper.js'

export default function RatingPage() {
    let navigate = useNavigate();
    let state = useSelector((state) => {
        return state["app"]
    })

    let { activityIdForView, studentId } = state;

    //Activity Details
    const [activityName, setActivityName] = useState();
    const [imgUrl, setImgUrl] = useState();
    const [fullName, setFullName] = useState();
    const [hostId, setHostId] = useState();
    const [hostProgramme, setHostProgramme] = useState();
    const [activityDescription, setActivityDescription] = useState();
    const [startDateTime, setStartDateTime] = useState();
    const [endDateTime, setEndDateTime] = useState();
    const [activityType, setActivityType] = useState();
    const [maxMember, setMaxMember] = useState();

    //Member List
    const [memberList, setMemberList] = useState([])

    //Dummy Variable for studentId
    const [memberList2, setMemberList2] = useState(null)

    let studentIdArray = [];

    const refresh = () => {
        axios.get(`${base_url}/api/getActivityDetails/${activityIdForView}`)     //'http://localhost:3001/api/getActivityDetails/' + activityIdForView
            .then(res => {
                console.log("res.data RatingPage is -->", res.data);
                setActivityName(res.data[0].activityName);
                setImgUrl(res.data[0].hostInfo.imgUrl)
                setFullName(res.data[0].hostInfo.fullName)
                setHostId(res.data[0].hostId)
                setHostProgramme(res.data[0].hostInfo.programme)
                setActivityDescription(res.data[0].activityDescription)
                setStartDateTime(res.data[0].startDateTime)
                setEndDateTime(res.data[0].endDateTime)
                setActivityType(res.data[0].activityType)
                setMaxMember(res.data[0].maxMember)
            })
            .catch(err => {
                console.log(err)
            });

        axios.get(`${base_url}/api/getMemberList/${activityIdForView}`)    //'http://localhost:3001/api/getMemberList/' + activityIdForView
            .then(res => {
                console.log("res data in getMemberList--->", res.data)
                setMemberList(res.data);

                for (let i = 0; i < res.data.length; i++) {
                    console.log("res.data[i].studentId-->", res.data[i].studentId)
                    if (!studentIdArray.find(item => item.studentId === res.data[i].studentId)) {
                        studentIdArray = [...studentIdArray, { 'studentId': res.data[i].studentId, 'rating': null, 'activityId': res.data[i].activityId }]
                    }
                }
                console.log("studentIdArray", studentIdArray)
                setMemberList2(studentIdArray)

            }).catch(err => {
                console.log(err)
            });
    }

    useEffect(() => {
        refresh();
        return undefined;
    }, [])

    let activityOutput = null;

    const handleChange = (e) => {
        console.log('')
        console.log('')
        console.log('')
        console.log(e.target.value); //Rating
        console.log(e.target.id);  //Student ID

        console.log("memberList2 is----->", memberList2);

        if (memberList2.find(item => {
            return item.studentId == e.target.id
        })) {
            console.log("1.", memberList2);
            let tempMemberList2 = memberList2;
            let index = tempMemberList2.findIndex(member => member.studentId == e.target.id)
            tempMemberList2[index].rating = e.target.value
            setMemberList2(tempMemberList2)

        } else {
            console.log("false")
        }
    }

    const submit = () => {
        console.log("memberList2--->", memberList2);

        let filteredArray = memberList2.filter(member => {
            console.log("member is-->", member)
            return member.rating !== null;
        })

        let memberMinusOne = parseInt(maxMember - 1)
        
        if (filteredArray.length !== memberMinusOne){
            alert("Please rate all students")
        }else{
            axios.post(`${base_url}/api/submitRating/${studentId}`, filteredArray)     //'http://localhost:3001/api/submitRating/' + studentId
                .then(res => {
                    console.log(res.data)
                    if (res.data === true) {
                        alert("Rating Submitted!")
                        navigate('/studentHome')
                    }
                }).catch(err => {
                    console.log(err)
                });
        }
    }

    if (activityIdForView) {
        activityOutput = (
            <>
                <div className="row justify-content-center mb-3">
                    <img src={imgUrl} alt="" className="rounded-circle" style={{ width: '200px', height: 'auto' }} />
                </div>

                <div className="row justify-content-center mb-3 text-center">
                    <p className='fw-bold h3'>{fullName}</p>
                </div>

                <div className="row justify-content-center mb-0 text-center">
                    <div className="col d-flex justify-content-end">
                        <p className='fw-bold m-0'>Host Id :</p>
                    </div>
                    <div className="col d-flex justify-content-start">
                        <p className='m-0'>{hostId}</p>
                    </div>
                </div>

                <div className="row justify-content-center mb-5 text-center">
                    <div className="col d-flex justify-content-end">
                        <p className='m-0 fw-bold'>Host Programme :</p>
                    </div>
                    <div className="col d-flex justify-content-start">
                        <p className='m-0'>{hostProgramme}</p>
                    </div>
                </div>

                <div className="row justify-content-center mb-3 text-center">
                    <div className="col ">
                        <p className='m-0 fw-bold h3' style={{ fontWeight: '700px' }}><u>Activity Name</u></p>
                    </div>

                </div>

                <div className="row justify-content-center mb-5 text-center">
                    <div className="col">
                        <p className='m-0 h4'>{activityName === '' ? 'N/A' : activityName}</p>
                    </div>
                </div>

                <div className="row justify-content-center mb-3 text-center">
                    <div className="col">
                        <p className='m-0 fw-bold h3'><u>Activity Description</u></p>
                    </div>
                </div>

                <div className="row justify-content-center mb-5 text-center">
                    <div className="col">
                        <pre className='m-0 h4'>{activityDescription === '' ? 'N/A' : activityDescription}</pre>
                    </div>
                </div>

                <div className="row justify-content-center mb-3 text-center">
                    <div className="col">
                        <p className='m-0 fw-bold h3'><u>Start Date &amp; Time</u></p>
                    </div>
                </div>

                <div className="row justify-content-center mb-5 text-center">
                    <p className='m-0 h4'>{`${new Date(startDateTime).getUTCDate()} ${intToMonth(new Date(startDateTime).getMonth())} ${new Date(startDateTime).getFullYear()} ${new Date(startDateTime).toTimeString().slice(0, 5)}`}</p>
                </div>

                <div className="row justify-content-center mb-3 text-center">
                    <div className="col">
                        <p className='m-0 fw-bold h3'><u>End Date &amp; Time</u></p>
                    </div>
                </div>

                <div className="row justify-content-center mb-5 text-center">
                    <p className='m-0 h4'>{`${new Date(endDateTime).getUTCDate()} ${intToMonth(new Date(endDateTime).getMonth())} ${new Date(endDateTime).getFullYear()} ${new Date(endDateTime).toTimeString().slice(0, 5)}`}</p>
                </div>

                <div className="row justify-content-center mb-1 text-center">
                    <div className="col">
                        <p className='m-0 fw-bold h3'><u>Activity Type</u></p>
                    </div>
                </div>

                <div className="row justify-content-center mb-0 text-center">
                    <img className=' rounded-circle w-1 mt-3 p-0 mb-3' src={activityTypeLogo(activityType)} alt="" style={{ height: '8%', width: 'auto' }} />
                </div>

                <div className="row justify-content-center mb-5 text-center">
                    <p className='m-0 h4'>{activityType}</p>
                </div>

                <div className="row justify-content-center mb-1 text-center">
                    <div className="col">
                        <p className='m-0 fw-bold h3'><u>Max Member</u></p>
                    </div>
                </div>

                <div className="row justify-content-center mb-5 text-center">
                    <p className='m-0 h4'>{maxMember}</p>
                </div>

                <div className="row justify-content-center mb-1 text-center">
                    <div className="col">
                        <p className='m-0 fw-bold h3'><u>Current Member List</u></p>
                    </div>
                </div>

                {memberList.map(member => {
                    return (
                        <div key={member.studentId}>
                            {member.studentId == studentId ? null :
                                <div className='row border border-dark mb-3 rounded' key={member.studentId} >
                                    <div className='col-3 d-flex justify-content-center'>

                                        <img src={member.memberInfo.imgUrl} className='img-fluid rounded-circle my-3 d-flex justify-content-center border border-dark' style={{ width: '100px', height: 'auto' }} />

                                    </div>
                                    <div className='col-2'>
                                        <div className='row mt-3'>
                                            <p className='text-center'>{member.memberInfo.fullName}</p>
                                        </div>
                                        <div className='row'>
                                            <p className='text-center'>{member.memberInfo.programme}</p>
                                        </div>
                                        <div className='row'>
                                            <p className='text-center'>{member.studentId}</p>
                                        </div>
                                    </div>

                                    <div className='col-7 d-flex align-items-center'>
                                        <div className='row'>
                                            <form className='d-flex flex-row'>
                                                {/*Radio Button for 1 */}
                                                <div className='col ms-5 me-3'>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id={member.studentId} value={1} onClick={handleChange} />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            1
                                                        </label>
                                                    </div>
                                                </div>

                                                {/*Radio Button for 2 */}
                                                <div className='col me-3'>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id={member.studentId} value={2} onClick={handleChange} />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            2
                                                        </label>
                                                    </div>
                                                </div>

                                                {/*Radio Button for 3 */}
                                                <div className='col me-3'>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id={member.studentId} value={3} onClick={handleChange} />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            3
                                                        </label>
                                                    </div>
                                                </div>

                                                {/*Radio Button for 4 */}
                                                <div className='col me-3'>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id={member.studentId} value={4} onClick={handleChange} />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            4
                                                        </label>
                                                    </div>
                                                </div>

                                                {/*Radio Button for 5 */}
                                                <div className='col'>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id={member.studentId} value={5} onClick={handleChange} />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            5
                                                        </label>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>}
                        </div>
                    )
                })}

                <div className='row d-flex justify-content-center'>
                    <button className='btn btn-success py-3 w-50 mb-5' onClick={submit}>Submit Rating</button>
                </div>
            </>
        )
    } else {
        activityOutput = (<p className='text-center h2'>No activities found ☹️</p>)
    }

    return (
        <div>
            <NavBar title={'Rating Page'} />
            <div className='container'>
                {activityOutput}
            </div>
        </div>
    )
}

