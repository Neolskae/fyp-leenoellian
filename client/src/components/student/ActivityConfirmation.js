import React, { Component, useEffect, useState } from 'react'
import NavBar from './NavBar.js';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import { intToMonth, activityTypeLogo} from '../../helper/helper.js'
import { base_url } from '../../helper/helper.js'

export default function ActivityConfirmation() {
    let navigate = useNavigate();
    let state = useSelector((state) => {
        return state["app"]
    })

    let { activityIdForView, studentId } = state;

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

    //Confirm Button
    const [isDisabled, setIsDisabled] = useState(false)

    const refresh = () => {
        axios.get(`${base_url}/api/getActivityDetails/${activityIdForView}`)    //'http://localhost:3001/api/getActivityDetails/' + activityIdForView
            .then(res => {
                console.log("res.data ActivityConfirmation is -->", res.data);
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

        axios.get(`${base_url}/api/getMemberList/${activityIdForView}`)     //'http://localhost:3001/api/getMemberList/' + activityIdForView
            .then(res => {
                setMemberList(res.data);
            }).catch(err => {
                console.log(err)
            });
    }

    useEffect(() => {
        refresh();
        console.log("studentId is-->", studentId )
        return undefined;
    }, [])

    let activityOutput = null;

    const removeMember = (memberId) => {
        const params = {
            studentId : memberId,
            activityId: activityIdForView
        }

        axios.post(`${base_url}/api/removeMember/`, params)     //'http://localhost:3001/api/removeMember/'
            .then(res => {
                console.log("res in removeMember member lis-->", res.data)
                if(res.data===true){
                    alert('Member successfully removed!') 
                    setIsDisabled(true)
                    refresh();
                }else{
                    alert('Error while attempting to remove member!')
                }
            }).catch(err => {
                console.log(err)
            }); 
    }

    const confirmActivity = () => {
        const params = {
            activityId: activityIdForView
        }

        axios.post(`${base_url}/api/confirmActivity/`, params)     //'http://localhost:3001/api/confirmActivity/'
            .then(res => {
                console.log("res in removeMember member lis-->", res.data)
                if(res.data===true){
                    alert("Activity has been confirmed!")
                    navigate('/studentHome');
                }
            }).catch(err => {
                console.log(err)
            });
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

                <div className='row'>
                    {memberList.map(member => {
                        return (
                            <div className='col-4' key={member.studentId} >
                                <div key={member.studentId} className=" container text-center card border-dark mb-3 " style={{ height: '300px' }}>

                                    <div className=''>
                                        <img src={member.memberInfo.imgUrl} className='img-fluid my-3' style={{ width: '100px', height: 'auto' }} />
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
                            
                                    {member.studentId == studentId ? null : <button className='btn btn-outline-danger mb-3' onClick={()=>removeMember(member.studentId)}>Remove</button>}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className='row d-flex justify-content-center'>
                    <button className='btn btn-success py-3 w-50 mb-5' onClick={()=>confirmActivity()} disabled={isDisabled}>Confirm Activity</button>
                </div>
            </>
        )
    }else{
        activityOutput = (<p className='text-center h2'>No activities found ☹️</p>)
    }

    return (
        <div>
            <NavBar title={'Activity Confirmation'} />
            <div className='container'>
                {activityOutput}
            </div>
        </div>
    )
}
