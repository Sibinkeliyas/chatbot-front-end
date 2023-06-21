import { BrowserRouter as Router , Route , Routes, Navigate} from 'react-router-dom'
import Login from './log/Login.jsx';
import Chat from './chat/Chat';
    import 'mdb-react-ui-kit/dist/css/mdb.min.css';
    import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSelector } from 'react-redux';
import AdminChat from './chat/adminChat.jsx';
import AdminLogin from './log/adminLogin.jsx';

function App() {
  const userData = useSelector((state) => state.userLogin.data)
  const adminData = useSelector((state) => state.adminLogin.data)
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={!userData ? <Login /> : <Navigate to='/chat' />}  />
        <Route exact path='/admin-login' element={!adminData ? <AdminLogin /> : <Navigate to='/admin-chat' />}  />
        <Route exact path='/chat' element={ userData ? <Chat /> : <Navigate to='/' /> } />
        <Route exact path='/admin-chat' element={adminData ? <AdminChat /> : <Navigate to='/admin-login' /> } />
      </Routes>
    </Router>
  );
}

export default App;
