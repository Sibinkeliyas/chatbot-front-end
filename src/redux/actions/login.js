import { constants } from "../constants/constants"
import axios from "axios"
import { url } from "../constants/url"

export const login = ({email , password} , admin = false) => async(dispatch) => {
    dispatch({type : constants.loginrequested})
    const config = {
        headers : {
            'content-type' : 'application/json'
        }
    }
    axios.post(`${url}/login` , {email , password , admin} , config).then((data) => {
        console.log(data.data);
        if(data.data.admin) {
            localStorage.setItem('chatadmin' , JSON.stringify(data.data.data))
            dispatch({type : constants.adminlogin , payLoad : data.data})
        } else {
            localStorage.setItem('chatUser' , JSON.stringify(data.data.data))
            dispatch({type : constants.login , payLoad : data.data})
        }
        
    }).catch((err) => {
        console.log(err);
    })
}

export const findUsers = () => async(dispatch) => {
    dispatch({type : constants.findusersrequested})
    let token = JSON.parse(localStorage.getItem('chatadmin')).token
    const config = {
        headers : {
            Authorization: "Bearer " + token,
            'content-type' : 'application/json'
        }
    }
    axios.post(`${url}/find-users` , { } , config).then((data) => {
        dispatch({type : constants.findUsers , payLoad : data.data})
    }).catch((err) => {
        dispatch({type : constants.findUsers , payLoad : err})
    })
}

export const findQuestions = () => async(dispatch) => {
    dispatch({type : constants.findQuestionsRequested})
   let token = JSON.parse(localStorage.getItem('chatUser')).token
    const config = {
        headers : {
            Authorization: "Bearer " + token,
            'content-type' : 'application/json'
        }
    }
    axios.post(`${url}/find-message` , {} , config).then((data) => {
        dispatch({type : constants.findQuestions , payLoad : data.data})
    }).catch((err) => {
        dispatch({type : constants.findQuestionsFailed , payLoad : err.response.data})
    })
}

export const addQuestionAction = ({send , recieve}) => async(dispatch) => {
    dispatch({type : constants.addQuestionRequested})
   let token = JSON.parse(localStorage.getItem('chatadmin')).token
    const config = {
        headers : {
            Authorization: "Bearer " + token,
            'content-type' : 'application/json'
        }
    }
    axios.post(`${url}/add-message` , { send , recieve } , config).then((data) => {
        dispatch({type : constants.addQuestion , payLoad : data.data})
        dispatch({type : constants.findQuestions , payLoad : data.data})
    }).catch((err) => {
        dispatch({type : constants.addQuestionFailed , payLoad : err.response.data})
    })
}

export const logoutAction = () => async(dispatch) => {
    dispatch({type : constants.logout})
}

export const adminLogout = () => async(dispatch) => {
    localStorage.removeItem('chatadmin')
    dispatch({type : constants.adminlogout})
}
 