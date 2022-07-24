import React, { useState, useRef ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { MdHome} from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { base_url } from '../../helper/helper.js'

export default function AddStudent() {
    const form = useRef();
    let navigate = useNavigate();
    const [studentId, setStudentId] = useState();
    const [studentPassword, setStudentPassword] = useState();
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState();
    const [programme, setProgramme] = useState("RSD");
    const [imgUrl, setImgUrl] = useState();

    let state = useSelector((state) => {
        return state["app"]
    })

    let { adminUsername } = state;

    useEffect(() => {
        if (adminUsername === null) {
            navigate("/adminLogin")
        }
    });

    const submit = (event) => {
        event.preventDefault();

        const params = {
            studentId, 
            studentPassword,
            fullName,
            email,
            programme,
            imgUrl
        }

        axios.post(`${base_url}/api/student`, params)
            .then(res => {
                if (res.data === true) {
                    alert("Student Added Successfully")
                    emailjs.sendForm('service_9hjwd41', 'template_5b292i6', form.current, '42cggYjSf9aAwyV-W')
                        .then((result) => {
                            console.log(result.text);
                        }, (error) => {
                            console.log(error.text);
                        });
                    navigate("/adminHome");
                } else {
                    alert("Error while adding student, try insert a unique Student ID")
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <div className='bg-alt-primary mb-5 pb-3'>
                <a className="d-inline btn position-absolute" href="/adminHome"><MdHome size="3em" color='white' /></a>
                <div className='text-center pt-1'>
                    <p className='h1 text-light Arial d-inline me-5 ' style={{ fontWeight: 700 }}>Add Student</p>
                </div>
            </div>

            <div className="container h-100">
                <div className="row">
                    <div className="col text-center w-50">
                        <p className="h3">Image Preview</p>
                        <div className="col border border-dark text-center" style={{minHeight : '250px'}}>
                            <img src={imgUrl} alt="" className="img-fluid img-thumbnail"/>
                        </div>
                    </div>
                    <div className="col">
                        {/*Form*/}
                        <form ref={form} onSubmit={submit}>
                            {/*Student ID*/}
                            <div className="row mb-2">
                                <div className="col-5 d-flex justify-content-end">
                                    <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3">Student ID</p>
                                </div>
                                <div className="col-7 d-flex justify-content-start rounded">
                                    <input name="studentId" style={{ marginBottom: '20px', width: '250px', paddingLeft: '10px' }}
                                        onChange={event => {
                                            const { value } = event.target;
                                            setStudentId(value);
                                        }}></input>
                                </div>
                            </div>

                            {/*Password*/}
                            <div className="row mb-2">
                                <div className="col-5 d-flex justify-content-end">
                                    <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3">Password</p>
                                </div>
                                <div className="col-7 d-flex justify-content-start rounded">
                                    <input name="password" style={{ marginBottom: '20px', width: '250px', paddingLeft: '10px' }}
                                        onChange={event => {
                                            const { value } = event.target;
                                            setStudentPassword(value);
                                        }}></input>
                                </div>
                            </div>

                            {/*Full Name*/}
                            <div className="row mb-2">
                                <div className="col-5 d-flex justify-content-end">
                                    <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3">Full Name</p>
                                </div>
                                <div className="col-7 d-flex justify-content-start rounded">
                                    <input name="fullName" style={{ marginBottom: '20px', width: '250px', paddingLeft: '10px' }}
                                        onChange={event => {
                                            const { value } = event.target;
                                            setFullName(value);
                                        }}></input>
                                </div>
                            </div>

                            {/*Email*/}
                            <div className="row mb-2">
                                <div className="col-5 d-flex justify-content-end">
                                    <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3">Email</p>
                                </div>
                                <div className="col-7 d-flex justify-content-start rounded">
                                    <input name="email" style={{ marginBottom: '20px', width: '350px', paddingLeft: '10px' }}
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
                                    <select defaultValue={"RSD"} name="programme" className="form-select rounded" aria-label="Default select example"
                                        onChange={event => {
                                            const { value } = event.target;
                                            setProgramme(value);
                                        }}>
                                        <option value="RSD">Bachelor Degree of Software Systems Development</option>
                                        <option value="RBA">Bachelor Degree of Business Administration</option>
                                        <option value="RAF">Bachelor Degree of Accounting &amp; Finance</option>
                                        <option value="DAC">Diploma in Accounting</option>
                                        <option value="DBF">Diploma in Banking and Finance</option>
                                        <option value="DBA">Diploma in Business Administration</option>
                                        <option value="DMA">Diploma in Marketing</option>
                                        {/** */}
                                        <option value="DIT">Diploma in Information Technology</option>
                                        <option value="DSE">Diploma in Software Engineering</option>
                                        <option value="DHM">Diploma in Hotel Management</option>
                                    </select>
                                </div>
                            </div>

                            {/*Image Upload*/}
                            <div className="row mb-3">
                                <div className="col-5 d-flex justify-content-end">
                                    <p style={{ fontSize: '20px', color: 'black', margin: 0 }} className="me-3">Image Url</p>
                                </div>
                                <div className="col-7 d-flex justify-content-start rounded">
                                    <input name="imgUrl" style={{ marginBottom: '20px', width: '470px', paddingLeft: '10px' }}
                                        onChange={event => {
                                            const { value } = event.target;
                                            setImgUrl(value);
                                        }}></input>
                                </div>
                            </div>

                            {/*Submit*/}
                            <div className="row mb-3">
                                <div className="col-5 d-flex justify-content-end"></div>
                                <div className="col-7 d-flex justify-content-start">
                                    <button className='btn btn-alt-primary text-light' /*onClick={send}*/>Submit</button>
                                </div>
                            </div>

                            {/*studentId, password, fullName, email, programme, ratingReceived, accumulatedRating, status, imgUrl*/}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

//<div className="container flex-center mb-5">