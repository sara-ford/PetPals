import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
} from 'mdb-react-ui-kit';
import SignUp from '../SignUp/SignUp';
import SignIn from '../SignIn/SignIn';
import './AuthContainer.scss';

const AuthContainer = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <MDBContainer className="my-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: '800px', width: '100%' }}>
        <MDBRow className="g-0 flex-row">
          {!isRegistering ? (
            <>
              {/* Image on left */}
              <MDBCol md="6">
                <MDBCardImage
                  src="https://i.pinimg.com/236x/8b/c2/82/8bc2829efb4452a5399c72ca3879c0c4.jpg"
                  alt="puppy"
                  className="rounded-start w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </MDBCol>

              {/* SignIn form on right */}
              <MDBCol md="6">
                <MDBCardBody className="d-flex flex-column justify-content-center" style={{ padding: '30px' }}>
                  <div className="d-flex flex-row mb-4 justify-content-center align-items-center">
                    <MDBIcon fas icon="cubes fa-2x me-2" style={{ color: '#1976d2' }} />
                    <span className="h3 fw-bold mb-0">Logo</span>
                  </div>

                  <h5 className="fw-normal text-center mb-4" style={{ letterSpacing: '1px' }}>
                    התחברות לחשבון
                  </h5>

                  <SignIn />

                  <div className="text-center mt-4">
                    <p style={{ color: '#1976d2' }}>
                      אין לך חשבון?{' '}
                      <a href="#!" onClick={() => setIsRegistering(true)} style={{ color: '#1976d2' }}>
                        הירשם כאן
                      </a>
                    </p>
                  </div>
                </MDBCardBody>
              </MDBCol>
            </>
          ) : (
            <>
              {/* SignUp form on left */}
              <MDBCol md="6">
                <MDBCardBody className="d-flex flex-column justify-content-center" style={{ padding: '30px' }}>
                  <div className="d-flex flex-row mb-4 justify-content-center align-items-center">
                    <MDBIcon fas icon="cubes fa-2x me-2" style={{ color: '#1976d2' }} />
                    <span className="h3 fw-bold mb-0">Logo</span>
                  </div>

                  <h5 className="fw-normal text-center mb-4" style={{ letterSpacing: '1px' }}>
                    צור חשבון חדש
                  </h5>

                  <SignUp setIsRegistering={setIsRegistering} />

                  <div className="text-center mt-4">
                    <p style={{ color: '#1976d2' }}>
                      כבר יש לך חשבון?{' '}
                      <a href="#!" onClick={() => setIsRegistering(false)} style={{ color: '#1976d2' }}>
                        התחבר כאן
                      </a>
                    </p>
                  </div>
                </MDBCardBody>
              </MDBCol>

              {/* Image on right */}
              <MDBCol md="6">
                <MDBCardImage
                  src="https://i.pinimg.com/236x/8b/c2/82/8bc2829efb4452a5399c72ca3879c0c4.jpg"
                  alt="puppy"
                  className="rounded-end w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </MDBCol>
            </>
          )}
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default AuthContainer;