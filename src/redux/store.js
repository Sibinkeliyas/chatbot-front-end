import { createStore , applyMiddleware } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension'
import thunk from "redux-thunk";
import reducers from "./reducers/reducer";


let userData = JSON.parse(localStorage.getItem('chatUser'))
let adminData = JSON.parse(localStorage.getItem('chatadmin'))

if(!userData) {
    userData = false
}
if(!adminData) {
    adminData = false
}

const initialState = {
    userLogin : {data : userData} ,
    adminLogin : {data : adminData}
}
const middleware = [thunk]

const store = createStore(
    reducers , initialState , composeWithDevTools(applyMiddleware(...middleware))
)

export default store