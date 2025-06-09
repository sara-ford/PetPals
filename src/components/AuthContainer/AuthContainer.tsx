import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon
} from 'mdb-react-ui-kit';
import SignIn from '../SignIn/SignIn';
import Login from '../LogIn/LogIn';

const AuthContainer = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <MDBContainer className="my-5">
      <MDBCard>
        <MDBRow className='g-0'>
          <MDBCol md='6'>
            <MDBCardImage
              src='https://www.google.com/imgres?q=puppy&imgurl=https%3A%2F%2Fwww.yarrah.com%2Fmedia%2Fa9%2F44%2Fd3%2F1645715519%2Fyarrah-buying-a-puppy-what-to-look-for.png&imgrefurl=https%3A%2F%2Fwww.yarrah.com%2Fen%2Fblog%2Fbuying-a-puppy-what-to-look-for%2F&docid=CK2ZEqBAOTQJyM&tbnid=gJZF_57fPyBllM&vet=12ahUKEwjF1cLNm-SNAxXCwQIHHX_ZDSwQM3oECB0QAA..i&w=900&h=675&hcb=2&ved=2ahUKEwjF1cLNm-SNAxXCwQIHHX_ZDSwQM3oECB0QAA'
              alt="form illustration"
              className='rounded-start w-100'
            />
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column justify-content-center'>

              <div className='d-flex flex-row mt-2'>
                <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
                <span className="h1 fw-bold mb-0">Logo</span>
              </div>

              <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>
                {isRegistering ? 'צור חשבון חדש' : 'התחברות לחשבון'}
              </h5>

              {/* 👇 Show form here */}
              {isRegistering ? <SignIn /> : <Login />}

              <div className="mt-4">
                {isRegistering ? (
                  <p style={{ color: '#393f81' }}>
                    כבר יש לך חשבון?{' '}
                    <a href="#!" onClick={() => setIsRegistering(false)} style={{ color: '#393f81' }}>
                      התחבר כאן
                    </a>
                  </p>
                ) : (
                  <p style={{ color: '#393f81' }}>
                    אין לך חשבון?{' '}
                    <a href="#!" onClick={() => setIsRegistering(true)} style={{ color: '#393f81' }}>
                      הירשם כאן
                    </a>
                  </p>
                )}
              </div>



            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default AuthContainer;
