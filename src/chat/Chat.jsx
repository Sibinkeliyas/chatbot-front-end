import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
} from "mdb-react-ui-kit";
import ScrollToBottom from 'react-scroll-to-bottom'
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { findQuestions, logoutAction } from "../redux/actions/login";
import './style.css'
const socket = io(('http://localhost:3002'))


function Chat() {
  const dispatch = useDispatch()
  const [currentMessage , setCurrentMessage] = useState('')
  const [messageList , setMessageList ] = useState([])
  const userData = useSelector((state) => state.userLogin)
  const questions = useSelector((state) => state.findQuestions.data)
  const [image , setImage] = useState()

  const logout = () => {
    dispatch(logoutAction())
    localStorage.removeItem('chatUser')
  }
  useEffect(() => {
    socket.emit("join_room", userData.data._id );
    dispatch(findQuestions())
  } , [dispatch, userData.data._id])

   const sendMessage = async(message , status) => {
    console.log(typeof(message));
    if(typeof(message) === 'object') {
      message = false
    }
    if((currentMessage !== '' || status) && !image?.image) {
      const messageData = { 
        room: userData.data._id,
        author: userData.data.email,
        message: currentMessage ? currentMessage : message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
    };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    } else if(image?.image ) {
      console.log("ASDFASDFADSFSD");
      const formData = new FormData()
      formData.append('file', image.image)
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET)
      if (formData) {
        fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/image/upload`, {
          method: 'POST',
          body: formData,
        }).then((Data) => {
          Data.json().then(async (data) => {
            const messageData = {
              room: userData.data._id,
              author: userData.data.email,
              message: currentMessage ? currentMessage : message ? message : '',
              image : data.url ,
              time:
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
              
            };
           console.log(messageData);
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
            setImage({
              preview : '' ,
              image : ''
            })
          })
        }).catch((err) => {
          console.log(err);
        })
      } 
    }
  }
  useEffect(() => {
      socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data])
    });
     return () => {
        socket.off('receive_message');
      }
  } , [ ])
  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" ,  }}>
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
            <MDBCardHeader className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Chat</h5>
              <button className="btn btn-danger" onClick={logout}>Logout</button>
            </MDBCardHeader>
            
              <MDBCardBody style={{ borderRadius: "15px" ,height:'60vh' , overflowY:'scroll'}}>
              <ScrollToBottom>
                {
                  messageList?.map((message) => {
                    if(message.not) {
                      return(
                        <>
                          <div className="w-100 d-flex justify-content-center" >
                            <p className="small ms-3 mb-3 rounded-3 text-muted">
                              {message.message}
                            </p>
                          </div>
                        </>
                      )
                    } else if (message.author === 'bot' || message.author !== userData.data.email){
                    return(
                      <>
                          <div className="d-flex flex-row justify-content-start" >
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                alt="avatar 1"
                                style={{ width: "45px", height: "100%" }}
                              />
                              <div className="d-flex flex-column justify-content-start">
                                    {
                                      message.image && <img src={message.image} alt="" style={{ width: '20%' }} />
                                    }
                                    <div>

                                      <p
                                        className="small p-2 ms-3 mb-1 rounded-3"
                                        style={{ backgroundColor: "#f5f6f7" }}
                                      >
                                        {
                                          message.message
                                        }
                                      </p>
                                      <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                                        {message.time}
                                      </p>
                                    </div>
                                  </div>
                            </div>
                      </>
                    ) 
                } else {
                  return(
                    <>
                       <div className="d-flex flex-column justify-content-end " >
                                  <div className="d-flex flex-column justify-content-end">
                                    {
                                      message.image && <img src={message.image} alt="" style={{ width: '20%' }} className="ms-auto" />
                                    }
                                  </div>
                                  <div className="d-flex flex-row justify-content-end ">
                                    <div>
                                      {
                                        message.message && <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                          {message.message}
                                        </p>
                                      }
                                      <p className="small me-3 mb-3 rounded-3 text-muted">
                                        {message.time}
                                      </p>
                                    </div>
                                    <img
                                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                      alt="avatar 1"
                                      style={{ width: "45px", height: "100%" }}
                                    />
                                  </div>

                                </div>
                    </>
                  )
                }
                  })
                }
                {
                        image?.preview && (
                          <div className="image-preview">
                            <img src={image.preview} alt="Preview" />
                          </div>
                        )
                      }
                </ScrollToBottom>
              </MDBCardBody>
              
            {/* </MDBScrollbar> */}
            <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center flex-column p-3">
            <div className="w-100 row col-12 text-center">
                {
                  questions?.map((question) => {
                    return(
                      <div className="rounded col-3 border border-info text-info m-1"  onClick={() => {
                        sendMessage(question.recieve , true)
                      }} style={{cursor:'pointer'}}>
                        {question.recieve}
                      </div>
                    )
                  })
                }
            </div>
              <div className="w-100 text-muted d-flex justify-content-start align-items-center  p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                  alt="avatar 3"
                  style={{ width: "45px", height: "100%" }}
                />
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="exampleFormControlInput1"
                  placeholder="Type message"
                  onChange={(e) => {
                    setCurrentMessage(e.target.value)
                  }}
                  onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                  }}
                  value={currentMessage}
                ></input>
               <label for="file-upload" className="file-button ms-2 ">
                        <MDBIcon fas icon="paperclip" />
                      </label>
                      <input id="file-upload" className='display-none' type="file" style={{ display: 'none' }} onChange={(e) => {
                        setImage({
                          image: e.target.files[0],
                          preview: URL.createObjectURL(e.target.files[0])
                        })
                      }} onKeyPress={(e) => {
                        e.key === 'Enter' && sendMessage()
                      }} />
                <a className="ms-3" href="#!" onClick={sendMessage}>
                  <MDBIcon fas icon="paper-plane" />
                </a>
             </div>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Chat