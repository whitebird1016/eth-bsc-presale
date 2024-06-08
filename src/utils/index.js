import moment from 'moment';
import "moment-timezone";
import { toast } from "react-toastify";

export const formatAddress = (address) => {
    if (!address) return;

    const firstFourChars = address.substr(0, 6);
    const lastFourChars = address.substr(-4);
    const styledAddress = `${firstFourChars}...${lastFourChars}`;

    return styledAddress;
}

export const convertDateString = (dateString) => {
    const isoDate = moment(dateString).tz("Africa/Abidjan", true).format("YYYY-MM-DD HH:mm:ss")
    return isoDate;
}

export const isStarted = (dateString) => {
    if (!dateString) return false;

    const now = moment().tz("Africa/Abidjan");
    const start = moment(dateString).tz("Africa/Abidjan");

    return now.isAfter(start);
}

export const roundValue = (number, decimal = 6) => {
    if (isNaN(number / 1)) return "0";

    return Math.trunc(number * 10 ** decimal) / 10 ** decimal;
}

export const showError = (error) => {
    console.log("error: ", error);
    
    if (error.message) {
        toast.error(error.message);
        return;
    }

    if (error.response && error.response.data) {
        const errorData = error.response.data;
        let errorMessage = "Something went wrong.";

        if (errorData.startsWith('0x')) {
            const reasonHex = errorData.startsWith('0x08c379a0')
                ? errorData.substring(138)
                : errorData;

            try {
                const decoded = web3.eth.abi.decodeParameters(['string'], reasonHex);
                errorMessage = decoded[0];
            } catch (decodingError) {
                console.error("Error decoding revert reason: ", decodingError);
            }
        }

        toast.error(errorMessage);
    } else {
        toast.error("An unknown error occurred.");
    }
}