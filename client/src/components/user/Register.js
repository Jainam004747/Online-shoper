import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MetaData from "../layouts/MetaData";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { register, clearErrors } from '../../actions/userActions'

const Register = () => {

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        UserName: '',
        Email: '',
        Password: ''
    })

    const { firstName, lastName, UserName, Email, Password } = user;

    const [ProfilePicture, setProfilePicture] = useState('');
    const [ProfilePicturePreview, setProfilePicturePreview] = useState('/images/default_avatar.jpg');

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(`/`);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors);
        }

    }, [dispatch, alert, isAuthenticated, error, navigate])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('firstName', firstName);
        formData.set('lastName', lastName);
        formData.set('UserName', UserName);
        formData.set('Email', Email);
        formData.set('Password', Password);
        formData.set('ProfilePicture', ProfilePicture);

        dispatch(register(formData));
    }

    const onChange = e => {
        if(e.target.name === 'ProfilePicture')
        {

            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2){
                    setProfilePicturePreview(reader.result);
                    setProfilePicture(reader.result);
                }
            }

            reader.readAsDataURL(e.target.files[0]);

        }else {

            setUser({ ...user, [e.target.name]: e.target.value})
        }
    }

    return (
        <Fragment>
            <MetaData title={'Register user'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">FirstName</label>
                            <input type="name" 
                            id="name_field" 
                            className="form-control" 
                            name='firstName'
                            value={firstName} 
                            onChange={onChange}
                        />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">LastName</label>
                            <input type="name" 
                            id="name_field" 
                            className="form-control" 
                            name='lastName'
                            value={lastName} 
                            onChange={onChange}
                        />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">UserName</label>
                            <input type="name" 
                            id="name_field" 
                            className="form-control" 
                            name='UserName'
                            value={UserName} 
                            onChange={onChange}
                        />
                        </div>
                        

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='Email'
                                value={Email} 
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='Password'
                                value={Password} 
                                onChange={onChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>ProfilePicture</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={ProfilePicturePreview}
                                            className='rounded-circle'
                                            alt='ProfilePicturePreview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='ProfilePicture'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false }
                        >
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Register