import React, { Component, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { addAdminUsername } from '../redux/feature'
import { base_url } from '../helper/helper.js'

export default function AdminLogin({ }) {
    const { register, handleSubmit, resetField } = useForm();
    let dispatch = useDispatch();
    let navigate = useNavigate();

    useEffect(()=>{
        //console.log(adminUsername)
    })
    
    const onSubmit = async (data) => {
        
        const params = {
            adminUsername: data.adminUsername,
            adminPassword: data.adminPassword
        }

        if (!data) return {};
        const resp = axios.post(`${base_url}/api/admin/auth`, params)
            .then(response => {
                if(response.data===true){
                    alert("Access Granted");
                    dispatch(addAdminUsername(data.adminUsername));
                    navigate("/adminHome");
                }else{
                    alert("Access Denied")
                }
            })
            .catch((error) => {
                console.log(error);
            })

        resetField('adminUsername');
        resetField('adminPassword');
    }
    
    //Get State Data from Store
    let state = useSelector((state)=>{
        return state["app"]
    })

    let {adminUsername} = state;
    
    return (
        <div style={{ backgroundColor: 'rgb(207, 59, 202)' }}>

            <div className="flex-center">
                <h1 className="comfortaa-font" style={{ fontSize: '60px', color: 'white', marginTop: '200px' }}>Admin Login</h1>
            </div>
            <div className="flex-center">
                <p className="comfortaa-font" style={{ fontSize: '20px', color: 'white' }}>Unauthorized access is strictly prohibited!</p>
            </div>

            {/*Form*/}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex-center">
                    <p style={{ fontSize: '20px', color: 'black', margin: 0 }}>Username</p>
                </div>
                {/*Username*/}
                <div className="flex-center">
                    <input {...register('adminUsername')} style={{ borderRadius: '50px', marginBottom: '20px', width: '250px', paddingLeft: '10px' }}></input>
                </div>
                <div className="flex-center">
                    <p style={{ fontSize: '20px', color: 'black', margin: 0 }}>Password</p>
                </div>
                {/*Password*/}
                <div className="flex-center">
                    <input {...register('adminPassword')} style={{ borderRadius: '50px', marginBottom: '20px', width: '250px', paddingLeft: '10px' }} type="password"></input>
                </div>

                <div className="flex-center">
                    <button style={{ backgroundColor: '#4DC230', color: 'white', width: '100px', marginBottom: '367px' }} >Login</button>
                </div>
            </form>

            {/*Redirect to Student Login*/}
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Link to="/">
                    <button style={{ backgroundColor: '#4DC230', color: 'white', width: '100px', marginRight: '20px' }} >Student Login</button>
                </Link>
            </div>

        </div>
    )
}
