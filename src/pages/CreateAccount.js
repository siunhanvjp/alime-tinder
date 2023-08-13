import React, {useState} from 'react'
import "./styles/Profile.css"
import {database, auth} from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'

import {useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import { addDoc, collection } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function CreateAccount(){

    const [user, loading, error] = useAuthState(auth)
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

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    })

    const userRef = collection(database, "user")
    const onCreateUser = async (data)=>{
        await addDoc(userRef, {
            name: data.name,
            gender: data.gender,
            genderPref: data.genderPref,
            birthday: `${data.dob_day}-${data.dob_month}-${data.dob_year}`,
            about: data.about,
            userId: user?.uid
        })

        navigate("/home")

    }


    const [formData, setFormData] = useState({
        first_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        url: "",
        about: "",
        matches: []

    })


    return (
        <div className="onboarding">
            <h2> CREATE ACCOUNT </h2>
            <form onSubmit={handleSubmit(onCreateUser)}>
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
                            type="number"
                            placeholder="DD"
                            {...register("dob_day")}
                        />

                        <input
                            id="dob_month"
                            type="number"
                            placeholder="MM"
                            {...register("dob_month")}
                        />

                        <input
                            id="dob_year"
                            type="number"
                            placeholder="YYYY"
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
             
        </div>
    );
}

export default CreateAccount