import './App.css';
import './css/main.min.css';
import './css/font.css';
//General Components
import StudentLogin from './components/StudentLogin.js';
import AdminLogin from './components/AdminLogin.js';

//Student Components
import StudentHome from './components/student/StudentHome.js';
import ViewOneStudent from './components/student/ViewOneStudent';
import CreateActivity from './components/student/CreateActivity';
import ActivityDetails from './components/student/ActivityDetails';
import ActivityDashboard from './components/student/ActivityDashboard';
import ActivityConfirmation from './components/student/ActivityConfirmation';
import RatingPage from './components/student/RatingPage';

//Admin Components
import AdminHome from './components/admin/AdminHome.js';
import AddStudent from './components/admin/AddStudent.js';
import ViewAllStudent from './components/admin/ViewAllStudent';
import EditStudent from './components/admin/EditStudent';
import React, { Component, useState, useEffect, createContext, useContext } from 'react'
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import store from "./redux/store.js";



export default function App() {
    
    return (
        <Router>
            <Provider store={store}>
                <Routes>
                    {/*General Components */}
                    <Route path="/" element={<StudentLogin/>} />
                    <Route path="/adminLogin" element={<AdminLogin/>} />

                    {/*Admin Components */}
                    <Route path="/adminHome" element={<AdminHome/>} />
                    <Route path="/adminHome/addStudent" element={<AddStudent/>} />
                    <Route path="/adminHome/viewAllStudent" element={<ViewAllStudent/>} />
                    <Route path="/editStudent/:id" element={<EditStudent/>} />  

                    {/*Student Components */}
                    <Route path="/studentHome" element={<StudentHome/>} />
                    <Route path="/studentHome/createActivity" element={<CreateActivity/>} /> 
                    <Route path="/activityDetails/:activityId" element={<ActivityDetails/>} /> 
                    <Route path="/studentHome/activityDashboard" element={<ActivityDashboard />} /> 
                    <Route path="/activityConfirmation/:activityId" element={<ActivityConfirmation />} /> 
                    <Route path="/ratingPage/:activityId" element={<RatingPage />} />
                    <Route path="/studentHome/viewStudent/:studentId" element={<ViewOneStudent />} />
                            
                </Routes>
            </Provider>
        </Router>
    );
}

/*
                           
                        
*/
                   
