import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./style.scss";
import Header from '../../components/Header';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReactPlayer from 'react-player/lazy';
import Countdown from 'react-countdown';
import { zeroPad } from "react-countdown";
import Purchase from '../../components/Purchase';
import { convertDateString, isStarted, roundValue, showError } from '../../utils';
import { useAccount } from 'wagmi';
import Footer from '../../components/Footer';
import ScrollAnimation from 'react-animate-on-scroll';
import { buyTokenByBNB, getHardCap, getBNBRaised, getSoftCap, getStartTime, getTokenPriceInBNB, useContract, getTokenPriceInUSDT, buyTokenByUSDT, getUSDTRaised, approveUSDT, getEndTime } from '../../contracts/api';
import { toast } from 'react-toastify';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { address } = useAccount();
  const refAbout = useRef(null);
  const refFeature = useRef(null);
  const refPromote = useRef(null);
  const refBuy = useRef(null);
  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);
  const [bnbPrice, setBNBPrice] = useState(0);
  const [hardCap, setHardCap] = useState(0);
  const [raised, setRaised] = useState(0);
  const [coin, setCoin] = useState('bnb');
  const [tokenPriceInBNB, setTokenPriceInBNB] = useState(0.00065);
  const [tokenPriceInUSDT, setTokenPriceInUSDT] = useState(0.25);
  const [payAmount, setPayAmount] = useState(0);
  const { contract, usdtContract } = useContract();
  const { open } = useWeb3Modal();

  const CountdownRender = ({ days, hours, minutes, seconds }) => {
    return <div className='countdown'>{zeroPad(days)} : {zeroPad(hours)} : {zeroPad(minutes)} : {zeroPad(seconds)}</div>;
  };

  const scroll = (_ref) => {
    window.scrollTo({
      top: _ref.current.offsetTop - 100,
      behavior: "smooth"
    })
  }

  const getStartDate = async () => {
    try {
      const _start = await getStartTime();
      setStartDate(_start);
      const _end = await getEndTime();
      setEndDate(_end);
    } catch (e) {
      showError(e);
    }
  }

  const initHardCap = async () => {
    try {
      const _hardcap = await getHardCap();
      setHardCap(_hardcap);
    } catch (e) {
      showError(e);
    }
  }

  const initCurrentCap = async () => {
    try {
      const _raised = await getBNBRaised();
      const _raised_usdt = await getUSDTRaised();
      setRaised(_raised + _raised_usdt / bnbPrice);
    } catch (e) {
      showError(e);
    }
  }

  const initTokenPrice = async () => {
    try {
      const _price_bnb = await getTokenPriceInBNB();
      const _price_usdt = await getTokenPriceInUSDT();

      setTokenPriceInBNB(_price_bnb);
      setTokenPriceInUSDT(_price_usdt);
    } catch (e) {
      showError(e);
    }
  }

  const getBNBPrice = useCallback(async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
      const res = await response.json();

      setBNBPrice(res?.binancecoin?.usd || 0);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onPayAmount = (_amount) => {
    setPayAmount(_amount);
  }

  useEffect(() => {
    getStartDate();
    getBNBPrice();
    initHardCap();
    initCurrentCap();
    initTokenPrice();
  }, []);

  useEffect(() => {
    if (!contract || !address) return;

    const tokensPurchasedEvent = contract.events['TokensPurchased']({
      filter: { buyer: address }
    })
      .on('data', (event) => {
        toast.success(`Tokens successfully purchased`);
      })
      .on('error', console.error);

    return () => {
      tokensPurchasedEvent.removeAllListeners('TokensPurchased');
    };

  }, [contract, address]);

  useEffect(() => {
    if (!usdtContract || !address) return;

    const approvalEvent = usdtContract.events['Approval']({
      filter: { owner: address }
    })
      .on('data', (event) => {
        const _amount = event.returnValues.value;
        toast.success(`Token Approved.`);
        buyTokenByUSDT(address, _amount / 10 ** 18);
      })
      .on('error', console.error);

    return () => {
      approvalEvent.removeAllListeners('TokensPurchased');
    };

  }, [usdtContract, address]);

  const onTokenChange = (_coin) => {
    setCoin(_coin);
  }

  const onConfirm = async (e) => {
    if (!address) {
      await open();
      return;
    }

    if (!isStarted(startDate)) {
      toast.info("Presale is not started");
      return;
    }

    const _payAmount = payAmount / 1;
    if (isNaN(_payAmount)) {
      toast.error('Please enter a valid number');
      return;
    }

    if (coin === 'bnb') {
      if (_payAmount < 0.065) {
        toast.info('Minimum amount is 0.065 BNB');
        return;
      }

      if (_payAmount > 46) {
        toast.info('Maximum amount is 46 BNB');
        return;
      }
    } else {
      if (_payAmount < 25) {
        toast.info('Minimum amount is 25 USDT');
        return;
      }

      if (_payAmount > 17500) {
        toast.info('Maximum amount is 17,500 USDT');
        return;
      }
    }

    if (coin === 'bnb') {
      await buyTokenByBNB(address, _payAmount);
    } else {
      const allowance = await approveUSDT(address, _payAmount);
      if (allowance) {
        await buyTokenByUSDT(address, _payAmount);
      }
    }
  }

  return (
    <>
      <Header
        refAbout={refAbout}
        refFeature={refFeature}
        refPromote={refPromote}
        scroll={scroll}
      />
      <Container className='home-container' disableGutters>
        <Box className="banner-wrapper">
          <Box className="banner-text">
            <h2>Travel Smart</h2>
            <h1>Invest Smarter</h1>
            <p>iVaCay Where Blockchain Turns Vacations into Profits.</p>
            <Box className="btn-group">
              <Button className='btn-buy' variant="contained" onClick={() => scroll(refBuy)}>Buy Now</Button>
              <Link target="_blank" to="https://x.com/ivacay01?s">
                <Button className='btn-join' variant="outlined">Join Community</Button>
              </Link>
            </Box>
          </Box>
          <Box component="img" src="/assets/images/banner.png" alt="banner" className="banner-img" />
        </Box>

        <Box className="scroll-down">
          <div>Scroll Down</div>
          <KeyboardArrowDownIcon />
        </Box>

        <Box className="about-wrapper" ref={refAbout}>
          <ScrollAnimation initiallyVisible={true} animateIn='flipInY'>
            <Box className="about-text">
              About iVaCay
            </Box>
          </ScrollAnimation>
          <ScrollAnimation animateIn='fadeIn'>
            <Box className="about-content">
              <Box component="img" src="/assets/images/about.png" alt="about" className="about-img" />
              <Box className="description">
                <Box component="img" src="/assets/images/decoration.png" alt="decoration" className="decoration-img" />
                <h2>is <span className='highlight'>NOT</span> just a travel app</h2>
                <p>iVaCay isn't just a travel app; it's a groundbreaking investment opportunity. Our mission is to revolutionize vacations by offering investors seamless access to unparalleled experiences and lodging options through blockchain technology. What sets us apart is our bold integration of cryptocurrency payments, NFTs, and a tokenized ecosystem that rewards engagement. Join iVaCay and be part of the journey where every vacation is not just an adventure but a profitable endeavor.</p>
              </Box>
            </Box>
          </ScrollAnimation>
          <ReactPlayer className='video' url="https://youtu.be/HbXKUZYqaV4?si=4kpl4UVsahATJdPA" controls={true} />
        </Box>

        <ScrollAnimation animateIn='fadeIn'>
          <Box className="travel-content" ref={refFeature}>
            <Box className="description">
              <ScrollAnimation initiallyVisible={true} animateIn='flipInY'>
                <Box component="img" src="/assets/images/decoration.png" alt="decoration" className="decoration-img" />
                <h2>Future of Travel and Experiences</h2>
              </ScrollAnimation>
              <p>iVacay is spearheading the future of travel with disruptive blockchain innovation. By harnessing XRPL for payments and tokenization, we're not only revolutionizing how travelers transact but also creating a secure and seamless experience. Our incorporation of NFTs elevates travel to new heights by capturing moments and curating personalized experiences like never before. iVacay isn't just a travel platform; it's a visionary investment opportunity poised to redefine the entire travel industry landscape.</p>
            </Box>
            <Box component="img" src="/assets/images/travel.png" alt="travel" className="travel-img" />
          </Box>
        </ScrollAnimation>

        <ScrollAnimation animateIn='fadeIn'>
          <Box className="earning-content">
            <Box className="description">
              <ScrollAnimation initiallyVisible={true} animateIn='bounceInLeft'>
                <Box component="img" src="/assets/images/decoration.png" alt="decoration" className="decoration-img" />
                <h2>Earning Passive Income</h2>
              </ScrollAnimation>
              <p>iVaCay offers investors a golden opportunity to earn passive income in the flourishing travel market. With properties and hotels available for investment using tokens, users can unlock lucrative real estate returns while indulging in luxurious vacations. Our innovative fee structure incentives engagement, and strategic acquisitions of timeshare properties amplify earning potential. iVaCay isn't just a vacation; it's an unparalleled investment journey where every moment counts towards financial prosperity. Join us and seize the future of travel investments with iVaCay.</p>
            </Box>
            <Box component="img" src="/assets/images/earning.png" alt="travel" className="earning-img" />
          </Box>
        </ScrollAnimation>

        <ScrollAnimation animateIn='fadeIn'>
          <Box className="presale-content" ref={refPromote}>
            <Box className="description">
              <ScrollAnimation initiallyVisible={true} animateIn='flipInY'>
                <Box component="img" src="/assets/images/decoration.png" alt="decoration" className="decoration-img" />
                <h2>Presale is live!</h2>
              </ScrollAnimation>
              <p>Discover a new realm of financial freedom with iVaCay: Where NFTs, VacayCoin, and timeshares unite to redefine transactions, offering seamless experiences and unparalleled value creation</p>
            </Box>
            <Box className="roadmap">
              <Box component="img" src="/assets/images/chart.png" alt="chart" className="chart-img" />
              <Box>
                <Grid container spacing={2}>
                  <Grid className='text-bold label' item xs={5} md={4}>
                    Total Supply:
                  </Grid>
                  <Grid className='fs-18' item xs={7} md={8}>
                    100M VacayCoins (VAC).
                  </Grid>
                  <Grid className='text-bold label' item xs={5} md={4}>
                    Start Date:
                  </Grid>
                  <Grid className='fs-18' item xs={7} md={8}>
                    {/* {convertDateString(startDate)} */}
                    2024-03-27 10:00:00
                  </Grid>
                  <Grid className='text-bold label' item xs={5} md={4}>
                    End Date:
                  </Grid>
                  <Grid className='fs-18' item xs={7} md={8}>
                    {/* {convertDateString(startDate)} */}
                    2024-06-15 12:00:00
                  </Grid>
                </Grid>

                <Box className="caps-group">
                  <Box className="text-center soft-cap">
                    <Typography className='cap-label'>Soft Cap</Typography>
                    <Typography className='cap-amount'><span className="unit">$</span>5M</Typography>
                  </Box>
                  <Box className="text-center hard-cap">
                    <Typography className='cap-label'>Hard Cap</Typography>
                    <Typography className='cap-amount'><span className="unit">$</span>15M</Typography>
                  </Box>
                </Box>
                <Box className="progress-bar">
                  <div className="soft"></div>
                  <Box className="progress" sx={{ width: hardCap === 0 ? "0%" : `${(raised / hardCap).toFixed(0)}%` }}></Box>
                </Box>

                <Grid container spacing={1}>
                  <Grid className='fs-16' item xs={8} md={6}>
                    ICO Sale
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    25%
                  </Grid>
                  <Grid className='fs-16' item xs={8} md={6}>
                    Public Sale
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    15.6%
                  </Grid>
                  <Grid className='fs-16' item xs={8} md={6}>
                    Private Sale
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    6.3%
                  </Grid>
                  <Grid className='fs-16' item xs={8} md={6}>
                    Pre-Sale
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    3.1%
                  </Grid>
                  <Grid className='fs-16' item xs={8} md={6}>
                    Team and Advisors
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    12.5%
                  </Grid>
                  <Grid className='fs-16' item xs={8} md={6}>
                    Reserve Fund
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    12.5%
                  </Grid>
                  <Grid className='fs-16' item xs={8} md={6}>
                    Partnerships and Marketing
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    9.4%
                  </Grid>
                  <Grid className='fs-16' item xs={8} md={6}>
                    Community Development
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    3.1%
                  </Grid>
                  <Grid className='fs-16' item xs={8} md={6}>
                    Ecosystem Incentives
                  </Grid>
                  <Grid className='fs-16' item xs={4} md={6}>
                    12.5%
                  </Grid>
                </Grid>

              </Box>
            </Box>
          </Box>
        </ScrollAnimation>

        <Box className="sale-content" ref={refBuy}>
          <Purchase
            bnbPrice={bnbPrice}
            onChange={onPayAmount}
            coin={coin}
            setCoin={setCoin}
            onTokenChange={onTokenChange}
            tokenPriceInBNB={tokenPriceInBNB}
            tokenPriceInUSDT={tokenPriceInUSDT}
          />
          <ScrollAnimation delay={1000} animateIn='tada' initiallyVisible={true}>
            <Typography className='comment'>{isStarted(endDate) ? "Presale is completed" : "Presale is live!"}</Typography>
            <Typography className='comment small'>Presale ends in</Typography>
          </ScrollAnimation>
          {endDate ? <Countdown date={convertDateString(endDate)} renderer={CountdownRender} /> : ""}
          <Button className='btn-buy' variant="contained" onClick={onConfirm}>
            {address ? "Buy Now" : "Connect"}
          </Button>
        </Box>
      </Container >

      <Footer
        refAbout={refAbout}
        refFeature={refFeature}
        refPromote={refPromote}
        scroll={scroll}
      />
    </>
  )
}
