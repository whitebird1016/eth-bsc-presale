import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './style.scss';
import { roundValue } from '../../utils';
import { useAccount, useBalance } from 'wagmi';
import { getAccountBalance, getAccountBalanceUSDT } from '../../contracts/api';
import { toast } from 'react-toastify';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default ({ bnbPrice, onChange, coin, setCoin, onTokenChange, tokenPriceInBNB, tokenPriceInUSDT }) => {
    const [payAmount, setPayAmount] = useState("");
    const [buyAmount, setBuyAmount] = useState("");
    const [balanceBNB, setBalanceBNB] = useState(0);
    const [balanceUSDT, setBalanceUSDT] = useState(0);
    const { address } = useAccount();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onCoinChange = (_coin) => {
        setCoin(_coin);
        handleClose();
        onTokenChange(_coin);

        if (_coin === 'bnb') {
            setBuyAmount(roundValue(payAmount / tokenPriceInBNB));
        } else {
            setBuyAmount(roundValue(payAmount / tokenPriceInUSDT));
        }
    }

    useEffect(() => {
        getBalance();
    }, [address]);

    const getBalance = async () => {
        if (!address) return;

        const _balance = await getAccountBalance(address);
        setBalanceBNB(_balance);

        const _balance_usdt = await getAccountBalanceUSDT(address);
        setBalanceUSDT(_balance_usdt);
    }

    const onPayAmount = (e) => {
        const _amount = e.target.value;

        if (isNaN(_amount)) {
            toast.error('Please enter a valid number');
            return;
        }

        setPayAmount(_amount);

        if (coin === 'bnb') {
            setBuyAmount(roundValue(_amount / tokenPriceInBNB));
        } else {
            setBuyAmount(roundValue(_amount / tokenPriceInUSDT));
        }
    }

    const onBuyAmount = (e) => {
        const _amount = e.target.value;

        if (isNaN(_amount)) {
            toast.error('Please enter a valid number');
            return;
        }

        setBuyAmount(_amount);

        if (coin === 'bnb') {
            setPayAmount(roundValue(_amount * tokenPriceInBNB));
        } else {
            setPayAmount(roundValue(_amount * tokenPriceInUSDT));
        }
    }

    const onMax = () => {
        if (coin === 'bnb') {
            setPayAmount(roundValue(balanceBNB));
            setBuyAmount(roundValue(balanceBNB / tokenPriceInBNB));
        } else {
            setPayAmount(roundValue(balanceUSDT));
            setBuyAmount(roundValue(balanceUSDT / tokenPriceInUSDT));
        }
    }

    useEffect(() => {
        onChange(payAmount);
    }, [payAmount])

    return (
        <Box className="purchase-wrapper">
            <Typography className='text-center price-text'>
                1 VAC = {coin === 'bnb' ? tokenPriceInBNB : tokenPriceInUSDT} {coin}
                <p style={{ wordWrap: "break-word", textTransform: "initial" }}>CA: 0x6e78485C7F8cc1ae391e77C698E2c7EeDA0F0F38</p>
            </Typography>
            <Box className="input-group">
                <div>
                    <Typography className='fs-18'>Amount</Typography>
                    <input type="text" placeholder="0.00" value={payAmount} onChange={onPayAmount} />
                    <Typography className='price'>
                        $ {coin === 'bnb' ? roundValue(bnbPrice * payAmount, 0) : (payAmount || 0)}
                    </Typography>
                </div>
                <div className='flex flex-col items-end'>
                    <Button variant="contained" className='btn-max' onClick={onMax}>MAX</Button>
                    <Box
                        id="coinmenu-button"
                        className="flex items-center cursor-pointer coin-wrapper"
                        aria-controls={open ? 'coin-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <img src={`/assets/images/${coin}.png`} alt={coin} />
                        <Typography className='coin-name'>{coin}</Typography>
                        <ArrowDropDownIcon />
                    </Box>
                </div>
                <Menu
                    id="coin-menu"
                    className='coin-menu'
                    aria-labelledby="coinmenu-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem onClick={() => onCoinChange('bnb')}>
                        <Box className="flex items-center menu-item">
                            <img src="/assets/images/bnb.png" alt="bnb" />
                            <Typography className='coin-name'>BNB</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem onClick={() => onCoinChange('usdt')}>
                        <Box className="flex items-center menu-item">
                            <img src="/assets/images/usdt.png" alt="usdt" />
                            <Typography className='coin-name'>USDT</Typography>
                        </Box>
                    </MenuItem>
                </Menu>
            </Box>

            <Box className="input-group">
                <div>
                    <Typography className='fs-18'>Receive</Typography>
                    <input type="text" placeholder="0.00" value={buyAmount} onChange={onBuyAmount} />
                    <Typography className='price'>
                        $ {roundValue(buyAmount * tokenPriceInUSDT, 2)}
                    </Typography>
                </div>
                <div className='flex items-center coin-wrapper'>
                    <img src="/assets/images/vac.png" alt="vac" />
                    <Typography className='coin-name'>VAC</Typography>
                </div>
            </Box>
        </Box>
    )
}
