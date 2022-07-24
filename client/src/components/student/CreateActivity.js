import React, { useState, useEffect } from 'react'
import NavBar from './NavBar.js';
import { Button, Row, Col, Form, FormCheck, NavItem } from 'react-bootstrap'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { roundToTwo, base_url } from '../../helper/helper.js'

export default function CreateActivity() {
   let navigate = useNavigate();

   let state = useSelector((state) => {
      return state["app"]
   })

   let { studentId } = state;

   const [activityName, setActivityName] = useState('');
   const [activityDescription, setActivityDescription] = useState('');
   const [startDateTime, setStartDateTime] = useState(null);
   const [endDateTime, setEndDateTime] = useState(null);
   const [activityType, setActivityType] = useState(null);
   const [maxMember, setMaxMember] = useState(null);

   console.log("typeof maxMember STARTING--->", typeof maxMember)

   const getData = (event) => {
      console.log("val.target.value -->", event)

      if (event.target.id ==='activityName'){
         setActivityName(event.target.value);
      } else if(event.target.id === 'activityDescription'){ 
         setActivityDescription(event.target.value);
      } else if (event.target.id === 'startDateTime') {        
         setStartDateTime(event.target.value);         
      } else if (event.target.id === 'endDateTime') {
         setEndDateTime(event.target.value);
      } else if (event.target.id === 'sport') {
         setActivityType('Sport');
      }else if (event.target.id === 'study') {
         setActivityType('Study');
      } else if (event.target.id === 'hangout') {
         setActivityType('Hangout');
      }else if (event.target.id === 'other') {
         setActivityType('Other');
      } else if (event.target.id === 'maxMember') {
         setMaxMember(event.target.value);
         console.log("typeof maxMember--->", typeof maxMember)
      }
   }

   const submit = () => {
      
      if (activityName===''){
         alert('Please enter activity name')
      }else if (isNaN(maxMember)){
         alert('Max member must be a number')
      } else if (endDateTime === null || startDateTime === null){
         alert('Please pick Start DateTime and End DateTime')
      }else if (endDateTime<=startDateTime){
         alert('Start DateTime must be before End DateTime')
      } else if (activityType=== null){
         alert('Please choose an activity type')
      } else if (maxMember === null){
         alert('Max member cannot be empty')
         console.log(typeof maxMember)
      } else if (maxMember<=1){
         alert('Max Member must be more than one')
      }else{
         const params = {
            activityName,
            activityDescription,
            startDateTime,
            endDateTime,
            activityType,
            maxMember,
            studentId
         }

         let inputYear = startDateTime.slice(0, 4);
         let inputMonth = startDateTime.slice(5, 7);
         let inputDay = startDateTime.slice(8, 10);
         let inputHour = startDateTime.slice(11, 13);
         let inputMinute = startDateTime.slice(14);

         let currentYear = parseInt(new Date().getFullYear())

         let currentMonth = new Date().getMonth() + 1;
         if (currentMonth<10){
            currentMonth = `0${currentMonth}`
         }

         let currentDay = parseInt(new Date().getDate())
         if (currentDay < 10) {
            currentDay = `0${currentDay}`
         }

         let currentHour = parseInt(new Date().getHours())
         if (currentHour < 10) {
            currentHour = `0${currentHour}`
         }

         let currentMinute = parseInt(new Date().getMinutes())
         if (currentMinute < 10) {
            currentMinute = `0${currentMinute}`
         }

         let combineInput = null;
         let combineCurrent = null;

         combineInput = (`${inputYear}${inputMonth}${inputDay}${inputHour}${inputMinute}`)
         combineCurrent = (`${currentYear}${currentMonth}${currentDay}${currentHour}${currentMinute}`)
         
         console.log("combineInput-->", combineInput)
         console.log("combineCurrent-->", combineCurrent)
         console.log(parseInt(new Date().getDate()))

         if (parseInt(combineInput) <= parseInt(combineCurrent)) {
            alert('Start Date Time cannot be lesser than or equal to current time')
         }else{
            axios.post(`${base_url}/api/createActivity/`, params)     //'http://localhost:3001/api/createActivity/'
               .then(res => {
                  console.log("res is -->", res.data);
                  alert('Activity Successfully Created')
                  navigate('/studentHome')
               })
               .catch(err => {
                  console.log(err)
               })
         }
      }
   }

   return (
      <div>
         <NavBar title={'Create Activity'} />
         <div className="container w-50">

            <div className="mb-4">
               <p className='h4 p-0 fw-bold' >Activity Name</p>
               <input type="text" className="form-control" id='activityName'
                  onChange={getData}/>
            </div>

            <div className="mb-4">
               <p className='h4 p-0 fw-bold' >Activity Description</p>
               <textarea className="form-control" style={{ resize: 'none', height: '200px' }} id='activityDescription' onChange={getData}></textarea>
            </div>

            <div className="mb-4">
               <p className='h4 p-0 fw-bold' >Start DateTime</p>
               <input type="datetime-local" id="startDateTime" name="duration"
                  onChange={getData} />
            </div>
            
            <div className="mb-4">
               <p className='h4 p-0 fw-bold' >End DateTime</p>
               <input type="datetime-local" id="endDateTime" name="duration"
                  onChange={getData} />
            </div>

            <p className='h4 p-0 fw-bold' >Activity Type</p>
            <div className="input-group border border-dark rounded w-25 mb-4">
               <div className='d-flex flex-column p-3'>
                  <form>
                     <input type='radio' id="sport" name="activityType" value="activityType"
                        onChange={getData}/>
                     <label htmlFor="sport">Sport</label><br />

                     <input type='radio' id="study" name="activityType" value="activityType"
                        onChange={getData} />
                     <label htmlFor="study">Study</label><br />

                     <input type='radio' id="hangout" name="activityType" value="activityType"
                        onChange={getData} />
                     <label htmlFor="hangout">Hangout</label><br />

                     <input type='radio' id="other" name="activityType" value="activityType"
                        onChange={getData} />
                     <label htmlFor="other">Other</label><br />
                  </form>
               </div>
            </div>

            <div className="mb-4">
               <p className='h4 p-0 fw-bold' >Maximum number of members</p>
               <input type="text" className="form-control w-25 border border-dark" aria-label="Username" aria-describedby="basic-addon1" onChange={getData} id='maxMember'/>
            </div>

            <button className='btn btn-success me-3' onClick={submit}>Submit</button>

            <button className='btn btn-danger' onClick={() => { navigate('/studentHome')}}>Cancel</button>

         </div>
      </div>
   )
}
