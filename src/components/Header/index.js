import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, IconButton, Container, Menu, MenuItem, Typography, Button } from '@mui/material';
import "./style.scss";
import Hamburger from 'hamburger-react';
import { CopyAll, Logout } from '@mui/icons-material';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Link } from 'react-router-dom';
import { formatAddress } from './../../utils/index';
import { toast } from 'react-toastify';

export default function Navbar({
    refAbout,
    refFeature,
    refPromote,
    scroll
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { open } = useWeb3Modal();

    const handleSignIn = async () => {
        await open();
    }

    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        toast.success('Copied');
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const isTop = window.scrollY > 100;
            const header = document.querySelector('.fixed-header');
            if (isTop) {
                header.classList.add('scrolled-header');
            } else {
                header.classList.remove('scrolled-header');
            }
        });
    }, []);

    return (
        <Box className="fixed-header">
            <Container className='navbar-container' disableGutters>
                <Box component="img" className="icon" to="/" src="logo.png" />
                <Box className="nav-link-box">
                    <IconButton
                        id="basic-button"
                        className="menu-icon"
                        aria-controls={openMenu ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <Hamburger toggled={openMenu} />
                    </IconButton >
                    <Box className="nav-link-box list-items">
                        <Typography className="nav-link" onClick={() => scroll(refAbout)}>About</Typography>
                        <Typography className="nav-link" onClick={() => scroll(refFeature)}>Feature</Typography>
                        <Typography className="nav-link" onClick={() => scroll(refPromote)}>Presale</Typography>
                        {!address && <Button className='btn-connect' onClick={handleSignIn}>Connect</Button>}
                    </Box>
                    {address &&
                        <Box className="flex items-center">
                            <CopyAll className='copy-icon' onClick={copyAddress} />
                            <Typography className='address'>{formatAddress(address)}</Typography>
                            <Logout className='copy-icon' onClick={disconnect} />
                        </Box>
                    }
                </Box>
                <Menu
                    className="mobile-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {!address && <MenuItem className='btn-connect' onClick={handleSignIn}>Connect</MenuItem>}
                    <MenuItem onClick={handleClose}><Link onClick={() => scroll(refAbout)} >About</Link></MenuItem>
                    <MenuItem onClick={handleClose}><Link onClick={() => scroll(refFeature)} >Feature</Link></MenuItem>
                    <MenuItem onClick={handleClose}><Link onClick={() => scroll(refPromote)} >Presale</Link></MenuItem>
                </Menu>
            </Container>
        </Box>
    )
}
