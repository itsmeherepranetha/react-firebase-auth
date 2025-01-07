import { Container } from "react-bootstrap";
import Signup from "./Signup";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import EditProfile from "./EditProfile";

function App() {
  return (
    
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight:"100vh"}}>
        <div className="w-100" style={{maxWidth:"400px"}}>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<PrivateRoute Component={Dashboard}/>}/>
                <Route path="/edit-profile" element={<PrivateRoute Component={EditProfile}/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </Container>
  )
}

export default App;
