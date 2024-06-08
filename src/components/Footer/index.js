import React from 'react';
import './style.scss';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';

const TikTokIcon = ({ color = "#000000" }) => {
    return (
        <svg
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="24px"
            height="24px"
            opacity="0.5"
        >
            <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
        </svg>
    );
};

export default ({
    refAbout,
    refFeature,
    refPromote,
    scroll
}) => {
    return (
        <div className='footer-wrapper'>
            <Container className='footer-container'>
                <div className='link-group'>
                    <Box className='footer-logo'>
                        <img src="logo.png" alt="logo" />
                        <Typography className='fs-14'>Travel Smart, Invest Smarter</Typography>
                        <Typography className='fs-14'>© iVaCay 2024</Typography>
                    </Box>
                    <Box className="flex flex-col">
                        <Typography className='link-title'>iVaCay</Typography>
                        <Link className='fs-14' onClick={() => scroll(refAbout)}>About</Link>
                        <Link className='fs-14' onClick={() => scroll(refFeature)}>Future of Travel</Link>
                        <Link className='fs-14' onClick={() => scroll(refPromote)}>Presale</Link>
                    </Box>
                    <Box className="flex flex-col">
                        <Typography className='link-title'>Legal</Typography>
                        <Link target='_blank' to="https://www.dropbox.com/scl/fi/o05g3dqfcmyq1gfck7x9q/IVacay-Final-Litepaper.pdf?rlkey=oj2f3xpty3r4uydenvcrs5rb0&dl=0" className='fs-14'>Litepaper</Link>
                        <Link target='_blank' to="https://www.dropbox.com/scl/fi/ll5h9mtzmwwqugikfj74d/1.-User-Agreement-ivacay.pdf?rlkey=jicp99athq42ilo8f79cex4m1&dl=0" className='fs-14'>User Agreement</Link>
                        <Link target='_blank' to="https://www.dropbox.com/scl/fi/ll5h9mtzmwwqugikfj74d/1.-User-Agreement-ivacay.pdf?rlkey=jicp99athq42ilo8f79cex4m1&dl=0" className='fs-14'>Service Provider Terms</Link>
                        <Link target='_blank' to="https://www.dropbox.com/scl/fi/5n0erbqaituxmn1wljtbx/3.-Privacy-Policy-ivacay.pdf?rlkey=j8pi70rnc484ze68z8doua938&dl=0" className='fs-14'>Privacy Policy</Link>
                        <Link target='_blank' to="https://www.dropbox.com/scl/fi/m7914h222cb7tgj45ea4s/7.-Community-Guidelines-ivacay.pdf?rlkey=lyzlca179px09tknjxw6op6wz&dl=0" className='fs-14'>Community Guideline</Link>
                    </Box>
                </div>
                <div className='button-group'>
                    <Link target='_blank' to="https://x.com/ivacay01?s">
                        <IconButton className='btn-icon'><TwitterIcon /></IconButton>
                    </Link>
                    <Link target='_blank' to="https://www.instagram.com/ivacay01?igsh=MzRlODBiNWFlZA==">
                        <IconButton className='btn-icon'><InstagramIcon /></IconButton>
                    </Link>
                    <Link target='_blank' to="https://www.facebook.com/profile.php?id=100085681582359&mibextid=LQQJ4d">
                        <IconButton className='btn-icon'><FacebookIcon /></IconButton>
                    </Link>
                    <Link target='_blank' to="https://www.tiktok.com/@ivacay?_t=8k3eaPmE2Zj&_r=1">
                        <IconButton className='btn-icon'><TikTokIcon /></IconButton>
                    </Link>
                    <Link target='_blank' to="https://t.me/iVaCay">
                        <IconButton className='btn-icon'><TelegramIcon /></IconButton>
                    </Link>
                </div>
            </Container>
        </div>
    )
}
