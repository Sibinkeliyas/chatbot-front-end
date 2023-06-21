import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {  addQuestionAction, adminLogout, findUsers } from "../redux/actions/login";
import AddquestionModel from '../modal/Question'
import { ToastContainer, toast } from 'react-toast'
import ScrollToBottom from 'react-scroll-to-bottom';
import './style.css'
const socket = io(('http://localhost:3002'))

export default function AdminChat() {
  const dispatch = useDispatch()
  const [selectedId , setSeletedId] = useState()
  const users = useSelector((state) => state.findusers.data)
  const adminData = useSelector((state) => state.adminLogin)
  const [currentMessage , setCurrentMessage] = useState('')
  const [messageList , setMessageList ] = useState([])
  const [sAdjust , setSadjust] = useState('')
  const [addQuestion , setQuestion] = useState()
  const addQuestionUpdation = useSelector((state) => state.addQuestions)
  const [modalview , setModalView] = useState(false)
  const [image , setImage] = useState()



  const joinRoom = (user) => {
    const data = {
      room : user._id ,
      author : adminData.data.email
    }
    setSeletedId(user)
    socket.emit('join_room' , user._id)
    socket.emit('join_admin_room' , data)
    if (window.innerWidth < 768) {
      setSadjust('chatwindow')
    }
    
  }

    const sendMessage = async() => {
    if(currentMessage !== '' && !image?.image) {
      const messageData = { 
        room: selectedId._id,
        author: adminData.data.email,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        from: 'admin'
    };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    } else if(image?.image) {
      const formData = new FormData()
      formData.append('file', image.image)
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET)
      if (formData) {
        fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/image/upload`, {
          method: 'POST',
          body: formData,
        }).then((Data) => {
          Data.json().then(async (data) => {
            console.log(data);
            const messageData = {
              room: selectedId._id,
              author: adminData.data.email,
              message: currentMessage,
              image : data.url ,
              time:
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
              from : 'admin'
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
            setImage({
              preview : '' ,
              image : 'e'
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

  useEffect(() => {
    dispatch(findUsers())
  } , [ dispatch ])

  const logout = () => {
    dispatch(adminLogout())
  }


  useEffect(() => {
    if(window.innerWidth < 768) {
      setSadjust('sidebar')
    }
    const handleResize = () => {
      if(window.innerWidth < 768) {
        setSadjust('sidebar')
      } else {
        setSadjust('')
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const menuAdjust = () => {
    setSadjust('sidebar')
  }
  const addQuestionF = () => {
    dispatch(addQuestionAction(addQuestion))
    setQuestion({
      recieve : '' ,
      send : ''
    })
  }
  const modelController = () => {
    setModalView(true)
  }

  useEffect(( ) => {
    if(addQuestionUpdation?.data) {
      toast.success('Message Added')
      addQuestionUpdation.data = false
    } else if(addQuestionUpdation?.err) {
      console.log("ASDFASFDFA");
      toast('Something went wrong')
      addQuestionUpdation.err = false
    }
  } , [addQuestionUpdation, addQuestionUpdation?.data, addQuestionUpdation.err])
  

  return (
    <MDBContainer fluid className="py-5" style={{height:'80vh'}}>
      <ToastContainer />
    <AddquestionModel 
        Question = {addQuestion}
        setQuestion={setQuestion}
        centredModal={modalview}
        setCentredModal={setModalView}
        addQuestionF={addQuestionF}
    />
      <MDBRow>
        <MDBCol md="12">
          <MDBCard id="chat3" style={{ borderRadius: "15px" , height : '100vh' }}>
            <MDBCardHeader className="d-flex justify-content-between align-items-center p-3" style={sAdjust === 'sidebar' ? { display: 'none' } : {}}>
              <div className="d-flex justify-content-center align-items-center p-3">
            
              </div>
              <div>
                <i className="fas fa-bars me-5" style={!sAdjust ? { display: 'none' } : { cursor: 'pointer' }} onClick={menuAdjust}></i>
                <button className="btn btn-info me-5" onClick={modelController}>Add Question</button>
                <button className="btn btn-danger" onClick={logout}>Logout</button>
              </div>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow>
                <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                  <div className="p-3">
                    <MDBInputGroup className="rounded mb-3" style={sAdjust === 'chatwindow' ? { display: 'none' } : {}}> 
                      <input
                        className="form-control rounded"
                        placeholder="Search"
                        type="search"
                      />
                      <span
                        className="input-group-text border-0"
                        id="search-addon"
                      >
                        <MDBIcon fas icon="search"  />
                      </span>
                    </MDBInputGroup>
                    <MDBTypography listUnStyled className="mb-0" style={sAdjust === 'chatwindow' ? {  display : 'none'} : {  }}>
                      {
                      users && users.length && users?.map((user) => {
                          return(
                            <li className="p-2 border-bottom">
                              <a
                                href="#!"
                                className="d-flex justify-content-between"
                                onClick={() => {
                                  joinRoom(user)
                                }}
                              >
                                <div className="d-flex flex-row">
                                  <div>
                                    <img
                                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                      alt="avatar"
                                      className="d-flex align-self-center me-3"
                                      width="60"
                                    />
                                    <span className="badge bg-success badge-dot"></span>
                                  </div>
                                  <div className="pt-1">
                                    <p className="fw-bold mb-0">{user.email}</p>
                                    <p className="small text-muted">
                                      Hello, Are you there?
                                    </p>
                                  </div>
                                </div>
                                {/* <div className="pt-1">
                                  <p className="small text-muted mb-1">Just now</p>
                                  <span className="badge bg-danger rounded-pill float-end">
                                    3
                                  </span>
                                </div> */}
                              </a>
                        </li>
                          )
                        })
                      }
                      </MDBTypography>
                    {/* </MDBScrollbar> */}
                  </div>
                </MDBCol>
                <MDBCol md="6" lg="7" xl="8" className="p-0">
                  {
                    selectedId && <MDBCardHeader className="d-flex justify-content-between align-items-center " style={sAdjust === 'sidebar' ? {  display: 'none' } : {  }}>
                      <div className="d-flex justify-content-center align-items-center p-3">
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                          alt="avatar 1"
                          style={{ width: "45px", height: "100%" }}
                        />
                        <h5 className="mb-0 ms-3">{selectedId?.email}</h5>
                      </div>
                    </MDBCardHeader>
                  }
                  <div style={sAdjust === 'sidebar' ? { height: '55vh', display: 'none', overflowY: 'scroll' } : { height: '55vh', overflowY: 'scroll' }} className="p-5">
                    <ScrollToBottom >
                      {
                        selectedId ? messageList?.map((message) => {
                          if (message.author !== adminData.data.email) {
                            return (
                              <>
                                <div className="d-flex flex-row justify-content-start">
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
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
                            return (
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
                                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                      alt="avatar 1"
                                      style={{ width: "45px", height: "100%" }}
                                    />
                                  </div>

                                </div>
                              </>
                            )
                          }
                        }) :

                          <>
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="" className=" w-100" />
                          </>

                      }
                      {
                        image?.preview && (
                          <div className="image-preview">
                            <img src={image.preview} alt="Preview" />
                          </div>
                        )
                      }
                    </ScrollToBottom>
                  </div>
                      { selectedId &&
                    <>
                  
                    <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2" style={sAdjust === 'sidebar' ? { display: 'none' } : {}}>
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                        alt="avatar 3"
                        style={{ width: "40px", height: "100%" }}
                      />
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="exampleFormControlInput2"
                        placeholder="Type message"
                        onChange={(e) => {
                          setCurrentMessage(e.target.value)
                        }}
                        onKeyPress={(event) => {
                          event.key === "Enter" && sendMessage();
                        }}
                        value={currentMessage}
                      />
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
                      <a className="ms-3" href="#!">
                        <MDBIcon fas icon="paper-plane" onClick={sendMessage} />
                      </a>
                    </div>
                    </>
                      }
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}