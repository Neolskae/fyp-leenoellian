import React, { Component, useEffect, useState } from 'react'
import { Button, Row, Col, Container, Dropdown, ButtonGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import { removeStudentId } from '../../redux/feature'
import { addStudentIdForView } from '../../redux/feature'
import { base_url } from '../../helper/helper.js'

function NavBar({title}) {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [imgUrl, setImgUrl] = useState('a');
    const [fullName, setFullName] = useState('a');

    let state = useSelector((state) => {
        return state["app"]
    })

    let { studentId } = state;

    useEffect(() => {
        axios.get(`${base_url}/api/student/${studentId}`)
            .then(response => {
                setImgUrl(response.data[0].imgUrl);
                setFullName(response.data[0].fullName);
            }).catch((error) => {
                console.log(error)
            })
    }, []);

    const logout = () => {
        dispatch(removeStudentId());
        navigate('/');
    }

    const viewProfile = async() => {
        await dispatch(addStudentIdForView(studentId))
        navigate('/studentHome/viewStudent/' + studentId)
    }

    const activityDashboard = () => {
        navigate('/studentHome/activityDashboard');
    }
        
    return (
        <div className='bg-light border-bottom border-2 mb-3'>
            <Container>
                <Row>
                    <Col xs={3}>
                        <img src={'https://i.ibb.co/NT4pX07/home-logo.png'} className='my-2 btn' alt="logo" style={{ width: '300px', height: '70px' }}
                        onClick={()=>{
                            navigate('/studentHome')
                        }}/>
                    </Col>

                    <Col xs={8} className="d-flex align-items-center justify-content-center">
                        <p className='h2 d-flex justify-content-center '>{title}</p>
                    </Col>

                    <Col xs={1} variant="d-flex" className="justify-content-end">
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle split id="dropdown-split-basic" variant="white"> <img src={imgUrl} className='rounded-circle my-2 me-2' alt="studentPic" style={{ width: '50px', height: '50px' }} />{fullName}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={viewProfile}>View Profile</Dropdown.Item>  
                                <Dropdown.Item onClick={activityDashboard}>Activities Dashboard</Dropdown.Item>
                                <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>  
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default NavBar
