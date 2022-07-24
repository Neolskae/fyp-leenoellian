import React, { Component } from 'react'
import {useEffect} from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { removeAdminUsername } from '../../redux/feature.js'
import { MdHome, MdAddCircleOutline } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";

export default function AdminHome({ }) {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let state = useSelector((state) => {
        return state["app"]
    })

    let { adminUsername } = state;

    useEffect(() => {
        console.log("Running useEffect in admin Home")
        console.log("adminUsername -->", adminUsername)

        if (adminUsername === null) {
            navigate("/adminLogin")
        }
    });

    const logout = () => {
        dispatch(removeAdminUsername());
        console.log(adminUsername)
        navigate("/adminLogin")
    }

    return (
        <div>
            <div className='bg-alt-primary '>
                <div className="container flex-center">
                    <p className='h1 text-light Arial' style={{
                         fontWeight: 700
                    }}>Admin Home</p> 
                    <MdHome size="3em" color='white'/>
                </div>
            </div>

            <div className="flex-center mt-5">
                <p className='h5'>Login as {adminUsername}</p>
                
            </div>
            <div className="container">
                <div className="row mt-5">
                    <div className="col flex-center">
                        <button className='btn btn-alt-primary text-light w-50 d-flex align-self-center justify-content-center' onClick={() => navigate("/adminHome/addStudent")}><p className="h2">Add Student</p><MdAddCircleOutline size="2.2em" color='white' /></button>
                    </div>
                    
                    
                </div>
                <div className="row mt-5">
                    <div className="col flex-center">
                        <button className='btn btn-alt-primary text-light w-50 d-flex align-self-center justify-content-center' onClick={() => navigate("/adminHome/viewAllStudent")}><p className="h2">View All Student</p><IoMdEye size="2.5em" color='white' /></button>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col flex-center">
                        <button className='btn btn-alt-primary text-light w-50 d-flex align-self-center justify-content-center' onClick={logout}><p className="h2">Logout</p><IoLogOut size="2.2em" color='white' /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
