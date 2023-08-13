import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import { useParams } from "react-router-dom";
import {collection, getDocs, query, 
    where, limit, orderBy, addDoc, serverTimestamp } from "firebase/firestore"
import {database, auth} from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth';
import "./styles/ChatScreen.css"
import cryptoRandomString from 'crypto-random-string';
import {useQuery} from 'react-query'
import axios from "axios"


function ChatScreen(){
    const messagesEndRef = useRef(null)
    const {character} = useParams()
    const [messages, setMessages] = useState([])
    const [characterInfo, setCharacterInfo] = useState({})
    const [inputText, setInputText]= useState("")
    const [loadingResponse, setLoadingResponse] = useState(false)
    const [fetching, setFetching] = useState(false) 
    const [chatHistory, setChatHistory] = useState([])
    //sandbox
    // const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTY5MjE5ZWQtZDdmZC00YzQ0LTg4ZjUtNGY4YmI0MjA5ZjRhIiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.nfCUTFM8nO2S1Vq_Lt5fhKGG8EVcscGu9f83uL0qReQ"

    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTY5MjE5ZWQtZDdmZC00YzQ0LTg4ZjUtNGY4YmI0MjA5ZjRhIiwidHlwZSI6ImFwaV90b2tlbiJ9.gLxym4Lnmmn7Kk8p7x9KbNiPN05OJEJar-JtOjpl9vM"

    const messageRef = collection(database, "message")

    const scrollToBottom = (behaviorType) => {
        messagesEndRef.current?.scrollIntoView({ behavior: behaviorType })
      }
    useEffect(() => {
        scrollToBottom("smooth");
    }, [messages]);

    useEffect(() => {
        scrollToBottom("auto");
    });

    const fetchConversation = async()=>{
        let returnedValues = []
        const msgHistory = []
        const conversationRef = collection(database, "conversation")
        const queryConversation = query(conversationRef,
                                        where("__name__", "==", character))
        const returnedConverasation = await getDocs(queryConversation)
        returnedConverasation.forEach((snapshot)=>{
            returnedValues.push({...snapshot.data()})
        })
        const {characterId, userId} = returnedValues[0]
        setCharacterInfo(returnedValues[0])

        const queryMessages = query(messageRef,
                                    orderBy("createdAt"),
                                    where("userId", "==", userId),
                                    where("charId", "==", characterId))
        const returnedMessages = await getDocs(queryMessages)
        returnedValues = []
        returnedMessages.forEach((snapshot)=>{
            let msg = snapshot.data()
            returnedValues.push({id: snapshot.id, ...msg})
            msgHistory.push({role: msg.sender?"user":"assistant", message: msg.content})
        })
        setMessages(returnedValues)
        setChatHistory(msgHistory)
    }
    useEffect(()=>{
        fetchConversation()
    }, [])

    useEffect(()=>{
        if(fetching){
            setLoadingResponse(true)
            fetchCharMess(messages[messages.length-1].content)
            setFetching(false)
        }
    }, [messages])
    

    async function fetchChatResponse(userInput) {
        const options = {
            method: 'post',
            url: 'https://api.edenai.run/v2/text/chat',
            headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer ' + apiKey,
            },
            data: {
                response_as_dict: true,
                attributes_as_list: false,
                show_original_response: false,
                settings: { openai: 'gpt-3.5-turbo-0301' },
                temperature: 0.5,
                max_tokens: 100,
                providers: 'openai',
                text: userInput,
                chatbot_global_action: `I want you to act like ${characterInfo.name} from ${characterInfo.origin}. I want you to respond and answer like ${characterInfo.name} using the tone, manner and vocabulary ${characterInfo.name} would use. Do not write any explanations. Only answer like ${characterInfo.name}.` + "Your response is under 60 words only.",
                previous_history: chatHistory.slice(-10),
            },
        };
        try {
            const response = await axios(options);
            const status = response.data.openai.status
            if (status == "success"){
                const returnedMsg = response.data.openai.generated_text
                setChatHistory([...chatHistory, {role: "user", message: userInput}, {role: "assistant", message: returnedMsg}])
                return {status:"success", content: returnedMsg}
            } else{
                return {status:"error", content:"there is error, try again later"}
            }
        } catch (error) {
            console.error(error);
        }
    }



    const fetchCharMess = async(userInput)=>{
        const response = await fetchChatResponse(userInput)
        setLoadingResponse(false)
        const messageContent = {
            id: cryptoRandomString({length: 10, type: 'base64'}),
            charId: characterInfo.characterId,
            sender: false,
            content: response.content,
            userId: characterInfo.userId,
            createdAt: serverTimestamp()
        }
        setMessages([...messages, messageContent]);
        if(response.status == "success"){
            await addDoc(messageRef, messageContent)
        }
    }

    const updateMessagesWithPromise = (messageContent) => {
        return new Promise((resolve) => {
          
          resolve(); // Resolve the promise after updating state
        });
      }; 
    
    const handleInputText = async()=>{
        const messageContent = {
            id: cryptoRandomString({length: 10, type: 'base64'}),
            charId: characterInfo.characterId,
            sender: true,
            content: inputText,
            userId: characterInfo.userId,
            createdAt: serverTimestamp()
        }
        setInputText("")
        setFetching(true)
        setMessages([...messages, messageContent]);
        await addDoc(messageRef, messageContent)
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        
        handleInputText()
 
        //make call to character api

    }

    return (
        <div className='ChatScreen' >
            <p className='chatScreen__timestamp'>You MATCH</p>
            {messages.map((message)=>(
                (!message.sender) ? 
                    <div key = {message.id} className="chatScreen__message">
                        <Avatar 
                            className='chatScreen__image'
                            alt={characterInfo.name} 
                            src={characterInfo.profileUrl} 
                        />
                        <p className='chatScreen__text'>{message.content}</p>
                    </div>
                :
                    <div key = {message.id} className="chatScreen__message">
                        <p className='chatScreen__textUser'>{message.content}</p>
                    </div>
            ))}
            <div ref={messagesEndRef} />
            <div>
                <form className='chatScreen__input' onSubmit={handleSubmit}>

                    <input className='chatScreen__inputField' 
                            required
                            type="text" placeholder='Type sth'
                            onChange={(e)=>{setInputText(e.target.value)}}
                            value={inputText}/>

                    <button type="submit" className='chatScreen__inputButton' 
                    disabled={!inputText.trim() || loadingResponse}>SEND</button>
                </form>
            </div>

        </div>

    );
}

export default ChatScreen