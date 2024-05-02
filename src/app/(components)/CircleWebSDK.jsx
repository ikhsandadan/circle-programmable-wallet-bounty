"use client";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import AppContext from '../context/AppContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CircleWebSDK = () => {
    const router = useRouter();
    const { notification, setNotification, open, setOpen, challengeId, userToken, encryptionKey } = useContext(AppContext);
    const [sdk, setSdk] = useState(null);
    const appId = process.env.NEXT_PUBLIC_APP_ID;

    const handleClose = () => setOpen(false);

    useEffect(() => {
        setSdk(new W3SSdk());
    }, []);
    
    const onSubmit = useCallback((e) => {
        e.preventDefault();

        if (!sdk) {
            toast.error('Error: SDK not initialized', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            setNotification((prevNotification) => [...prevNotification, message]);

            setOpen(false);
            return;
        }
    
        sdk.setAppSettings({ appId });
        sdk.setAuthentication({ userToken, encryptionKey });
    
        sdk.execute(challengeId, (error, result) => {
            if (error) {
                let message = `Error: ${error?.message ?? 'Error!'}`;

                toast.error(message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });

                setNotification((prevNotification) => [...prevNotification, message]);

                setOpen(false);

                return;
            }

            let message = `Challenge: ${result?.type}, Status: ${result?.status}`;

            toast.success(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            setNotification((prevNotification) => [...prevNotification, message]);

            router.refresh();
            setOpen(false);
        });
    }, [sdk, appId, userToken, encryptionKey, challengeId]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('notification', JSON.stringify(notification));
        }
    }, [notification]);

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
        <Fade in={open}>
            <Box sx={style} className="rounded-md">
                <form className="grid p-4 justify-center gap-4" onSubmit={onSubmit}>
                    <TextField
                    required
                    label="User Token"
                    readOnly
                    value={userToken || ''}
                    />
                    <TextField
                    required
                    label="Encryption Key"
                    readOnly
                    value={encryptionKey || ''}
                    />
                    <TextField
                    required
                    label="Challenge Id"
                    readOnly
                    value={challengeId || ''}
                    />
                    <button  type='submit' className="text-black rounded mt-4 mb-3 px-4 py-4 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                        Verify Challenge
                    </button>
                </form>
            </Box>
        </Fade>
    </Modal>
    )
}

export default CircleWebSDK;