import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import TinderCard from 'react-tinder-card'
import "./styles/TinderCards.css"
import {collection, onSnapshot, query} from "firebase/firestore"
import {firebaseApp, database} from "../config/firebase"


function TinderCards(){
    const [characters, setCharacters] = useState()
    const characterRef = collection(database, "character")
    
    // fetch data
    useEffect(()=>{
        const unsub = onSnapshot(query(characterRef), (snapshot)=>{
            setCharacters(snapshot.docs.map(doc=>doc.data()))
        })
        return () =>{
            unsub()
        }
    },[])


    const handleSwipe = async (direction)=>{

    }



    return (
        <div>

            <div className="tinderCards__cardContainer">
                {characters?.map( (character)=>(
                    <TinderCard
                        className="swipe"
                        key={character.name}
                        flickOnSwipe={false}
                    >
                        <div 
                            style={{backgroundImage: `url(${character.url})`}}
                            className="card"
                        >
                            <h3>{character.name}</h3>
                        </div>
                    </TinderCard>
                ))
                }
            </div>

            
        </div>
    );
}

export default TinderCards