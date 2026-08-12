import { useNavigate } from "react-router-dom";
import "./LogoutPopup.css"
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
export default function LogoutPopup({setShowLogoutPopup, setRefreshProducts}){

const navigate = useNavigate()
const {name, setName, token, setToken} = useContext(AuthContext)

function handleNo()
{
setShowLogoutPopup(false)  
}

function handleYes()
{
localStorage.removeItem("token")
localStorage.removeItem("userName")
setToken(null)

setName("")
setShowLogoutPopup(false);
setRefreshProducts(prev => !prev)
navigate("/");
}


    return(<>
    <div className="logout-overlay">
 <div className="logout-modal-content">
    <h2>Logout</h2>
  <p id="logout-description">Are you sure you want to log out?</p>
     <div className="logout-modal-actions">
      <button onClick={handleYes}>Yes</button>
      <button onClick={handleNo}>No</button>
    </div>
    </div>
    </div>
    
    </>)
}