import { useEffect, useState } from 'react';
import ABI from './abi.json';
import VAC_ABI from './vac_abi.json';
import USDT_ABI from './usdt_abi.json';
import Web3 from 'web3';
import { writeContract } from '@wagmi/core';
import { showError } from '../utils';

const CONTRACT_ADDRESS = '0x6e78485C7F8cc1ae391e77C698E2c7EeDA0F0F38';
const VAC_ADDRESS = '0xE5D320C86E8C4BDD7217dc87Cc045f323d0b8E84';
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

const web3 = new Web3("wss://bsc-rpc.publicnode.com	");

export const useContract = () => {
    const [contract, setContract] = useState(null);

    useEffect(() => {
        try {
            const newContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
            const vacContract = new web3.eth.Contract(VAC_ABI, VAC_ADDRESS);
            const usdtContract = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS);

            setContract({ contract: newContract, vacContract, usdtContract });
        } catch (error) {
            console.error('Error initializing contract:', error);
        }
    }, []);

    return { ...contract };
};

export const getAccountBalance = async (address) => {
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceBnb = web3.utils.fromWei(balanceWei, 'ether');

        return balanceBnb;
    } catch (error) {
        console.error('Error getting account balance:', error);
        throw error;
    }
};

export const getAccountBalanceUSDT = async (address) => {
    try {
        const usdtContract = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS);

        const decimals = await usdtContract.methods.decimals().call();
        const balance = await usdtContract.methods.balanceOf(address).call();

        return balance / 10 ** decimals;
    } catch (error) {
        console.error('Error getting account balance:', error);
        throw error;
    }
};

export const getStartTime = async () => {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    const startTime = await contract.methods.startTime().call();

    return new Date(startTime * 1000);
};

export const getEndTime = async () => {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    const endTime = await contract.methods.endTime().call();

    return new Date(endTime * 1000);
};

export const getSoftCap = async () => {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    const softCap = await contract.methods.softCap().call();

    return softCap / 10 ** 18;
};

export const getHardCap = async () => {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    const hardCap = await contract.methods.hardCap().call();

    return hardCap / 10 ** 18;
};

export const getBNBRaised = async () => {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    const bnbRaised = await contract.methods.bnbRaised().call();

    return bnbRaised / 10 ** 18;
};

export const getUSDTRaised = async () => {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    const usdtRaised = await contract.methods.usdtRaised().call();

    return usdtRaised / 10 ** 18;
};

export const getTokenPriceInBNB = async () => {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    const tokenPriceBNB = await contract.methods.tokenPriceBNB().call();

    return tokenPriceBNB / 10 ** 18;
};

export const getTokenPriceInUSDT = async () => {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    const tokenPriceUSDT = await contract.methods.tokenPriceUSDT().call();

    return tokenPriceUSDT / 10 ** 18;
};

export const buyTokenByBNB = async (address, amount) => {
    try {
        const weiValue = web3.utils.toWei(amount.toString());

        await writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'buyTokensWithBNB',
            value: weiValue,
            account: address,
        });
    } catch (res) {
        console.log("buyToken Error: ", res.error || res);
        showError(res.error || res);
    }
}

export const approveUSDT = async (address, amount) => {
    try {
        const weiValue = web3.utils.toWei(amount.toString());

        const usdtContract = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS);
        const allowance = await usdtContract.methods.allowance(address, CONTRACT_ADDRESS).call();

        if (new web3.utils.BN(allowance).lt(new web3.utils.BN(weiValue))) {
            await writeContract({
                address: USDT_ADDRESS,
                abi: USDT_ABI,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS, weiValue],
                account: address,
            });
        } else {
            return true;
        }

        return false;
    } catch (res) {
        console.log("buyToken Error: ", res.error || res);
        showError(res.error || res);
    }
}

export const buyTokenByUSDT = async (address, amount) => {
    try {
        const weiValue = web3.utils.toWei(amount.toString());

        await writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'buyTokensWithUSDT',
            args: [weiValue],
            account: address,
        });
    } catch (res) {
        console.log("buyToken Error: ", res.error || res);
        showError(res.error || res);
    }
}