"use client";
import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';

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

const AddContactModal = ({ user, address, openAddContactModal, handleAddContactClose }) => {
    const { addContact } = useContext(AppContext);
    const [newFormData, setNewFormData] = useState();

    const handleChange = (e) => {
        const value = e.target.value;
        const name =  e.target.name;

        setNewFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Function to submit addContact
    const handleSubmitAddContact = async (e) => {
        e.preventDefault();
        await addContact(newFormData, user._id);
        handleAddContactClose()
    };

    useEffect(() => {
        // Check if address value has change and add to newFormData
        const value = address;
        const name =  "address";

        setNewFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, [address])

    return (
        <Modal
            aria-labelledby="addContact"
            aria-describedby="addContact"
            open={openAddContactModal}
            onClose={handleAddContactClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
        }}
        >
            <Fade in={openAddContactModal}>
                <Box sx={style} className="rounded-md">
                    <h3>Add Contact</h3>
                    <form className="grid p-4 justify-center gap-4" onSubmit={handleSubmitAddContact}>
                        <TextField
                        required
                        name="contactName"
                        label="Contact Name"
                        onChange={handleChange}
                        value={user?.contact?.contactName}
                        />
                        <TextField
                        required
                        name="address"
                        label="Wallet Address"
                        onChange={handleChange}
                        value={address}
                        />
                        <button  type='submit' className="text-black rounded mt-4 mb-3 px-4 py-4 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                            Add to contact
                        </button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    )
}

export default AddContactModal;