import React from 'react'
import "./styles/SwipeButtons.css"
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import StarRateIcon from '@mui/icons-material/StarRate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { IconButton } from '@mui/material';

function SwipeButtons(){
    return (
        <div className="swipeButtons">
            {/* <IconButton className='swipeButton__repeat'>
                <ReplayIcon fontSize="large"/>
            </IconButton> */}
            <IconButton className='swipeButton__left'>
                <CloseIcon fontSize="large"/>
            </IconButton>
            {/* <IconButton className='swipeButton__star'>
                <StarRateIcon fontSize="large"/>
            </IconButton> */}
            <IconButton className='swipeButton__right'>
                <FavoriteIcon fontSize="large"/>
            </IconButton>
            {/* <IconButton className='swipeButton__lightning'>
                <FlashOnIcon fontSize="large"/>
            </IconButton> */}

        </div>
    );
}

export default SwipeButtons