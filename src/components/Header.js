import React from 'react'
import './styles/Header.css'
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import {IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
function Header({backButton}){
    return (
        <div className="header">
            
            <Link to={backButton?backButton:"/profile"}>
                <IconButton>
                    {backButton?
                        <ArrowBackIosIcon className="header__icon" fontSize='large'/>:
                        <PersonIcon className="header__icon" fontSize='large'/>
                    }
                </IconButton>
            </Link>
            <Link to="/home">
                <img 
                className='header__logo'
                src="https://1000logos.net/wp-content/uploads/2018/07/Tinder-icon.png" 
                
                alt="tinder-logo" />
            </Link>
            
            <Link to="/chat">
                <IconButton>
                    <ForumIcon className="header__icon" fontSize="large" />
                </IconButton>
            </Link>
                
            
        </div>
    );
}

export default Header