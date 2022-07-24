import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RiEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addStudentIdForEdit } from '../../redux/feature'
import { AiFillStar } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { roundToTwo, base_url } from '../../helper/helper.js'
import ReactTooltip from 'react-tooltip'

export default function ViewStudent() {
    //Tooltip
    const [tooltip, showTooltip] = useState(true);

    let [students, setStudents] = useState([]);
    let dispatch = useDispatch();
    let [studentId, setStudentId] = useState('');

    useEffect(() => {
        if(studentId===''){
            axios.get(`${base_url}/api/students/`)
                .then(response => {
                    setStudents(response.data);
                })
                .catch((error) => {
                    console.log(error)
                })
        }else{
            axios.get(`${base_url}/api/viewStudent/${studentId}`)
                .then(response => {
                    setStudents(response.data);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [studentId])

    const editStudent = (studentIdForEdit) =>{
        dispatch(addStudentIdForEdit(studentIdForEdit));
    }

    function deleteStudent(studentId, fullName, programme) {
        if (window.confirm(`Are you sure to delete student with following details?\n
                            Student ID : ${studentId}\n
                            Name : ${fullName}\n
                            Programme : ${programme}`)) {
            axios.delete(`${base_url}/api/viewStudent/${studentId}` )
                .then(response=>{
                    if(response.data===true){
                        alert('Student Successfully delete')
                        axios.get(`${base_url}/api/students`)
                            .then(response => {

                                setStudents(response.data);

                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    }else{
                        alert('Error while deleting student')
                    }
                }).catch((error) => {
                    console.log(error)
                })
        } else {
            //If user press cancel, then do nothing
        }
    }

    //Check whether there is record in student collection in MongoDB database
    let studentOutput = null;
    if(students.length>0){
        console.log("Running if statement", students.length);
        studentOutput = students.map(student => {
            return (
                <div key={student.studentId} className="container text-center card border-dark mb-1 w-50">
                    <div className="row">
                        {/*Student Image*/}
                        <div className="col-lg-2 col-4 d-flex align-items-center justify-content-start">
                            <img className=' img-thumbnail rounded-circle w-1 border border-dark' src={student.imgUrl} alt="" style={{ minHeight: '20%', minWidth: '20%'}}/>
                            {student.status === true ?
                                <div data-tip data-for='active' className="alert border bg-success rounded-circle" style={{ marginLeft: '-60px', minWidth: '1', height: '1px', bottom: '50px', left: '20px' }} role="alert" 
                                onMouseEnter={() => showTooltip(true)}
                                onMouseLeave={() => {
                                    showTooltip(false);
                                    setTimeout(() => showTooltip(true), 50);
                                }}>
                                
                                {tooltip && <ReactTooltip id='active' type='success' effect="solid">
                                    <span>Active</span>
                                </ReactTooltip>}

                                </div>
                                :
                                <div data-tip data-for='inactive' className="alert border bg-danger rounded-circle" style={{ marginLeft: '-60px', width: '1px', height: '1px', bottom: '50px', left: '20px' }} role="alert"
                                onMouseEnter={() => showTooltip(true)}
                                onMouseLeave={() => {
                                    showTooltip(false);
                                    setTimeout(() => showTooltip(true), 50);
                                }}>

                                {tooltip && <ReactTooltip id='inactive' type='error' effect="solid">
                                    <span>Inactive</span>
                                </ReactTooltip>}

                                </div>
                            }
                        </div>

                        {/*Student Info*/}
                        <div className="col-lg-2 col-4 text-end mt-2 ">
                            <p className='fw-bold'>Name :</p>
                            <p className='fw-bold'>Student ID :</p>
                            <p className='fw-bold d-none d-sm-block'>Programme :</p>
                            <p className='fw-bold d-none d-sm-block'>Ratings :</p>
                        </div>

                        <div className="col-lg-6 col-4 text-start mt-2 ">
                            <p>{student.fullName}</p>
                            <p>{student.studentId}</p>
                            <p className='d-none d-sm-block'>{student.programme}</p>
                            <p className='d-none d-sm-block'>{student.ratingReceived === 0 ? 'No ratings yet' : roundToTwo(student.accumulatedRating / student.ratingReceived)} {student.ratingReceived === 0 ? '' : < AiFillStar />}</p>
                        </div>
                        <div className="col-lg-1 col-6 text-end mt-2 p-0">

                            <button className='me-1 text-light btn btn-primary' data-tip data-for='editStudent' onClick={() => editStudent(student.studentId)}
                                onMouseEnter={() => showTooltip(true)}
                                onMouseLeave={() => {
                                    showTooltip(false);
                                    setTimeout(() => showTooltip(true), 0);
                                }}>
                                
                                <Link to={'/editStudent/' + student.studentId}>
                                    <RiEditFill size="2em" color='white' /> 
                                </Link>
                                
                            </button>
                            {tooltip && <ReactTooltip id='editStudent' type='info' effect="solid">
                                <span>Edit Student Record</span>
                            </ReactTooltip>}
                        </div>

                        <div className="col-lg-1 col-6 text-end mt-2 p-0">

                            <button className='me-2 text-light btn btn-danger' data-tip data-for='deleteStudent' onClick={() => deleteStudent(student.studentId, student.fullName, student.programme)}
                                onMouseEnter={() => showTooltip(true)}
                                onMouseLeave={() => {
                                    showTooltip(false);
                                    setTimeout(() => showTooltip(true), 0);
                                }}>
                                <MdDelete size="2em" color='white' />
                            </button>

                            {tooltip && <ReactTooltip id='deleteStudent' type='error' effect="solid">
                                <span>Delete Student Record</span>
                            </ReactTooltip>}
                        </div>
                    </div>
                </div>)
        }) 
    }else{
        console.log("Running else statement", students.length);
        studentOutput = (<div className="container text-center mb-1 w-50 mt-5 h5">No student Record found</div>)
    }

    return (
        <div>
            <div className='bg-alt-primary mb-5 pb-3'>
                <a className="d-inline btn position-absolute" href="/adminHome"><MdHome size="3em" color='white' /></a>
                <div className='text-center pt-1'>
                    <p className='h1 text-light Arial d-inline me-5 ' style={{ fontWeight: 700 }}>View All Student</p>
                    
                </div>
            </div>

            <div className="text-center mb-3 " >
                <input type="text" placeholder={"Search Student ID"} className="w-25 me-3" 
                onChange={event => {
                    const { value } = event.target;
                    setStudentId(value);
                }} />
                <BsSearch />
            </div>

            {studentOutput}
            
        </div>
    )
}
