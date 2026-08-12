import { createContext, useState } from "react";

export const AuthContext = createContext()



export default function AuthContextProvider({children}){

const [name, setName] = useState(localStorage.getItem("userName"))
const [token, setToken] = useState(localStorage.getItem("token"))
const[cartItems, setCartItems] = useState([])
    return(<>
    
    <AuthContext.Provider value={{name, setName, token, setToken}}>
        {children}
    </AuthContext.Provider>

    </>)
}