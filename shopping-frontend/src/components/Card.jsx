import "../App.css"
import { useState, useContext, useEffect, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";


export default function Card(props){

const [cartStatus, setCartStatus] = useState(false)
const [loading, setLoading] = useState(false)
const [loginError, setLoginError] = useState(false)
const timeoutRef = useRef(null);



async function addCart()

{

try{
setLoading(true)

const token = localStorage.getItem("token");

if(!token)
{
setLoginError(true)

setTimeout(()=>{setLoginError(false) }, 3000)
return
}
const response = await axios.post("http://localhost:5000/addCart", {productId: props.productId, }, {
   headers : {Authorization : `Bearer ${token}`, "Content-Type": "application/json"}
}
)
if(response.status==201)
{
setCartStatus(true)

 if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
        setCartStatus(false);
        timeoutRef.current = null;
    }, 900);

}
}
catch(err)
{
console.log(err)
}
finally{
    setLoading(false)
}
}



async function removeCart()
{
try{
setLoading(true)

const token = localStorage.getItem("token")

const response = await axios.delete(`http://localhost:5000/deleteCart/${props.productId}`, { 
   headers : {Authorization : `Bearer ${token}`}
 } )


   if(response.status==200)
      {
    setCartStatus(false)
   }
}
catch (err){
   console.log(err)
}
finally{
   setLoading(false)
}
}



return(<>


<div className="card" >
<img src={`/images/${props.id}.jpg`} alt={props.name} />
<h1>{props.name}</h1>
<p>Price: ₹{props.price}</p>
{cartStatus ? <button disabled={loading} onClick={removeCart}> {loading ? "Removing..." : "Added to Cart"}</button> : <button disabled={loading} onClick={addCart}> <FaShoppingCart style={{ marginRight: "8px" }}/>{loading ? "Adding..." : "Add to Cart"} </button>  }
{loginError ? <p className= "login-error">Please log in to add items to your cart</p> : null}
</div>

</>)
}

