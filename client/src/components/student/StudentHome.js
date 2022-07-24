import './style.css' 
import React, { Component, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, Container, Dropdown, ButtonGroup, Card } from 'react-bootstrap'
import NavBar from './NavBar';
import { FiFilter } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { addActivityIdForView, addStudentIdForView } from '../../redux/feature' 
import { intToMonth, activityTypeLogo, roundToTwo, base_url } from '../../helper/helper.js'

export default function StudentHome({ }) {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    
    let state = useSelector((state) => {
        return state["app"]
    })

    let { studentId } = state;

    const [activities, setActivities] = useState([]);

    //HostName Filter
    const [hostnameFilter, setHostnameFilter] = useState('')

    //Activity Type Filter
    const [sportFilter,setSportFilter] = useState(false)
    const [studyFilter, setStudyFilter] = useState(false)
    const [hangoutFilter, setHangoutFilter] = useState(false)
    const [otherFilter, setOtherFilter] = useState(false)

    //Programme Filter
    const [rsdFilter, setRsdFilter] = useState(false);
    const [rbaFilter, setRbaFilter] = useState(false);
    const [rafFilter, setRafFilter] = useState(false);
    const [dacFilter, setDacFilter] = useState(false);
    const [dbfFilter, setDbfFilter] = useState(false);
    const [dbaFilter, setDbaFilter] = useState(false);
    const [dmaFilter, setDmaFilter] = useState(false);
    const [ditFilter, setDitFilter] = useState(false);
    const [dseFilter, setDseFilter] = useState(false);
    const [dhmFilter, setDhmFilter] = useState(false);

    //Host Rating Filter
    const [fiveStarFilter, setFiveStarFilter] = useState(false);
    const [fourStarFilter, setFourStarFilter] = useState(false);
    const [threeStarFilter, setThreeStarFilter] = useState(false);
    const [twoStarFilter, setTwoStarFilter] = useState(false);
    const [oneStarFilter, setOneStarFilter] = useState(false);

    const refresh = () => {
        const params = {
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
        }

        axios.post(`${base_url}/api/getActivity/`, params)     // 'http://localhost:3001/api/getActivity'
            .then(res => {
                //console.log("res.data in getActivity is -->", res.data);
                setActivities(res.data)
            })
            .catch(err => {
                console.log(err)
            });
    }

    function findHostName(event){
        console.log("val.target.value -->",event.target.value)
        setHostnameFilter(event.target.value);
    }

    function viewStudent(studentId){
        dispatch(addStudentIdForView(studentId))
        navigate('/studentHome/viewStudent/' + studentId)
    }

    const handleChange=(data)=>{
        console.log(data)
        if(data==='sportFilter'){
            setSportFilter(!sportFilter);
        }
        if(data==='studyFilter'){
            setStudyFilter(!studyFilter);
        }
        if (data === 'hangoutFilter') {
            setHangoutFilter(!hangoutFilter);
        }
        if (data === 'otherFilter') {
            setOtherFilter(!otherFilter);
        }
        if (data === 'rsdFilter') {
            setRsdFilter(!rsdFilter);
        }
        if (data === 'rbaFilter') {
            setRbaFilter(!rbaFilter);
        }
        if (data === 'rafFilter') {
            setRafFilter(!rafFilter);
        }
        if (data === 'dacFilter') {
            setDacFilter(!dacFilter);
        }
        if (data === 'dbfFilter') {
            setDbfFilter(!dbfFilter);
        }
        if (data === 'dbaFilter') {
            setDbaFilter(!dbaFilter);
        }
        if (data === 'dmaFilter') {
            setDmaFilter(!dmaFilter);
        }
        if (data === 'ditFilter') {
            setDitFilter(!ditFilter);
        }
        if (data === 'dseFilter') {
            setDseFilter(!dseFilter);
        }
        if (data === 'dhmFilter') {
            setDhmFilter(!dhmFilter);
        }
        if (data === 'fiveStarFilter') {
            setFiveStarFilter(!fiveStarFilter);
            setFourStarFilter(false);
            setThreeStarFilter(false);
            setTwoStarFilter(false);
            setOneStarFilter(false);
        }
        if (data === 'fourStarFilter') {
            setFiveStarFilter(false);
            setFourStarFilter(!fourStarFilter);
            setThreeStarFilter(false);
            setTwoStarFilter(false);
            setOneStarFilter(false);
        }
        if (data === 'threeStarFilter') {
            setFiveStarFilter(false);
            setFourStarFilter(false);
            setThreeStarFilter(!threeStarFilter);
            setTwoStarFilter(false);
            setOneStarFilter(false);
        }
        if (data === 'twoStarFilter') {
            setFiveStarFilter(false);
            setFourStarFilter(false);
            setThreeStarFilter(false);
            setTwoStarFilter(!twoStarFilter);
            setOneStarFilter(false);
        }
        if (data === 'oneStarFilter') {
            setFiveStarFilter(false);
            setFourStarFilter(false);
            setThreeStarFilter(false);
            setTwoStarFilter(false);
            setOneStarFilter(!oneStarFilter);
        }
    }

    useEffect(()=>{
        if (studentId === null) {
            navigate("/studentLogin")
        }

        refresh();
        return undefined;
    }, [hostnameFilter, sportFilter, studyFilter, hangoutFilter, otherFilter, rsdFilter, rbaFilter, rafFilter, dacFilter, dbfFilter, dbaFilter, dmaFilter, ditFilter, dseFilter, dhmFilter, fiveStarFilter, fourStarFilter, threeStarFilter, twoStarFilter, oneStarFilter])

    //Student attempt to join an activity, if already join, just alert message, else insert into database record under "activitystudents" collection
    function join(activityId) {
        const params = {
            activityId,
            studentId
        }

        axios.post(`${base_url}/api/joinActivity/`, params) //'http://localhost:3001/api/joinActivity/'
            .then(res => {
                console.log("res.data for joinActivity is -->", res.data);
                if(res.data === true){
                    alert("Activity Joined!")
                    refresh();
                }else{
                    alert("Activity has already been joined or reached maximum member capacity")
                }
            })
            .catch(err => {
                console.log(err)
            });

    }

    //Check whether there is record in activitiy collection in MongoDB database
    let activityOutput = null;
    if(activities.length > 0){
        activityOutput = activities.map(activity => {
            return (
                <Row key={activity._id}>
                    <Card  className="container text-center border-dark mb-1 fluid ms-2">
                        <div className="row">
                            <div className="col-3">
                                <Row className='d-flex justify-content-center'>
                                    <img className=' rounded-circle w-1 mt-3 p-0 border border-dark' src={activity.hostInfo.imgUrl} alt="" style={{ height: '50%', width: '50%', cursor : 'pointer' }} 
                                    onClick={() => viewStudent(activity.hostInfo.studentId)}   
                                    />
                                </Row>

                                {/*<button className='btn btn-primary me-3 mb-2' onClick={() => dispatch(addActivityIdForView(activity.activityId))}>
                                            <Link className='text-light text-decoration-none' to={'/activityDetails/' + activity.activityId}>
                                                More Details
                                            </Link>
                                        </button>  */}
                                
                                <Row className='m-0'>
                                    <p className='fw-bold mb-0' style={{ cursor: 'pointer' }} 
                                    onClick={() => {
                                        dispatch(addStudentIdForView(activity.hostInfo.studentId))
                                        navigate('/studentHome/viewStudent/' + activity.hostInfo.studentId)
                                    }}>{activity.hostInfo.fullName}</p>
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
                                        {/*<button className='btn btn-primary me-3' id={activity._id}>More Details</button>*/}

                                        <button className='btn btn-primary me-3 mb-2' onClick={() => dispatch(addActivityIdForView(activity.activityId))}> 
                                            <Link className='text-light text-decoration-none' to={'/activityDetails/' + activity.activityId}>
                                                More Details
                                            </Link>
                                        </button> 

                                        <button className='btn btn-success mb-2' onClick={() => join(activity.activityId)}>
                                                Join
                                           
                                        </button> 
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </Card>
                </Row>
            )
        })
    }else{
        activityOutput = (<p className='text-center h2'>No activities found ☹️</p>)
    }

    return (
        <div >
            <NavBar title={'Homepage'}/>
            {/*Content*/}
            <div className="container">
                <Row>
                    <Col xs={3} variant='primary' className="d-flex flex-column">
                        <Row className='mb-3'>
                            <p className='h3 fw-bold d-flex justify-content-center' style={{ fontWeight: '700' }}>Filter<FiFilter size="1.5em" /></p> 
                        </Row>

                        <Row>
                            <p className='h5 fw-bold d-flex justify-content-center' style={{ fontWeight: '700' }}>Filter by Name</p>
                        </Row>

                        <Row>
                            <Col className='d-flex justify-content-center px-0 mb-5'>
                                <input className="d-flex justify-content-center" type="text" onChange={findHostName} />
                            </Col>
                        </Row>

                        <Row>
                            <p className='h5 fw-bold d-flex justify-content-center' style={{ fontWeight: '700' }}>Activity Type</p>
                        </Row>
                        
                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={sportFilter} id="1" onChange={() => handleChange('sportFilter')}/>
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Sports
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={studyFilter} id="1" onChange={() => handleChange('studyFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Study
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={hangoutFilter} id="1" onChange={() => handleChange('hangoutFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Hangout
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0 mb-5'>
                                <input className="form-check-input" type="checkbox" value={otherFilter} id="1" onChange={() => handleChange('otherFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    Other
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <p className='h5 fw-bold d-flex justify-content-center' style={{ fontWeight: '700' }}>Programme</p>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={rsdFilter} id="1" onChange={() => handleChange('rsdFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">
                                    RSD
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={rbaFilter} id="1" onChange={() => handleChange('rbaFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">RBA</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={rafFilter} id="1" onChange={() => handleChange('rafFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">RAF</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={dacFilter} id="1" onChange={() => handleChange('dacFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">DAC</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={dbfFilter} id="1" onChange={() => handleChange('dbfFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">DBF</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={dbaFilter} id="1" onChange={() => handleChange('dbaFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">DBA</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={dmaFilter} id="1" onChange={() => handleChange('dmaFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">DMA</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={ditFilter} id="1" onChange={() => handleChange('ditFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">DIT</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" value={dseFilter} id="1" onChange={() => handleChange('dseFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">DSE</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0 mb-5'>
                                <input className="form-check-input" type="checkbox" value={dhmFilter} id="1" onChange={() => handleChange('dhmFilter')} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="1">DHM</label>
                            </Col>
                        </Row>

                        <Row>
                            <p className='h5 fw-bold d-flex justify-content-center' style={{ fontWeight: '700' }}>Host Rating</p>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" name="rating" id="flexRadioDefault1" value={fiveStarFilter} onChange={() => handleChange('fiveStarFilter')}
                                checked={fiveStarFilter}/>
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    5 star
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" name="rating" id="flexRadioDefault1" value={fourStarFilter} onChange={() => handleChange('fourStarFilter')} 
                                checked={fourStarFilter}/>
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    4 star &amp; up
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" name="rating" id="flexRadioDefault1" value={threeStarFilter} onChange={() => handleChange('threeStarFilter')}
                                    checked={threeStarFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    3 star &amp; up
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0'>
                                <input className="form-check-input" type="checkbox" name="rating" id="flexRadioDefault1" value={twoStarFilter} onChange={() => handleChange('twoStarFilter')}
                                    checked={twoStarFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    2 star &amp; up
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={5} className='d-flex justify-content-end px-0 mb-5'>
                                <input className="form-check-input" type="checkbox" name="rating" id="flexRadioDefault1" value={oneStarFilter} onChange={() => handleChange('oneStarFilter')}
                                    checked={oneStarFilter} />
                            </Col>
                            <Col xs={7} className='d-flex justify-content-start px-0'>
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    1 star &amp; up
                                </label>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={9} className='p-0'>
                        <div className='mb-3 w-75'>
                            <Button variant='alt-primary text-light me-3' onClick={() => {navigate('/studentHome/createActivity')}}>Create New Activity <AiOutlinePlusCircle size={'2em'} /></Button>

                            <Button variant='alt-primary text-light me-3' onClick={refresh}>Refresh <BiRefresh size={'2em'} /></Button>
                        </div>

                        <div className='mb-3 w-75'>
                            {activityOutput}
                        </div>
                            

                    </Col>
                </Row>
                
            </div>
        
        </div>
    )
}

/*
<img src={imgUrl} className='w-25 h-25 my-2' alt="logo" />
*/