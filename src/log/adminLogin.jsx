import React, { useEffect, useState } from 'react';
import {MDBContainer, MDBCol, MDBRow, MDBBtn,  MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/login';


function AdminLogin() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [data , setData] = useState()
    const loginButton = () => {
        dispatch(login(data , true))
    }
    const adminData = useSelector((state) => state.adminLogin.data)
    useEffect(() => {
        if(adminData) {
            navigate('/admin-chat')
        }
    } , [navigate, adminData])
  return (
      <div className='d-flex flex-row align-items-center justify-content-center w-100 pb-5 h-75'>
          <MDBContainer fluid className="p-3 my-5 h-custom w-75 mt-5">
              <MDBRow>
                  <MDBCol col='10' md='6'>
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid" alt="Sample image" />
                  </MDBCol>
                  <MDBCol col='4' md='6'>
                      <div className="d-flex flex-row align-items-center justify-content-center">
                      </div>
                      <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" onChange={(e) => {
                        setData({
                            ...data , 
                            email : e.target.value
                        })
                      }}/>
                      <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" onChange={(e) => {
                            setData({
                                ...data , 
                                password : e.target.value
                            })
                        }}/>
                      <div className='text-center text-md-start mt-4 pt-2'>
                          <MDBBtn className="mb-0 px-5" size='lg' onClick={loginButton}>Login</MDBBtn>
                          <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <a href="#!" className="link-danger">Register</a></p>
                      </div>
                  </MDBCol>
              </MDBRow>
          </MDBContainer>
    </div>
  );
}

export default AdminLogin;