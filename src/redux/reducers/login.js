import { constants } from "../constants/constants";

export const login = (state = {} , {type , payLoad}) => {
    switch (type) {
        case constants.loginrequested:
           return {
                loading : true
           }
        case constants.login : 
            return {
                loading : false ,
                data : payLoad
            }
        case constants.loginfailed :
            return {
                loading : false ,
                err : payLoad
            }
        case constants.logout : 
            return {
                data : false
            }
        default :
            return state
            
        }
            
    }

    export const adminLogin = (state = {} , {type , payLoad}) => {
    switch (type) {
        case constants.adminloginrequested:
           return {
                loading : true
           }
        case constants.adminlogin : 
            return {
                loading : false ,
                data : payLoad
            }
        case constants.loginfailed :
            return {
                loading : false ,
                err : payLoad
            }
        case constants.adminlogout : 
            return {
                data : false
            }
        default :
            return state
            
        }
            
    }

export const findusers = (state = {} , {type , payLoad}) => {
    switch (type) {
        case constants.findusersrequested:
           return {
                loading : true
           }
        case constants.findUsers : 
            return {
                loading : false ,
                data : payLoad
            }
        case constants.findusersfailed :
            return {
                loading : false ,
                err : payLoad
            }
        default :
            return state
            
        }
            
    }

export const findQuestions = (state = {} , {type , payLoad}) => {
    switch (type) {
        case constants.findQuestionsRequested:
           return {
                loading : true
           }
        case constants.findQuestions : 
            return {
                loading : false ,
                data : payLoad
            }
        case constants.findQuestionsFailed :
            return {
                loading : false ,
                err : payLoad
            }
        default :
            return state
            
        }
            
    }


    export const addQuestions = (state = {} , {type , payLoad}) => {
    switch (type) {
        case constants.addQuestionRequested:
           return {
                loading : true
           }
        case constants.addQuestion : 
            return {
                loading : false ,
                data : payLoad
            }
        case constants.addQuestionFailed :
            return {
                loading : false ,
                err : payLoad
            }
        default :
            return state
            
        }
            
    }