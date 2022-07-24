import './style.css'
import React, { Component, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './NavBar';
import { base_url, intToMonth, activityTypeLogo } from '../../helper/helper.js'

export default function ActivityDetails({ }) {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let state = useSelector((state) => {
        return state["app"]
    })

    let { activityIdForView } = state;

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
    const [memberList, setMemberList] = useState([])

    const refresh = () => {
        axios.get(`${base_url}/api/getActivityDetails/${activityIdForView}`)    //'http://localhost:3001/api/getActivityDetails/' + activityIdForView
            .then(res => {
                console.log("res.data is -->", res.data);
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
                console.log("res in Activity DEtails member lis-->", res.data)
                setMemberList(res.data);
            }).catch(err => {
                console.log(err)
            });
    }

    useEffect(() => {
        refresh();
        return undefined;
    }, [])

    //Check whether there is record in activitiy collection in MongoDB database
    let activityOutput = null;
    if (activityIdForView) {
        activityOutput = (
            <>
                <div className="row justify-content-center mb-3">
                    <img src={imgUrl} alt="" className="rounded-circle" style={{width:'200px', height: 'auto'}}/>
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

                <div className='row'>
                {memberList.map(member => {
                    return(
                        <div className='col-4' key={member.studentId}>
                            <div key={member.studentId} className=" container text-center card border-dark mb-3 ">
                                
                                <div className=''>
                                    <img src={member.memberInfo.imgUrl} className='img-fluid my-3' style={{width:'100px', height:'auto'}}/>
                                </div>
                                <div className=''>
                                    <p>{member.memberInfo.fullName}</p>
                                </div>
                                <div className=''>
                                    <p>{member.studentId}</p>
                                </div>
                                <div className=''>
                                    <p>{member.memberInfo.programme}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                </div>    
            </>
        )
        
    } else {
        activityOutput = (<p className='text-center h2'>No activities found ☹️</p>)
    }

    return (
        <div >
            <NavBar title={'Activity Details'} />
            {/*Content*/}
            <div className="container">
                {activityOutput}
            </div>
        </div>
    )
}
