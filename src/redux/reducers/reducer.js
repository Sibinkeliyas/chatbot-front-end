import { combineReducers } from 'redux'
import { addQuestions, adminLogin, findQuestions, findusers, login } from './login'

const reducers = combineReducers({
    userLogin : login ,
    adminLogin : adminLogin,
    findusers : findusers ,
    findQuestions : findQuestions ,
    addQuestions : addQuestions
})

export default reducers