import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Loader from '../layouts/Loader'
import MetaData from '../layouts/MetaData'

const Profile = () => {

    const { user, loading } = useSelector(state => state.auth)

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Your Profile'} />

                    <h2 className="mt-5 ml-5">My Profile</h2>
                    <div className="row justify-content-around mt-5 user-info">
                        <div className="col-12 col-md-3">
                            <figure className='avatar avatar-profile'>
                                <img className="rounded-circle img-fluid" src={user.ProfilePicture.url} alt={user.name} />
                            </figure>
                            <Link to="/me/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                                Edit Profile
                            </Link>
                        </div>

                        <div className="col-12 col-md-5">
                            <div className='row'>
                                <div className='col-6 '>
                                    <h4>First Name</h4>
                                    <p>{user.firstName}</p>
                                </div>
                                <div className='col-6 '>
                                    <h4>Last Name</h4>
                                    <p>{user.lastName}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6 '>
                                    <h4>User Name</h4>
                                    <p>{user.UserName}</p>
                                </div>
                                <div className='col-6 '>

                                    <h4>Email Address</h4>
                                    <p>{user.Email}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6 '>
                                    <h4>Role</h4>
                                    <p>{user.Role}</p>
                                </div>
                                <div className='col-6 '>
                                    <h4>Joined On</h4>
                                    <p>{String(user.createdAt).substring(0, 10)}</p>
                                </div>
                            </div>



                            {user.Role !== 'Admin' && (
                                <Link to="/orders/me" className="btn btn-danger btn-block mt-5">
                                    My Orders
                                </Link>
                            )}

                            <Link to="/password/update" className="btn btn-primary btn-block mt-3">
                                Change Password
                            </Link>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Profile