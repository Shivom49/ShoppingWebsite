import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../App"
import LogoutPopup from "./LogoutPopup"
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar(props) {

const [showLogoutPopup, setShowLogoutPopup] = useState(false);
const {name, token} = useContext(AuthContext)
const setRefreshProducts= props.setRefreshProducts
 


    return (
    <>


      <div className="app-layout">

        <nav className="navbar">

            {token != null ? <h2 className="username">Welcome {name}!</h2> : <h2>Welcome!</h2>}

            <ul className="nav-items">
                <li><Link to= "/">Home</Link></li>
               {token ? null : <li><Link to="/signUp">Signup</Link></li> }
                <li><Link to="/aboutUs">AboutUs</Link></li>
                {token ? <li> <Link to="cart"> <FaShoppingCart style={{ height: "15px", marginRight: "5px" }} /> Cart </Link></li> : null}
                  {token == null ? <li ><Link to="/login">Login</Link></li> : <li onClick={() => setShowLogoutPopup(true)}>Logout</li> }
            </ul>

        </nav>

        <div className="page-content">

            <Outlet />
        </div>

        </div>


        {
    showLogoutPopup ? (
        <LogoutPopup
            setRefreshProducts= {setRefreshProducts} setShowLogoutPopup={setShowLogoutPopup}
        />
    ) : null
}

    </>)
}