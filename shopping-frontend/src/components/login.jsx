import { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import "./signup.css"
export default function Login(props){



const {setName, setToken} = useContext(AuthContext)
const [userEmail, setUserEmail] = useState("")
const [password, setPassword] = useState("")
const [error, setError] = useState("")
const [loading, setLoading] = useState(false)
const setRefreshProducts = props.setRefreshProducts
const navigate = useNavigate()


function enterEmail(e) {

  setUserEmail(e.target.value)
}

function enterPassword(e) {

  setPassword(e.target.value)
}





async function handleSubmit(e)
{
e.preventDefault()
setLoading(true)
setError("")

if (userEmail.trim() === "") {
    setError("Please enter your email.");
    setLoading(false);
    return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if (!emailRegex.test(userEmail)) {
    setError("Please enter a valid email address.");
    setLoading(false);
    return;
}

if(password.trim() === ""){
    setError("Please enter your password.");
     setLoading(false)
    return;
}



try{

const response  = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {userEmail, password} )
const { token : receivedToken, user} = response.data;


localStorage.setItem("userName", user.name )
localStorage.setItem("token",  receivedToken)
localStorage.setItem("userId", user.id)
setToken(receivedToken)
setName(user.name)
setRefreshProducts(prev => !prev)
setUserEmail("")
navigate('/')
}

catch(error){
    setError(
        error.response?.data?.message ||
        "Something went wrong."
    );
}
finally{
setLoading(false)
setPassword("")
}

}



    return(<>

    <div className="signup-page">

    <div className="signup-container">

    
   <h2>Login Form</h2> 


    {error ? <p  className="signup-error" style={{ color: "red" }}>{error}</p> : null}
    
    <form className="signup-form" onSubmit={handleSubmit}>

    <label htmlFor="email">Enter your Email</label> <br></br>
    <input id="email" placeholder='Enter your email'  type='email' value={userEmail}
    onChange={enterEmail}
    
    />  


    <label htmlFor="password">Enter your Password</label>   <br></br>
    <input id= "password" placeholder="Enter your password" type ="password" value={password}
    onChange={enterPassword}
    
    />  

    <button disabled={loading} type="submit">{loading ? "Logging in..." : "Login"}</button>


    </form>

    </div>

    </div>
    
    </>)
}