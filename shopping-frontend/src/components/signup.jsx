import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import "./signup.css"
export default function SignUp(){


const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("")
const [error, setError] = useState("")

const navigate = useNavigate()

function enterName(e){
setName(e.target.value)
}
function enterEmail(e){
setEmail(e.target.value)
}
function enterPassword (e){
setPassword(e.target.value)
}
function enterConfirmPassword (e){
setConfirmPassword(e.target.value)
}




async function handleSubmit(e){
    e.preventDefault()


setError("")

if(name.trim() === ""){
    setError("Please enter your name.");
    return;
}

if(name.trim().length<3){
     setError("Name must be at least 3 characters long.")
     return;
}

if(email === ""){
    setError("Please enter your email.");
    return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email.trim())){
    setError("Please enter a valid email address.");
    return;
}


if(password === ""){
    setError("Please enter your password.");
    return;
}

if(password.length < 8){
    setError("Password must be at least 8 characters long.");
    return;
}


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
if(!passwordRegex.test(password)){
    setError(
        "Password must contain at least one uppercase, one lowercase, one digit, and one special character."
    )
    return;
}

if(confirmPassword === ""){
    setError("Please confirm your password.");
    return;
}

if(password !== confirmPassword){
    setError("Passwords do not match.");
    return;
}


try{

const userData = {name, email, password}
const response = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, userData)

if(response.status == 201){
setName("")
setEmail("")
setPassword("")
setConfirmPassword("")
setError("")
navigate("/login")
}
}
catch(err){
    setError(err.response?.data?.message || "Something went wrong.")
}


}





return(<>
    

<div className="signup-page">


<div className="signup-container">


<h2>Create Your Account</h2>

{error ? <p  className="signup-error" style={{ color: "red" }}> {error} </p> : null}

<form className="signup-form" onSubmit={handleSubmit}>

<label htmlFor="name">Enter Your name</label>
<input id="name" type="text"  placeholder="Enter your name" onChange={enterName} value={name}/>


<label htmlFor="email">Enter Your email</label>
<input id="email" type="email" placeholder="Enter your email" onChange={enterEmail} value={email}/>

<label htmlFor="password">Enter Your Password</label>
<input id="password" type="password" placeholder="Enter your password" onChange={enterPassword} value={password}/>


<label htmlFor="confirmpassword">Confirm Password</label>
<input id="confirmpassword" type="password" placeholder="Confirm your password" onChange={enterConfirmPassword} value={confirmPassword}/>


<button type="submit">Sign Up</button>

</form>

</div>

</div>

</>)
}