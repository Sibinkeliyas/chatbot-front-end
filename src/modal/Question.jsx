import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

export default function Model({ Question, setQuestion, centredModal, setCentredModal, addQuestionF }) {

  const toggleShow = () => setCentredModal(!centredModal);

  return (
    <>

      <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add questions</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className='row col-12 '>
                <div className="form-input mb-3">
                    <input type="text" name="" className='form-control col-12' id="" placeholder='recieve message' onChange={(e) => {
                        setQuestion({
                            ...Question ,
                            recieve : e.target.value
                        })
                    }}
                    value={Question?.recieve}
                    />
                </div>
                <div className="form-input">
                    <input type="text" name="" className='form-control col-12' id="" placeholder='Send message' onChange={(e) => {
                        setQuestion({
                            ...Question,
                            send: e.target.value
                        })
                    }} 
                    value={Question?.send}
                    />
                </div>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleShow}>
                Close
              </MDBBtn>
                <MDBBtn onClick={addQuestionF}>Add Question</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}