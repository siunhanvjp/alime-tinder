import React from 'react'
import NavBar from '../components/NavBar';
import "./styles/Landing.css"
import { useNavigate } from 'react-router-dom';
import {auth, provider, database} from "../config/firebase"
import {signInWithPopup} from 'firebase/auth'
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, getDocs } from "firebase/firestore"


function Landing(){

    const [user, loading, error] = useAuthState(auth)

    const navigate = useNavigate();

    if(user && !loading){
        navigate("/home")
    }

    const handleClick = async () =>{
        try{
            const result = await signInWithPopup(auth, provider)
            const uid = result.user.uid

            const q = query(collection(database, "user"), where("userId", "==", uid))
            const querySnapshot = await getDocs(q)
            console.log(querySnapshot.empty)
            if(querySnapshot.empty){
                console.log(uid)
                navigate("/signup")
            } else{
                navigate("/home")
            }
        } catch (error){
            console.log(error)
        }
        
    }

    return (
        <div className="overlay">
            <NavBar/>
            <div className="Home">
                <h1 className="primary-title">Swipe Right</h1>
                <button className="primary-button" onClick={handleClick}>
                    Log In via Google
                </button>
            </div>
        </div>
        
    );
}

export default Landing