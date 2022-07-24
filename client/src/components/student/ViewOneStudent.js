import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement } from 'chart.js'
import axios from 'axios';
import { AiFillStar } from "react-icons/ai";
import { useSelector } from 'react-redux';
import { base_url, roundToTwo } from '../../helper/helper.js'
import NavBar from './NavBar';

Chart.register(ArcElement)

export default function ViewOneStudent() {

    //Student Details
    const [studentId, setStudentId] = useState('a');
    const [fullName, setFullName] = useState('a');
    const [email, setEmail] = useState('a');
    const [programme, setProgramme] = useState('a');
    const [status, setStatus] = useState('a');
    const [imgUrl, setImgUrl] = useState('a');
    const [ratingReceived, setRatingReceived] = useState('a');
    const [accumulatedRating, setAccumulatedRating] = useState('a');

    //Activity History
    const [sportCount, setSportCount] = useState(0)
    const [studyCount, setStudyCount] = useState(0)
    const [hangoutCount, setHangoutCount] = useState(0)
    const [otherCount, setOtherCount] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    let state = useSelector((state) => {
        return state["app"]
    })

    let { studentIdForView } = state;

    let sportsColour = 'rgb(255, 99, 132)'
    let studyColour = 'rgb(54, 162, 235)'
    let hangoutColour = 'rgb(255, 205, 86)'
    let otherColour = 'rgb(51, 204, 51)'

    const data = {
        labels: [
            'Sports',
            'Study',
            'Hangout',
            'Others'
        ],
        datasets: [{
            label: 'Activity History',
            data: [sportCount, studyCount, hangoutCount, otherCount],
            backgroundColor: [
                sportsColour,
                studyColour,
                hangoutColour,
                otherColour
            ],
            hoverOffset: 4,
            spacing: 0
        }]
    };

    useEffect(() => {
        console.log("studentIdForView-->",studentIdForView)
        //Get Student Details
        axios.get(`${base_url}/api/student/${studentIdForView}`)
            .then(response => {
                console.log("response.data in Get Student Details-->",response.data[0])
                setRatingReceived(response.data[0].ratingReceived)
                setAccumulatedRating(response.data[0].accumulatedRating)
                setImgUrl(response.data[0].imgUrl);
                setStudentId(response.data[0].studentId);          
                setFullName(response.data[0].fullName);
                setEmail(response.data[0].email);
                setProgramme(String(response.data[0].programme));
                setStatus(response.data[0].status);
            })
            .catch((error) => {
                console.log(error)
            })

        //Get Activity History for Chart
        axios.get(`${base_url}/api/getActivityHistory/${studentIdForView}`)
            .then(response => {
                console.log("response.data in getActivityHistory",response.data)
                setSportCount(response.data[0]);
                setStudyCount(response.data[1]);
                setHangoutCount(response.data[2]);
                setOtherCount(response.data[3]);
                setTotalCount(response.data[4]);
            })
            .catch((error) => {
                console.log(error)
            })

    },[] )

    let sportPercent = null;
    let studyPercent = null;
    let hangoutPercent = null;
    let otherPercent = null;

    if(totalCount===0){
        sportPercent = 0;
        studyPercent = 0;
        hangoutPercent = 0;
        otherPercent = 0;
    }else{
        sportPercent = roundToTwo(sportCount / totalCount * 100)
        studyPercent = roundToTwo(studyCount / totalCount * 100)
        hangoutPercent = roundToTwo(hangoutCount / totalCount * 100)
        otherPercent = roundToTwo(otherCount / totalCount * 100)
    }
    
    let ChartOutput = null
    if(totalCount > 0) {
        ChartOutput = 
        (
            <div className='container w-50'>
                <Doughnut data={data} />
            </div>
        )
    }else{
        ChartOutput = 
        (
            <div>
                
                <div className='row' style={{height : '100px'}}></div>
                <div className='row'><p className='text-center h2'>Chart Not Available☹️</p></div>
                <div className='row' style={{ height: '100px' }}></div>
            </div>
        )
    }


    return (
        <div>

            <NavBar title={'Student Details'} />
            
            <div className="row">
                
                <div className="col-2 mt-5 "></div>

                {/*---------------------------------------------First Column (Student Details)------------------------------------------- */}
                <div className="col-4 mt-5 text-center">
                    <div className="row justify-content-center">
                        
                        <img src={imgUrl} alt="" className='w-50 rounded-circle' />
                    </div>
                    <div className="row">                 
                        <p className='fw-bold h2'>{fullName}</p>
                    </div>
                    <div className="row">
                        <p>{ratingReceived === 0 ? 'No ratings yet' : String(roundToTwo(accumulatedRating / ratingReceived))} {ratingReceived === 0 ? '' : < AiFillStar />}</p>
                    </div>

                    <div className="row">
                        <div className="col text-end p-0">
                            <p className='fw-bold m-0 h4'>Programme :</p>
                            <p className='fw-bold m-0 h4'>Number of Ratings :</p>
                            <p className='fw-bold m-0 h4'>Status :</p>
                        </div>
                        <div className="col text-start py-0 px-1">
                            <p className='m-0 h4'>{programme}</p>
                            <p className='m-0 h4'>{ratingReceived}</p>
                            <p className='m-0 h4'>{status===true ? 'Active' : 'False'}</p>
                        </div>
                    </div>
                    
                </div>

                {/*---------------------------------------------Second Column (Activity History)------------------------------------------- */}
                <div className="col-4 mt-5 ">
                    {ChartOutput}
                    
                    <p className='fw-bold text-center mt-5'>Activity History</p>

                    <div className="row">
                        <div className="col-4 d-flex flex-row-reverse">
                            <div className="rounded py-3 " style={{ background: sportsColour, width: '10px', height: '1em' }}></div>
                        </div>

                        <div className="col-4">
                            <h3 className='text-md justify-content-start'>Sports</h3>
                        </div>
                        <div className="col-4">
                            <h3 className='text-md'>{sportPercent}%</h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-4 d-flex flex-row-reverse">
                            <div className="rounded py-3 " style={{ background: studyColour, width: '10px', height: '1em' }}></div>
                        </div>
                        <div className="col-4">
                            <h3 className='text-md justify-content-start'>Study</h3>
                        </div>
                        <div className="col-4">
                            <h3 className='text-md'>{studyPercent}%</h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-4 d-flex flex-row-reverse">
                            <div className="rounded py-3 " style={{ background: hangoutColour, width: '10px', height: '1em' }}></div>
                        </div>
                        <div className="col-4">
                            <h3 className='text-md justify-content-start'>Hangout</h3>
                        </div>
                        <div className="col-4">
                            <h3 className='text-md'>{hangoutPercent}%</h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-4 d-flex flex-row-reverse">
                            <div className="rounded py-3 " style={{ background: otherColour, width: '10px', height: '1em' }}></div>
                        </div>
                        <div className="col-4">
                            <h3 className='text-md justify-content-start'>Other</h3>
                        </div>
                        <div className="col-4">
                            <h3 className='text-md'>{otherPercent}%</h3>
                        </div>
                    </div>
                    
                </div>

                <div className="col-2 mt-5 "></div>
                    
            </div>
            
        </div>
    )
}

/**
 * <p>{ratingReceived === 0 ? 'No ratings yet' :  String(accumulatedRating /ratingReceived)}</p>

 */