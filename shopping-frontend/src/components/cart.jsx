import { useEffect, useState } from "react"
import CartCard from "./cartCard"
import axios from "axios"
import "./cart.css"

export default function Cart(){


const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState()
const [refreshProducts, setRefreshProducts] = useState(false)




useEffect(()=>{

async function fetchItems() {

try{
    
const token = localStorage.getItem("token")

const response = await axios.get(`${import.meta.env.VITE_API_URL}/cartPage`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
setProducts(response.data.products)
}

catch(err){
setError(err)

}
finally{
setLoading(false)
}

}


fetchItems()

}, [refreshProducts])


if(loading){
return <h2>Loading items...</h2>
}
if(error){  
return  <h2>{error.message}</h2>
}

if (products.length === 0) {
    return <h2>Your cart is empty.</h2>;
}






    return(<>


        <div className="cart-wrapper">



           {products.map( product =>( <CartCard  key={product._id} productId={product._id} id={product.id} name={product.name} price={product.price} setRefreshProducts={setRefreshProducts} /> ))}

        </div>


    </>)
}

 