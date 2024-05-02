"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { signIn } from 'next-auth/react';
import axios from "axios";

import UserForm from "../(components)/UserForm";
import Navigation from "../(components)/Navigation";
import UserContext from "../context/UserContext";
import AppContext from "../context/AppContext";
import "./page.css";

const Frontpage = () => {
    const { profile, user, formData, setFormData } = useContext(UserContext);
    const { checkUserByid, createUserToken, listWallet, userWallets, setUserWallets } = useContext(AppContext);
    const [isRegistered, setIsRegistered] = useState(false);
    const [tokenCreated, setTokenCreated] = useState(false);
    const [userIdStatus, setUserIdStatus] = useState("");

    const handleSignin = (e) => {
        e.preventDefault();
        signIn();
    };

    // Function to check if user is registered or not
    const checkUserRegistered = () => {
        if (user) {
            setIsRegistered(true);
            
            const userWallet = listWallet(user.userId);
            userWallet.then((result) => {
                setUserWallets(result.data.wallets);
            });
        } else {
            setIsRegistered(false);
        }
    };

    // Function to create user token
    const createToken = () => {
        const res = createUserToken(user.userId);
        res.then((result) => {
            localStorage.setItem('userToken', JSON.stringify(result.data.userToken));
            localStorage.setItem('encryptionKey', JSON.stringify(result.data.encryptionKey));
            setTokenCreated(true);
        })
    };

    // Function to run createToken function and run again every 50 minutes
    const runCreateToken = () => {
        createToken();
    
        setInterval(async () => {
            createToken();
        }, 50 * 60 * 1000);
    };
    
    // Function to check user status to see the users PIN is enable or not
    const checkUserStatus = async () => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const params = new URLSearchParams({
            userToken
        });

        const response = await axios.get(`/api/params?${params}`);

        setUserIdStatus(response.data.data);
    };

    useEffect(() => {
        checkUserRegistered();
    }, [user]);

    useEffect(() => {
        if (isRegistered) {
            runCreateToken();
        }
    }, [isRegistered]);

    useEffect(() => {
        if (tokenCreated) {
            checkUserStatus();
        }
    }, [tokenCreated])

    return (
        <div className="grid grid-flow-row auto-rows-max justify-items-center main">
            <h1 className="text-center text-4xl font-bold self-start pt-28 pb-10">Welcome to Circle Programmable Wallet Project</h1>
            <div className="grid grid-flow-row auto-rows-max justify-items-center bg-white rounded-lg">
                {profile ? (
                    <div className="grid grid-flow-row auto-rows-auto gap-2 justify-items-center">
                        {isRegistered == false ? (
                            <UserForm formData={formData} setFormData={setFormData} checkUserRegistered={checkUserRegistered} checkUserByid={checkUserByid}/>
                        ) : (
                            <div className="grid" style={{ minWidth: 'max-content' }}>
                                <Navigation 
                                    profile={profile}
                                    user={user} 
                                    userIdStatus={userIdStatus} 
                                    userWallets={userWallets} 
                                    setUserWallets={setUserWallets}
                                    listWallet={listWallet}
                                    checkUserStatus={checkUserStatus}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-flow-row auto-rows-max justify-items-center">
                        <h1 className="text-black text-2xl py-4 px-4"> Please Login or Sign up with Google or Github</h1>
                        <Link href="#" onClick={handleSignin} className="px-5 py-5 mb-5 bg-black/10 text-black p-2 rounded-md hover:bg-black/15">
                            <button>Login or Sign up</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Frontpage;
