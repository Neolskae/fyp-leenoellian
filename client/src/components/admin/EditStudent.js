import React, { useEffect, useState, useRef } from 'react';
import { MdHome } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { base_url } from '../../helper/helper.js'

export default function EditStudent() {
    const form = useRef();
    let navigate = useNavigate();
    let dispatch = useDispatch();

    const [studentId, setStudentId] = useState('a');
    const [studentPassword, setStudentPassword] = useState('a');
    const [fullName, setFullName] = useState('a');
    const [email, setEmail] = useState('a');
    const [programme, setProgramme] = useState('a');
    const [status, setStatus] = useState('a');
    const [imgUrl, setImgUrl] = useState('a');
    const [imgUrl2, setImgUrl2] = useState('a');

    let state = useSelector((state) => {
        return state["app"]
    })

    let { studentIdForEdit } = state;

    useEffect(() => {

        axios.get(`${base_url}/api/student/${studentIdForEdit}`)
            .then(response => {
                setImgUrl(response.data[0].imgUrl);
                setImgUrl2(response.data[0].imgUrl);
                setStudentId(response.data[0].studentId);
                setStudentPassword(response.data[0].studentPassword);
                setFullName(response.data[0].fullName);
                setEmail(response.data[0].email);
                setProgramme(String(response.data[0].programme));
                setStatus(response.data[0].status);
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const submit = (event) => {
        event.preventDefault();

        const body = {
            studentId,
            studentPassword,
            fullName,
            email,
            programme,
            status,
            imgUrl
        }

        axios.post(`${base_url}/api/student/${studentId}`, body) //--Update one student
            .then(res => {
                console.log("res.data -->",res.data)
                if (res.data === true) {
                    alert("Student Updated Successfully")
                    
                    // START EMAIL JS   DONT FORGET TO UNCOMMENT THIS

                    emailjs.sendForm('service_9hjwd41', 'template_sepw6ak', form.current, '42cggYjSf9aAwyV-W')
                        .then((result) => {
                            console.log(result.text);
                        }, (error) => {
                            console.log(error.text);
                        });

                    // END EMAIL JS
                    
                    navigate("/adminHome/viewAllStudent");
                } else {
                    alert("Error while updating student")
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <div className='bg-alt-primary mb-5 pb-3'>
                <a className="d-inline btn position-absolute" href="/adminHome"><MdHome size="3em" color='white' /></a>
                <div className='text-center pt-1'>
                    <p className='h1 text-light Arial d-inline me-5 ' style={{ fontWeight: 700 }}>Edit Student</p>
                </div>
            </div>
            <form ref={form} onSubmit={submit}>
                <div className="container">
                    <div className="row justify-content-center mb-3">
                        <img src={imgUrl} alt="" className="w-25 border border-dark img-thumbnail" />
                    </div>

                    {/*Student ID */}
                    <div className="row mb-2">
                        <div className="col-5 d-flex justify-content-end">
                            <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3 pt-1">Student ID</p>
                        </div>
                        <div className="col-7 d-flex justify-content-start rounded">
                            <input className="form-control" value={studentId} disabled name="studentId" style={{ marginBottom: '20px', width: '250px', paddingLeft: '10px' }}
                            ></input>
                        </div>
                    </div>

                    {/*Password*/}
                    <div className="row mb-2">
                        <div className="col-5 d-flex justify-content-end">
                            <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3 pt-1">Password</p>
                        </div>
                        <div className="col-7 d-flex justify-content-start rounded">
                            <input className="form-control" value={studentPassword} name="studentPassword" style={{ marginBottom: '20px', width: '250px', paddingLeft: '10px' }}
                                onChange={event => {
                                    const { value } = event.target;
                                    setStudentPassword(value);
                                }}></input>
                        </div>
                    </div>

                    {/*Full Name*/}
                    <div className="row mb-2">
                        <div className="col-5 d-flex justify-content-end">
                            <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3 pt-1">Full Name</p>
                        </div>
                        <div className="col-7 d-flex justify-content-start rounded">
                            <input className="form-control" value={fullName} name="fullName" style={{ marginBottom: '20px', width: '250px', paddingLeft: '10px' }}
                                onChange={event => {
                                    const { value } = event.target;
                                    setFullName(value);
                                }}></input>
                        </div>
                    </div>

                    {/*Email*/}
                    <div className="row mb-2">
                        <div className="col-5 d-flex justify-content-end">
                            <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3 pt-1">Email</p>
                        </div>
                        <div className="col-7 d-flex justify-content-start rounded">
                            <input className="form-control w-50" value={email} name="email" style={{ marginBottom: '20px', width: '250px', paddingLeft: '10px' }}
                                onChange={event => {
                                    const { value } = event.target;
                                    setEmail(value);
                                }}></input>
                        </div>
                    </div>

                    {/*Programme*/}
                    <div className="row mb-4">
                        <div className="col-5 d-flex justify-content-end">
                            <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3">Programme</p>
                        </div>
                        <div className="col-7 d-flex justify-content-start">
                            <select key={programme} defaultValue={programme} name="programme" className="form-select rounded" aria-label="Default select example"
                                onChange={event => {
                                    const { value } = event.target;
                                    setProgramme(value);
                                }}>
                                <option value={"RSD"}>Bachelor Degree of Software Systems Development</option>
                                <option value={"RBA"}>Bachelor Degree of Business Administration</option>
                                <option value="RAF">Bachelor Degree of Accounting &amp; Finance</option>
                                <option value="DAC">Diploma in Accounting</option>
                                <option value="DBF">Diploma in Banking and Finance</option>
                                <option value="DBA">Diploma in Business Administration</option>
                                <option value="DMA">Diploma in Marketing</option>
                                <option value="DIT">Diploma in Information Technology</option>
                                <option value="DSE">Diploma in Software Engineering</option>
                                <option value="DHM">Diploma in Hotel Management</option>
                            </select>
                        </div>
                    </div>

                    {/*Status*/}
                    <div className="row mb-4">
                        <div className="col-5 d-flex justify-content-end">
                            <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3">Status</p>
                        </div>
                        <div className="col-7 d-flex justify-content-start">
                            <select key={status} defaultValue={status} name="status" className="form-select rounded w-50" aria-label="Default select example"
                                onChange={event => {
                                    const { value } = event.target;
                                    setStatus(value);
                                }}>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/*Image Url*/}
                    <div className="row mb-2">
                        <div className="col-5 d-flex justify-content-end">
                            <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3 pt-1">Image Url</p>
                        </div>
                        <div className="col-7 d-flex justify-content-start rounded">
                            <input className="form-control w-50" value={imgUrl2} name="imgUrl" style={{ marginBottom: '20px', width: '250px', paddingLeft: '10px' }}
                                onChange={event => {
                                    const { value } = event.target;
                                    setImgUrl2(value);
                                }}></input>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-5 d-flex justify-content-end">

                        </div>
                        <div className="col-7 d-flex justify-content-start rounded">
                            <button className="btn btn-success text-light me-3">Submit</button>

                            <Link to={'/adminHome/viewAllStudent'}>
                                <button className="btn btn-danger text-light">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </form>
            {/*studentId, password, fullName, email, programme, ratingReceived, accumulatedRating, status, imgUrl*/}

        </div>
    )
}
