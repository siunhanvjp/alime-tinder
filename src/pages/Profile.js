import React, {useState, useEffect} from 'react'
import "./styles/Profile.css"
import {database, auth} from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
import {signOut} from "firebase/auth"
import {useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import { doc, collection, query, getDocs,
     where, onSnapshot, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material';

function CreateAccount(){

    const [user, loading] = useAuthState(auth)
    const [userProfile, setUserProfile] = useState(null)
    const [userProfileId, setUserProfileId] = useState(null)
    const navigate = useNavigate()

    const schema = yup.object().shape({
        name: yup.string().required("Name Field is required !!!"),
        gender: yup.string().required("Gender Field is required !!!"),
        genderPref: yup.string().required("GenderPref Field is required !!!"),
        dob_month: yup.number().required("Birthday Field is required !!!"),
        dob_day: yup.number().required("Birthday Field is required !!!"),
        dob_year: yup.number().required("Birthday Field is required !!!"),
        about: yup.string(),
    });

    const userRef = collection(database, "user")
    useEffect(()=>{
        if(!loading){
            const q = query(userRef, where("userId", "==", user.uid))

            const unsub = onSnapshot(q, (snapshot)=>{
                console.log("called")
                const snapshotData = snapshot.docs.map(doc=>doc.data())[0]
                const dob = snapshotData.birthday.split("-")
                const profileData = {...snapshotData, dob_month:dob[1], dob_day:dob[0], dob_year:dob[2]}
                delete profileData.birthday
                delete profileData.userId
                setUserProfile(profileData)

                getDocs(q).then((querySnapshot)=>{
                    setUserProfileId(querySnapshot.docs[0].id)
                })
            })
            return ()=>{
                unsub()
            }
        }
        
    }, [user])

    
    const {register, reset,  handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    })

    useEffect(()=>{
        reset({ ...userProfile})
    }, [userProfile])


    const onUpdateUser = async (data)=>{
        console.log("updating...")
        await updateDoc(doc(database, "user", userProfileId),{
            name: data.name,
            gender: data.gender,
            genderPref: data.genderPref,
            birthday: `${data.dob_day}-${data.dob_month}-${data.dob_year}`,
            about: data.about,
            userId: user?.uid
        })
        console.log("done")
    }

    const signOutUser = async() =>{
        await signOut(auth)
        navigate("/")
    }

    return (
        <div className="onboarding" >
            {loading ? "Loading...": ""}
            <h2> UPDATE PROFILE </h2>
            <form onSubmit={handleSubmit(onUpdateUser)}>
                <section>
                    <label htmlFor="first_name">Name</label>
                    <input
                        id="first_name"
                        placeholder="Name"
                        {...register("name")}
                    />

                    <label>Birthday</label>
                    <div className="multiple-input-container">
                        <input
                            id="dob_day"
                            placeholder="DD"
                            type="number"
                            {...register("dob_day")}
                        />

                        <input
                            id="dob_month"
                            placeholder="MM"
                            type="number"
                            {...register("dob_month")}
                        />

                        <input
                            id="dob_year"
                            placeholder="YYYY"
                            type="number"
                            {...register("dob_year")}
                        />
                    </div>

                    <label>Gender</label>
                    <div className="multiple-input-container">
                        <input
                            id="man-gender-identity"
                            type="radio"
                            value="man"
                            {...register("gender")}
                        />
                        <label htmlFor="man-gender-identity">Man</label>
                        <input
                            id="woman-gender-identity"
                            type="radio"
                            value="woman"
                            {...register("gender")}
                        />
                        <label htmlFor="woman-gender-identity">Woman</label>
                        <input
                            id="more-gender-identity"
                            type="radio"
                            value="more"
                            {...register("gender")}
                        />
                        <label htmlFor="more-gender-identity">More</label>
                    </div>

                    <label>Show Me</label>

                    <div className="multiple-input-container">
                        <input
                            id="man-gender-interest"
                            type="radio"
                            value="man"
                            {...register("genderPref")}
                        />
                        <label htmlFor="man-gender-interest">Man</label>
                        <input
                            id="woman-gender-interest"
                            type="radio"
                            value="woman"
                            {...register("genderPref")}
                        />
                        <label htmlFor="woman-gender-interest">Woman</label>
                        <input
                            id="everyone-gender-interest"
                            type="radio"
                            value="everyone"
                            {...register("genderPref")}
                        />
                        <label htmlFor="everyone-gender-interest">Everyone</label>

                    </div>

                    <label htmlFor="about">About me</label>
                    <input
                        id="about"
                        placeholder="Describe yourself..."
                        {...register("about")}
                        
                    />

                    <input type="submit"/>
                </section>

            </form>
            <Button
                onClick={signOutUser}
                size="medium"
                variant="outlined"
                color="error"
            >
                SIGN OUT
            </Button>
             
        </div>
    );
}

export default CreateAccount