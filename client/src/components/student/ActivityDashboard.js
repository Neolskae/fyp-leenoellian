import React, { Component, useEffect, useState } from 'react'
import NavBar from './NavBar.js';
import { Button, Row, Col, Container, Dropdown, ButtonGroup, Card } from 'react-bootstrap'
import { FiFilter } from "react-icons/fi";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillStar } from "react-icons/ai";
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import { addActivityIdForView } from '../../redux/feature'
import { intToMonth, activityTypeLogo, roundToTwo, base_url } from '../../helper/helper.js'
import ReactTooltip from 'react-tooltip'

export default function ActivityDashboard() {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let state = useSelector((state) => {
        return state["app"]
    })

    let { studentId } = state;

    //Activity List
    const [activities, setActivities] = useState([])

    //Host Type
    const [hostByYouFilter, setHostByYouFilter] = useState(true)
    const [hostByOtherFilter, setHostByOtherFilter] = useState(false)

    //Activity Type
    const [publishedFilter, setPublishedFilter] = useState(true)
    const [pendingFilter, setPendingFilter] = useState(false)
    const [confirmedFilter, setConfirmedFilter] = useState(false)
    const [completedFilter, setCompletedFilter] = useState(false)
    const [cancelledFilter, setCancelledFilter] = useState(false)

    //Tooltip
    const [tooltip, showTooltip] = useState(true);

    const handleChange = (data) => {
        if(data==='hostByYouFilter'){
            if (hostByYouFilter===true){

            }else{
                setHostByYouFilter(!hostByYouFilter);
                setHostByOtherFilter(false);
            }
        }else if(data==='hostByOtherFilter'){
            if (hostByOtherFilter===true){

            }else{
                setHostByOtherFilter(!hostByOtherFilter);
                setHostByYouFilter(false);
            }
        }else if(data==='publishedFilter'){
            if(publishedFilter===true){
            }else{
                setPublishedFilter(true)
                setPendingFilter(false)
                setConfirmedFilter(false)
                setCompletedFilter(false)
                setCancelledFilter(false)
            }
        }else if(data==='pendingFilter'){
            if (pendingFilter===true){
            }else{
                setPublishedFilter(false)
                setPendingFilter(true)
                setConfirmedFilter(false)
                setCompletedFilter(false)
                setCancelledFilter(false)
            }
        }else if(data==='confirmedFilter'){
            if (confirmedFilter === true) {
            } else {
                setPublishedFilter(false)
                setPendingFilter(false)
                setConfirmedFilter(true)
                setCompletedFilter(false)
                setCancelledFilter(false)
            }
        } else if (data === 'completedFilter') {
            if (completedFilter === true) {
            } else {
                setPublishedFilter(false)
                setPendingFilter(false)
                setConfirmedFilter(false)
                setCompletedFilter(true)
                setCancelledFilter(false)
            }
        }else if (data === 'cancelledFilter') {
            if (cancelledFilter === true) {
            } else {
                setPublishedFilter(false)
                setPendingFilter(false)
                setConfirmedFilter(false)
                setCompletedFilter(false)
                setCancelledFilter(true)
            }
        }
    }

    const refresh = () => {
        const params = {
            studentId, hostByYouFilter, hostByOtherFilter, publishedFilter, pendingFilter, confirmedFilter, completedFilter, cancelledFilter
        }

        axios.post(`${base_url}/api/getActivityDashboard/`, params)    //'http://localhost:3001/api/getActivityDashboard/'
            .then(res => {
                console.log("res.data in getActivityDashboard is -->", res.data);
                setActivities(res.data)
            })
            .catch(err => {
                console.log(err)
            });
    }

    useEffect(()=>{
        refresh();
    }, [hostByYouFilter, hostByOtherFilter, publishedFilter, pendingFilter, confirmedFilter, completedFilter, cancelledFilter])

    let activityOutput = null;

    const cancelActivity = (activityId) => {

        const params = {
            hostId : studentId,
            activityId
        }

        axios.post(`${base_url}/api/cancelActivity/`, params)  //'http://localhost:3001/api/cancelActivity/'
            .then(res => {
                console.log("res.data is cancelActivity-->", res.data);
                if(res.data===true){
                    alert("Activity Cancelled")
                    refresh();
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    const completeActivity = (activityId) => {
        const params = {
            activityId
        }

        axios.post(`${base_url}/api/completeActivity/`, params)      //'http://localhost:3001/api/completeActivity/'
            .then(res => {
                console.log("res.data is cancelActivity-->", res.data);
                if (res.data === true) {
                    alert("Activity is set to Completed!")
                    refresh();
                }
            })
            .catch(err => {
                console.log(err)
            });
    }    

    const checkIsRated = (activityId) => {
        const params = {
            activityId,
            studentId
        }

        axios.post(`${base_url}/api/checkIsRated/`, params)      //'http://localhost:3001/api/checkIsRated/'
            .then(res => {
                console.log("res.data is cancelActivity-->", res.data);
                if (res.data === false) {
                    navigate('/ratingPage/' + activityId)
                }else{
                    alert("Activity has already been rated")
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    const unjoinActivity = (activityId) => {
        const params = {
            studentId,
            activityId
        }

        axios.post(`${base_url}/api/unjoinActivity/`, params)    //'http://localhost:3001/api/unjoinActivity/'
            .then(res => {
                console.log("res.data is unjoinActivityy-->", res.data);
                if(res.data===true){
                    alert('Activity Successfully unjoined')
                    refresh();
                }else{
                    alert('Error while unjoining activity')
                }
                
            })
            .catch(err => {
                console.log(err)
            });
    }

    const buttonOutput = (activityId) => {
        if (hostByYouFilter === true) {
            if (publishedFilter === true) {
                return (
                    <>
                        <button className='btn btn-primary me-3 mb-2' onClick={() => dispatch(addActivityIdForView(activityId))}>
                            <Link className='text-light text-decoration-none' to={'/activityDetails/' + activityId}>
                                More Details
                            </Link>
                        </button> 

                        {tooltip && <ReactTooltip effect="solid" type="error" />}
                        <button
                            className='btn btn-danger mb-2'
                            data-tip="Cancelling an activity will decrease your rating"
                            onMouseEnter={() => showTooltip(true)}
                            onMouseLeave={() => {
                                showTooltip(false);
                                setTimeout(() => showTooltip(true), 50);
                            }}
                            onClick={() => cancelActivity(activityId)}
                        >Cancel</button>

                        
                    </>
                )
            } else if (pendingFilter === true) {
                return (
                    <>
                        <button className='btn btn-success me-3 mb-2' id={activityId} onClick={() => dispatch(addActivityIdForView(activityId))} >
                            <Link className='text-light text-decoration-none' to={'/activityConfirmation/' + activityId}>
                                Confirmation
                            </Link>
                        </button>

                        {tooltip && <ReactTooltip effect="solid" type="error" />}
                        <button
                            className='btn btn-danger mb-2'
                            data-tip="Cancelling an activity will decrease your rating"
                            onMouseEnter={() => showTooltip(true)}
                            onMouseLeave={() => {
                                showTooltip(false);
                                setTimeout(() => showTooltip(true), 50);
                            }}
                            onClick={() => cancelActivity(activityId)}
                        >Cancel</button>
                    </>
                )
            } else if (confirmedFilter === true) {
                return (
                    <>
                        <button className='btn btn-primary me-3 mb-2' onClick={() => dispatch(addActivityIdForView(activityId))}>
                            <Link className='text-light text-decoration-none' to={'/activityDetails/' + activityId}>
                                More Details
                            </Link>
                        </button> 

                        <button className='btn btn-success mb-2 me-3' id={activityId} onClick={() => completeActivity(activityId)}>
                            Set As Complete
                        </button>

                        {tooltip && <ReactTooltip effect="solid" type="error" />}
                        <button
                            className='btn btn-danger mb-2'
                            data-tip="Cancelling an activity will decrease your rating"
                            onMouseEnter={() => showTooltip(true)}
                            onMouseLeave={() => {
                                showTooltip(false);
                                setTimeout(() => showTooltip(true), 50);
                            }}
                            onClick={() => cancelActivity(activityId)}
                        >Cancel</button>
                    </>
                )
            } else if (completedFilter === true) {
                return (
                    <>
                        <button className='btn btn-primary me-3 mb-2' onClick={() => dispatch(addActivityIdForView(activityId))}>
                            <Link className='text-light text-decoration-none' to={'/activityDetails/' + activityId}>
                                More Details
                            </Link>
                        </button> 

                        {/*checkIsRated(activityId)*/}

                        <button className='btn btn-orange me-3 mb-2 text-light' onClick={() => {
                            checkIsRated(activityId)
                        }}>
                            Rate Members
                        </button>
                    </>
                )
            } else {
                return (
                    <>
                        <button className='btn btn-primary me-3 mb-2' onClick={() => dispatch(addActivityIdForView(activityId))}>
                            <Link className='text-light text-decoration-none' to={'/activityDetails/' + activityId}>
                                More Details
                            </Link>
                        </button> 
                    </>
                )
            }
        } else {
            if (publishedFilter === true) {
                return (
                    <>
                        {tooltip && <ReactTooltip effect="solid" type="error"/>}
                        <button
                            className='btn btn-danger mb-2'
                            data-tip="Unjoining this activity will decrease your rating"
                            onMouseEnter={() => showTooltip(true)}
                            onMouseLeave={() => {
                                showTooltip(false);
                                setTimeout(() => showTooltip(true), 50);
                            }}
                            onClick={() => unjoinActivity(activityId)}
                        >Unjoin</button>
                    </>
                )
            } else if (pendingFilter === true) {
                return (
                    <>
                        {tooltip && <ReactTooltip effect="solid" type="error" />}
                        <button
                            className='btn btn-danger mb-2'
                            data-tip="Unjoining this activity will decrease your rating"
                            onMouseEnter={() => showTooltip(true)}
                            onMouseLeave={() => {
                                showTooltip(false);
                                setTimeout(() => showTooltip(true), 50);   
                            }}
                            onClick={() => unjoinActivity(activityId)}
                        >Unjoin</button>
                    </>
                )
            } else if (confirmedFilter === true) {
                return (
                    <>
                        <button className='btn btn-primary me-3 mb-2' onClick={() => dispatch(addActivityIdForView(activityId))}>
                            <Link className='text-light text-decoration-none' to={'/activityDetails/' + activityId}>
                                More Details
                            </Link>
                        </button>
                    </>
                )
            } else if (completedFilter === true) {
                return (
                    <>
                        <button className='btn btn-orange me-3 mb-2 text-light' onClick={() => {
                            checkIsRated(activityId)
                        }}>
                            Rate Members
                        </button>
                    </>
                )
            } else {
                return (
                    <>
                        <button className='btn btn-primary me-3 mb-2' onClick={() => dispatch(addActivityIdForView(activityId))}>
                            <Link className='text-light text-decoration-none' to={'/activityDetails/' + activityId}>
                                More Details
                            </Link>
                        </button>
                    </>
                )
            }
        }
    }

    if (activities.length > 0){
        if(hostByYouFilter===true){
            activityOutput = activities.map(activity => {
                return (
                    <Row key={activity._id}>
                        <Card className="container text-center border-dark mb-1 fluid ms-2">
                            <div className="row">
                                <div className="col-3">
                                    <Row className='d-flex justify-content-center'>
                                        <img className=' rounded-circle w-1 mt-3 p-0 border border-dark' src={activity.hostInfo.imgUrl} alt="" style={{ height: '50%', width: '50%' }} />
                                    </Row>

                                    <Row className='m-0'>
                                        <p className='fw-bold mb-0'>{activity.hostInfo.fullName}</p>
                                    </Row>

                                    <Row>
                                        <p className='d-none d-sm-block'>{activity.hostInfo.ratingReceived === 0 ? 'No ratings yet' : roundToTwo(activity.hostInfo.accumulatedRating / activity.hostInfo.ratingReceived)} {activity.hostInfo.ratingReceived === 0 ? '' : < AiFillStar />}</p>
                                    </Row>
                                </div>

                                <div className="col-5">
                                    <p className='display-6 fw-bold mt-4'>{activity.activityName}</p>

                                    <div className="row">
                                        <div className="col px-1">
                                            <p className='text-end fw-bold'>Start DateTime :</p>
                                        </div>

                                        <div className="col p-0">
                                            <p className='text-start'>{`${new Date(activity.startDateTime).getUTCDate()} ${intToMonth(new Date(activity.startDateTime).getMonth())} ${new Date(activity.startDateTime).getFullYear()} ${new Date(activity.startDateTime).toTimeString().slice(0, 5)}`}</p>
                                        </div>

                                    </div>

                                    <div className="row">
                                        <div className="col px-1">
                                            <p className='text-end fw-bold'>End DateTime :</p>
                                        </div>

                                        <div className="col p-0">
                                            <p className='text-start'>{`${new Date(activity.endDateTime).getUTCDate()} ${intToMonth(new Date(activity.endDateTime).getMonth())} ${new Date(activity.endDateTime).getFullYear()} ${new Date(activity.endDateTime).toTimeString().slice(0, 5)}`}</p>
                                        </div>

                                    </div>

                                </div>

                                <div className="col-4">

                                    <div className="row-10 mb-5">
                                        <img className=' rounded-circle  mt-3 p-0' src={activityTypeLogo(activity.activityType)} alt="" style={{ height: '30%', width: '30%' }} />
                                    </div>
                                    <div className="row-2 d-flex justify-content-end align-items-end">

                                        <div className="col-12 d-flex justify-content-end align-items-end">
                                            {buttonOutput(activity.activityId)}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Row>
                )
            })
        }else{
            activityOutput = activities.map(activity => {
                return (
                    <Row key={activity._id}>
                        <Card className="container text-center border-dark mb-1 fluid ms-2">
                            <div className="row">
                                <div className="col-3">
                                    <Row className='d-flex justify-content-center'>
                                        <img className=' rounded-circle w-1 mt-3 p-0 border border-dark' src={activity.hostInfo.imgUrl} alt="" style={{ height: '50%', width: '50%' }} />
                                    </Row>

                                    <Row className='m-0'>
                                        <p className='fw-bold mb-0'>{activity.hostInfo.fullName}</p>
                                    </Row>

                                    <Row>
                                        <p className='d-none d-sm-block'>{activity.hostInfo.ratingReceived === 0 ? 'No ratings yet' : roundToTwo(activity.hostInfo.accumulatedRating / activity.hostInfo.ratingReceived)} {activity.hostInfo.ratingReceived === 0 ? '' : < AiFillStar />}</p>
                                    </Row>
                                </div>

                                <div className="col-5">
                                    <p className='display-6 fw-bold mt-4'>{activity.activityName}</p>

                                    <div className="row">
                                        <div className="col px-1">
                                            <p className='text-end fw-bold'>Start DateTime :</p>
                                        </div>

                                        <div className="col p-0">
                                            <p className='text-start'>{`${new Date(activity.startDateTime).getUTCDate()} ${intToMonth(new Date(activity.startDateTime).getMonth())} ${new Date(activity.startDateTime).getFullYear()} ${new Date(activity.startDateTime).toTimeString().slice(0, 5)}`}</p>
                                        </div>

                                    </div>

                                    <div className="row">
                                        <div className="col px-1">
                                            <p className='text-end fw-bold'>End DateTime :</p>
                                        </div>

                                        <div className="col p-0">
                                            <p className='text-start'>{`${new Date(activity.endDateTime).getUTCDate()} ${intToMonth(new Date(activity.endDateTime).getMonth())} ${new Date(activity.endDateTime).getFullYear()} ${new Date(activity.endDateTime).toTimeString().slice(0, 5)}`}</p>
                                        </div>

                                    </div>

                                </div>

                                <div className="col-4">

                                    <div className="row-10 mb-5">
                                        <img className=' rounded-circle  mt-3 p-0' src={activityTypeLogo(activity.activityType)} alt="" style={{ height: '30%', width: '30%' }} />
                                    </div>
                                    <div className="row-2 d-flex justify-content-end align-items-end">

                                        <div className="col-12 d-flex justify-content-end align-items-end">
                                            {buttonOutput(activity.activityId)}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Row>
                )
        })}
        

    }else{
        activityOutput = (<p className='text-center h2'>No activities found ☹️</p>)
    }
    
    return (
        <div>
            <NavBar title={'Activity Dashboard'} />
            <div className='container'>
                <Row>
                    <Col xs={3} variant='primary' className="d-flex flex-column">
                        <Row className='mb-3'>
                            <p className='h3 fw-bold d-flex justify-content-center' style={{ fontWeight: '700' }}>Filter<FiFilter size="1.5em" /></p>
                        </Row>
                        <Row>
                            <p className='h5 fw-bold d-flex justify-content-center' style={{ fontWeight: '700' }}>Host Type</p>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" id="1" onChange={() => handleChange('hostByYouFilter')} checked={hostByYouFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Hosted by You
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0 mb-5'>
                                <input className="form-check-input" type="checkbox" id="1" onChange={() => handleChange('hostByOtherFilter')} checked={hostByOtherFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Hosted by Others
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <p className='h5 fw-bold d-flex justify-content-center' style={{ fontWeight: '700' }}>Activity Status</p>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" id="1" onChange={() => handleChange('publishedFilter')} checked={publishedFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Published
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" id="1" onChange={() => handleChange('pendingFilter')} checked={pendingFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Pending
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" id="1" onChange={() => handleChange('confirmedFilter')} checked={confirmedFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Confirmed
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" id="1" onChange={() => handleChange('completedFilter')} checked={completedFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Completed
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" id="1" onChange={() => handleChange('cancelledFilter')} checked={cancelledFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Cancelled
                                </label>
                            </Col>
                        </Row>

                        
                    </Col>

                    <Col xs={9} className='p-0'>
                        
                        {activityOutput}
                    </Col>
                </Row>
            </div>
        </div>
    )
}
