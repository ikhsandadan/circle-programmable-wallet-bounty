"use client";
import { useEffect, useState } from 'react';
import { SessionProvider } from "next-auth/react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


import UserContext from '../context/UserContext';
import AppContext from '../context/AppContext';

const Provider = ({ children }) => {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const [notification, setNotification] = useState([]);
    const [open, setOpen] = useState();
    const [userProfile, setUserProfile] = useState(null);
    const [user, setUser] = useState();
    const [formData, setFormData] = useState();
    const [challengeId, setChallengeId] = useState();
    const [userToken, setUserToken] = useState();
    const [encryptionKey, setEncryptionKey] = useState();
    const [userWallets, setUserWallets] = useState();
    const [walletBalances, setWalletBalances] = useState();

    // To update and store notification
    useEffect(() => {
        if (localStorage.getItem('notification')) {
            setNotification(JSON.parse(localStorage.getItem('notification')));
        } else {
            localStorage.setItem('notification', JSON.stringify([]));
        }
    }, []);

    // Function to create a new user ID to Circle
    const addUserId = async (userId) => {
        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/users',
            headers: {
                accept: 'application/json', 
                'content-type': 'application/json',
                authorization: `Bearer ${API_KEY}`
            },
            data: {userId: userId}
        };
        
        axios
        .request(options)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, error]);
        });
    };

    // Function to create user token for user
    const createUserToken = async (userId) => {
        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/users/token',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${API_KEY}`
            },
            data: { userId: userId }
        };
    
        return axios.request(options)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                toast.error(error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
    
                setNotification((prevNotification) => [...prevNotification, error]);
            });
    };

    // Function to add user data to mongoDB
    const addUserData = async (formData) => {
        const res = await fetch("/api/User", {
            method: "POST",
            body: JSON.stringify({formData}),
            "content-type": "application/json"
        })

        if (res.ok) {
            const response = res.json();
            response.then((result) => {
                let message = result.message + ": " + formData.userId;

                toast.success(message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })

                setNotification((prevNotification) => [...prevNotification, message]);
            })
        } else {
            let message = "Failed to create User ID";

            toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, message]);
        }
    };

    // Function to check user if its already exist in mongoDB or not by checking user email
    const checkUser = async (email) => {
        const res = await fetch(`/api/User/${email}`, {
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error("Failed to get user");
        }

        return res.json();
    };

    // Function to check user if its already exist in mongoDB or not by checking user userId to prevent userId being used twice
    const checkUserByid = async (userId) => {
        const res = await fetch(`/api/CheckUserId/${userId}`, {
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error("Failed to get user");
        }

        return res.json();
    };

    // Function to set user PIN to Circle's userId
    const setPIN = async () => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken
        });

        const response = await axios.post(`/api/params?${params}`);
        if (response.status == 201) {
            setChallengeId(response.data.data.challengeId);
            setUserToken(JSON.parse(localStorage.getItem('userToken')));
            setEncryptionKey(JSON.parse(localStorage.getItem('encryptionKey')));
            setOpen(true);
        } else {
            toast.error("Failed to create PIN", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to create PIN"]);
        }
    };

    // Function to update userId PIN
    const updatePIN = async () => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken
        });

        const response = await axios.put(`/api/params?${params}`);
        if (response.status == 200) {
            setChallengeId(response.data.data.challengeId);
            setUserToken(JSON.parse(localStorage.getItem('userToken')));
            setEncryptionKey(JSON.parse(localStorage.getItem('encryptionKey')));
            setOpen(true);
        } else {
            toast.error("Failed to update PIN", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to update PIN"]);
        }
    };

    // Function to restore or reset userId PIN
    const restorePIN = async () => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken
        });

        const response = await axios.post(`/api/RestorePIN?${params}`);
        if (response.status == 201) {
            setChallengeId(response.data.data.challengeId);
            setUserToken(JSON.parse(localStorage.getItem('userToken')));
            setEncryptionKey(JSON.parse(localStorage.getItem('encryptionKey')));
            setOpen(true);
        } else {
            toast.error("Failed to restore PIN", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to restore PIN"]);
        }
    };

    // Function to create new user wallet
    const createWallet = async (blockchains, accountType, name, refId) => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken,
            blockchains,
            accountType,
            ...(name && { name }),
            ...(refId && { refId })
        });

        const response = await axios.post(`/api/Wallets?${params}`);
        if (response.status == 201) {
            setChallengeId(response.data.data.challengeId);
            setUserToken(JSON.parse(localStorage.getItem('userToken')));
            setEncryptionKey(JSON.parse(localStorage.getItem('encryptionKey')));
            setOpen(true);

        } else {
            console.log(response)
            toast.error("Failed to create wallet", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to create wallet"]);
        }
    };

    // Function to list a user wallet
    const listWallet = async (userId) => {
        const options = {
        method: 'GET',
        url: 'https://api.circle.com/v1/w3s/wallets',
        params: {userId: userId, pageSize: '10'},
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${API_KEY}`
        }
        };

        return axios.request(options)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                toast.error(error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
    
                setNotification((prevNotification) => [...prevNotification, error]);
            });
    };

    // Function to update user wallet name and or refId
    const updateWallet = async (walletId, name, refId) => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken,
            name,
            refId
        });

        const response = await axios.put(`/api/Wallets/${walletId}?${params}`);
        if (response.status == 200) {
            toast.success("Successful updating wallet", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            setNotification((prevNotification) => [...prevNotification, "Successful updating wallet"]);
        } else {
            toast.error("Failed to update wallet", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to update wallet"]);
        }
    };

    // Function to check user wallet balances
    const checkWalletBalances = async (walletId) => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken
        });

        const response = await axios.get(`/api/Wallets/${walletId}?${params}`);
        if (response.status == 200) {
            return { walletId, data: response.data.data };
        } else {
            toast.error("Failed to update wallet ballances", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to update wallet ballances"]);
        }
    };

    // Function to create outbound transfer user token
    const outboundTransfer = async (walletId, destinationAddress, tokenId, amounts) => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken,
            destinationAddress,
            tokenId,
            amounts
        });

        const response = await axios.post(`/api/Wallets/${walletId}?${params}`);
        if (response.status == 201) {
            setChallengeId(response.data.data.challengeId);
            setUserToken(JSON.parse(localStorage.getItem('userToken')));
            setEncryptionKey(JSON.parse(localStorage.getItem('encryptionKey')));
            setOpen(true);
            return true;

        } else {
            console.log(response)
            toast.error("Failed to create transfer", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to create transfer"]);
            return false;
        }
    };

    // Function to list user wallet transactions
    const listTransactions = async (walletId) => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken,
            walletId
        });

        const response = await axios.get(`/api/Transfer?${params}`);
        if (response.status == 200) {
            return response.data.data;
        } else {
            console.log(response);
            toast.error("Failed to update list transactions", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to update list transactions"]);
        }
    };

    // Function to add contact to user contact list
    const addContact = async (newFormData, id) => {
        const res = await fetch(`/api/User/${id}`, {
            method: "PUT",
            body: JSON.stringify({newFormData}),
            "content-type": "application/json"
        })

        if (res.ok) {
            const response = res.json();
            const input = document.querySelectorAll("#contactName, #address");
            const inputArray = [...input];

            response.then((result) => {
                let message = result.message + ": " + newFormData.contactName;

                toast.success(message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })

                setNotification((prevNotification) => [...prevNotification, message]);
            })

            inputArray.forEach((i) => {
                i.value = "";
            })

            setOpen(false);
        } else {
            let message = "Failed to add contact";
            toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, message]);
        }
    };

    // Function to edit user contact
    const editContact = async (updatedContactData, id, contactId) => {
        const res = await fetch(`/api/User/`, {
            method: "PUT",
            body: JSON.stringify({id, updatedContactData, contactId}),
            "content-type": "application/json"
        })

        if (res.ok) {
            const response = res.json();
            const input = document.querySelectorAll("#contactName, #address");
            const inputArray = [...input];

            response.then((result) => {
                let message = result.message + ": " + updatedContactData.contactName;

                toast.success(message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })

                setNotification((prevNotification) => [...prevNotification, message]);
            })

            inputArray.forEach((i) => {
                i.value = "";
            })

            setOpen(false);
        } else {
            let message = "Failed to edit contact";
            toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, message]);
        }
    };

    // Function to remove user contact
    const removeContact = async (id, contactId, contactName) => {
        const res = await fetch(`/api/User/${id}`, {
            method: "DELETE",
            body: JSON.stringify({contactId}),
            "content-type": "application/json"
        })

        if (res.ok) {
            const response = res.json();
            const input = document.querySelectorAll("#contactName, #address");
            const inputArray = [...input];

            response.then((result) => {
                let message = result.message + ": " + contactName;

                toast.success(message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })

                setNotification((prevNotification) => [...prevNotification, message]);
            })

            inputArray.forEach((i) => {
                i.value = "";
            })
        } else {
            let message = "Failed to add contact";
            toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, message]);
        }
    };

    // Function to add testnet faucet to user wallet
    const addFaucet = async (eth, usdc, eudc, walletAddress) => {
        const params = new URLSearchParams({
            eth,
            usdc,
            eudc,
            walletAddress
        });

        const response = await axios.post(`/api/Faucet?${params}`);
        if (response.status == 201) {
            toast.success("Successful to add faucet", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Successful to add faucet"]);
        } else {
            console.log(response);
            toast.error("Failed to add faucet", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            setNotification((prevNotification) => [...prevNotification, "Failed to add faucet"]);
        }
    };

    const theme = createTheme({
        palette: {
            primary: {
            main: "#000000",
            },
            secondary: {
            main: "#FFFFFF",
            },
        },
    });



    return (
        <SessionProvider>
        <UserContext.Provider value={{ 
            profile: userProfile, 
            setProfile: setUserProfile, 
            user: user, 
            setUser: setUser, 
            formData: formData, 
            setFormData: setFormData 
        }}>
        <AppContext.Provider value={{ 
            addUserId, 
            checkUser,
            checkUserByid,
            addUserData, 
            addContact,
            editContact,
            removeContact,
            createUserToken, 
            notification, 
            setNotification,
            listWallet,
            setPIN,
            updatePIN,
            restorePIN,
            open,
            setOpen,
            encryptionKey,
            userToken,
            challengeId,
            createWallet,
            updateWallet,
            userWallets,
            setUserWallets,
            checkWalletBalances,
            walletBalances,
            setWalletBalances,
            outboundTransfer,
            listTransactions,
            addFaucet
        }}>
        <ThemeProvider theme={theme}>
            {children}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </ThemeProvider>
        </AppContext.Provider>
        </UserContext.Provider>
        </SessionProvider>
    )
}

export default Provider