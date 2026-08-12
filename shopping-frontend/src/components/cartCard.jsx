import { useState } from "react"
import "./cartCard.css"
import axios from "axios"
export default function CartCard(props){

const [buyError, setBuyError] = useState(false)
const [removeLoading, setRemoveLoading] = useState(false)
const setRefreshProducts = props.setRefreshProducts

async function removeItem(){
setRemoveLoading(true)

try{
const token = localStorage.getItem("token")
const response = await axios.delete(`${import.meta.env.VITE_API_URL}/deleteCart/${props.productId}`, { 
   headers : {Authorization : `Bearer ${token}`}
 } )

setRefreshProducts(prev => !prev)
}
catch(err){
console.log("Something went wrong")
}
finally{
setRemoveLoading(false)
}

}



function handleBuy(){

    setBuyError(true)

    setTimeout(()=>{
        setBuyError(false)
    }, 3000)
}


    return(<>

        <div className="cart-card">

        <img src={`/images/${props.id}.jpg`} alt="product-pic"/>
        <h2>{props.name}</h2>
        <p className="cart-price">₹{props.price}</p>


        <div className="cart-buttons">
        <button onClick={removeItem} disabled={removeLoading}>{removeLoading ? "Removing..." : "Remove"}</button>
        
        <button onClick={handleBuy}>Buy</button>
        </div>

        {buyError ? <p className="cart-error">This feature will be available soon.</p> : null}
        </div>

    </>)
}