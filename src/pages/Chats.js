import React from 'react'
import Chat from "../components/Chat.js"
import { useState, useEffect,} from 'react';
import {collection, getDocs, query, 
    where, limit, orderBy, addDoc} from "firebase/firestore"
import {database, auth} from "../config/firebase"
import "./styles/Chats.css"
import { useAuthState } from 'react-firebase-hooks/auth';

function Chats(){

    const [user, loading] = useAuthState(auth)
    const conversationRef = collection(database, "conversation")
    const [chats, setChats] = useState([])

    const fetchChats = async()=>{
        let returnedValues = []
        const q = query(conversationRef,
                        where("userId", "==", user.uid),
                        orderBy('createdAt', "desc"))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((snapshot)=>{
            returnedValues.push({id: snapshot.id,...snapshot.data()})
        })
        console.log(returnedValues)
        setChats(returnedValues)
    }

    useEffect(()=>{
        if(!loading){
            fetchChats()
        }
    }, [loading])

    return (
        <div className="chats">
            {chats.map((chat)=>
                <Chat
                    name={chat.name}
                    message={chat.message}
                    profilePic={chat.profileUrl}
                    chatId = {chat.id}
                />
            )}
        </div>
    );
}

export default Chats