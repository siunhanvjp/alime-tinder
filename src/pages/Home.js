import React from 'react'
import { useState, useEffect, useRef, useMemo, createRef } from 'react';
import TinderCard from 'react-tinder-card'
import {collection, getDocs, query, 
    where, limit, orderBy, addDoc, serverTimestamp} from "firebase/firestore"
import {database, auth} from "../config/firebase"
import "./styles/Home.css"
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';
import {useAuthState} from "react-firebase-hooks/auth"
import arrayShuffle from 'array-shuffle';

const getRandomInt = (max, min=0)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function Home(){
    const [characters, setCharacters] = useState([])
    const [randomNum, setRandomNum] = useState(3)
    const [currentIndex, setCurrentIndex]= useState(-2)
    const [encounterList, setEncounterList] = useState([])

    const canSwipe = ()=>{return currentIndex >= 0}

    const characterRef = collection(database, "character")
    const encounterRef = collection(database, "encounter")
    const conversationRef = collection(database, "conversation")

    const [user, loading] = useAuthState(auth)


    const fetchCharacters = async(encounterChars=encounterList) =>{
        let returnedValues = []
        if(encounterChars.length===0) {
            encounterChars = ["0"]
        }
        const q = query(characterRef)
        const querySnapshot = await getDocs(q)
        const setEncounter = new Set(encounterChars);      
        querySnapshot.forEach((snapshot)=>{
            if(!setEncounter.has(snapshot.id)){
                returnedValues.push({id: snapshot.id,...snapshot.data()})
            }
        })
        const shuffled = arrayShuffle(returnedValues);
        // returnedValues = filterCharacters(returnedValues, encounterChars)
        setCharacters(shuffled)
        setCurrentIndex(shuffled.length-1)
    }

    const filterCharacters = (characters, encounterChars) => {
        return characters
          .filter(character => !encounterChars.includes(character.id))
          .filter(character => character.idx <= 3)
          .slice(0, 3);
      };

    const fetchEncounter = async ()=>{
        const res = []
        const queryEncounter = query(encounterRef, where("userId", "==", user.uid))
        const encounterData = await getDocs(queryEncounter)
        encounterData.forEach((doc)=>{
            res.push(doc.data().characterId)
        })
        return res
    }

    useEffect(()=>{
        if(currentIndex !== -2){ // if not at the beginnning
            fetchCharacters() 
        }
    },[randomNum])

    useEffect(()=>{
        if(!loading){
            let encounterChars = fetchEncounter()
            encounterChars.then((chars)=>{
                setEncounterList(chars)
                fetchCharacters(chars)
            })
        }
    }, [loading])

    const childRefs = useMemo(
        () =>
          Array(characters?.length)
            .fill(0)
            .map((i) => createRef()),
        [characters]
    )
    
    const swiped = async (direction, cid, index, curl, cname, corigin) => {
        await addDoc(encounterRef,{
            userId: user.uid,
            characterId: cid
        })
        setEncounterList([...encounterList, cid])
        if(direction === "right"){
            await addDoc(conversationRef,{
                userId: user.uid,
                characterId: cid,
                message: "New Conversation",
                profileUrl: curl, 
                name: cname,
                origin: corigin,
                createdAt: serverTimestamp()
            })
        }
        setCurrentIndex(index-1)
    }

    const swipe = async (dir) => {
        if (canSwipe() && currentIndex < characters?.length) {
            try{
                await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
            } catch(e) {
                console.log(e)
            }
        } else{
            console.log(canSwipe(), currentIndex)
        }
    }


    return (
        <div>
            {
                (!((characters.length==0)&&(currentIndex!=-2)))?
                    (<div className="tinderCards__cardContainer">
                        {characters?.map( (character, index)=>{
                            if (index <= currentIndex)
                            return (<TinderCard
                                ref={childRefs[index]}
                                className="swipe"
                                key={character.id}
                                onSwipe={(dir) => swiped(dir, character.id, index, character.url, character.name, character.origin)}
                                preventSwipe={["up", "down", "left", "right"]}
                            >
                                <div 
                                    style={{backgroundImage: `url(${character.url})`}}
                                    className="card"
                                >
                                    <h2>{character.name}</h2>
                                </div>
                            </TinderCard>)
                        })
                        }
                    </div>)
                    :
                    (<div class="center-container">
                        <div class="quote">
                            <h3>OUT OF CHARACTER</h3>
                            <h3>GO GET A LIFE WJBU RACH</h3>
                        </div>
                    </div>)

            }

            <div className="swipeButtons">
                <IconButton className='swipeButton__left' onClick={()=>{swipe('left')}}>
                    <CloseIcon fontSize="large"/>
                </IconButton>

                <IconButton className='swipeButton__right' onClick={()=>{swipe('right')}}>
                    <FavoriteIcon fontSize="large"/>
                </IconButton>
             </div>

            
        </div>
    );
}

export default Home