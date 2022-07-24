import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addStudentId } from '../redux/feature'
import { base_url } from '../helper/helper.js'

export default function StudentLogin({ }) {

    
    const { register, handleSubmit, resetField } = useForm();


    const [isVisible, setIsVisible] = useState(false);
    const transition = useTransition(isVisible, {
        from: { x: 0, y: 100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
        leave: { x: 0, y: 100, opacity: 0 }
    });
    let dispatch = useDispatch();

    let state = useSelector((state) => {
        return state["app"]
    })

    let { studentId } = state;

    useEffect(() => {
        // Update the document title using the browser API
        setIsVisible(value => true)
    });

    const onSubmit = async (data) => {
        const params = {
            studentId: data.studentId,
            studentPassword: data.studentPassword
        }
        
        if (!data) return {};
        const resp = axios.post(`${base_url}/api/student/auth`, params)
            .then(response => {
                if (response.data === true) {

                    alert("Access Granted");
                    dispatch(addStudentId( data.studentId ));
                    window.location.href = "/studentHome";
                } else {
                    alert("Access Denied")
                }
            })
            .catch((error) => {
                console.log(error);
            })

        resetField('studentId');
        resetField('studentPassword');
    }

    return (
        <div style={{ backgroundColor: 'rgb(207, 59, 202)' }}>
            {transition((style, item) =>
                item ?
                    <animated.div style={style} >
                        <div className="flex-center" style={{}}>
                            <img src={'https://i.ibb.co/VNDRgMq/main-logo.jpg'} alt="logo" style={{ marginLeft: 'auto', marginRight: 'auto', width: '300px', left: '0', right: '0', position: 'absolute', marginTop: '60px' }} />
                        </div>
                        <div className="flex-center">
                            <h1 className="comfortaa-font" style={{ fontSize: '60px', color: 'white', marginTop: '220px' }}>Student Activity Scheduling System</h1>
                        </div>

                    </animated.div> : ''
            )}

            {/*Form*/}
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="flex-center">

                    <p style={{ fontSize: '20px', color: 'black', marginTop: '60px' }}>Student ID</p>
                </div>

                <div className="flex-center">
                    <input {...register('studentId')} style={{ borderRadius: '50px', marginBottom: '20px', width: '250px', paddingLeft: '10px' }} placeholder="E.g. 2004988"></input>
                </div>

                <div className="flex-center">
                    <p style={{ fontSize: '20px', color: 'black', margin: 0 }}>Password</p>
                </div>

                <div className="flex-center">
                    <input {...register('studentPassword')} style={{ borderRadius: '50px', marginBottom: '20px', width: '250px', paddingLeft: '10px' }} type="password"></input>
                </div>

                <div className="flex-center">
                    <button style={{ backgroundColor: '#4DC230', color: 'white', width: '100px', marginBottom: '317px' }} >Login</button>
                </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Link to="/adminLogin">
                    <button style={{ backgroundColor: '#4DC230', color: 'white', width: '100px', marginRight: '20px' }} >Admin Login</button>
                </Link>
            </div>

        </div>
    )
}




