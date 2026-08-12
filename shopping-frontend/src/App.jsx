import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Navbar from "./components/navbar";
import Login from "./components/login";
import SignUp from "./components/signup";
import AboutUs from "./components/aboutUs";
import Cart from "./components/cart";
import TrendingProducts from "./components/TrendingProducts";
export default function App() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendProducts, setRecommendProducts] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([])
    const [error, setError] = useState("");
    const [refreshProducts, setRefreshProducts] = useState(false)

    const userId = localStorage.getItem("userId") || 0

    useEffect( () => {

        
        fetch(`${import.meta.env.VITE_API_URL}/products/${userId}`)

            .then( res => res.json())

            .then( data => {
                setProducts(data.products)
                setRecommendProducts(data.recommendProducts)
                setTrendingProducts(data.trendingProducts)
                setLoading(false);

            })

            .catch(err => {
                setError("Our website is temporarily unavailable due to maintenance. Please check back shortly.");
                setLoading(false);
            });

    }, [refreshProducts]);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <>
        <Routes>
          <Route path="/" element={<Navbar setRefreshProducts= {setRefreshProducts}/>}>

            <Route index element={<ProductList products={products} recommendProducts={recommendProducts} trendingProducts={trendingProducts}/>}/>  
            <Route path="login" element={<Login setRefreshProducts= {setRefreshProducts}/>}/>
            <Route path="signup" element={<SignUp/>}/>
            <Route path="aboutUs" element={<AboutUs/>}/>
            <Route path="cart" element={<Cart/>}/>

            </Route>  


            </Routes>
        </>
    );
}