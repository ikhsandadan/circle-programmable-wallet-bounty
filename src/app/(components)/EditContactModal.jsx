"use client";
import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';

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

const EditContactModal = ({ 
    id, 
    contactId, 
    contactName, 
    contactAddress, 
    email, 
    openEditContactModal, 
    handleEditContactClose, 
    editContact, 
    checkUser, 
    setUser 
}) => {
    const [updatedContactData, setUpdatedContactData] = useState({ contactName: '', address: '' });

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
    
        setUpdatedContactData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle edit contact
    const handleSubmitEditContact = async (e) => {
        e.preventDefault();
        await editContact(updatedContactData, id, contactId);
        const updateUser = checkUser(email);
        updateUser.then((result) => {
            setUser(result.foundUser);
        })
        handleEditContactClose();
    };

    // Check if address value has change and add it to updatedContactData
    useEffect(() => {
        const value = contactAddress;
        const name =  "address";

        setUpdatedContactData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, [contactAddress])

    // Check if contactName value has change and add it to updatedContactData
    useEffect(() => {
        const value = contactName;
        const name =  "contactName";

        setUpdatedContactData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, [contactName])

    return (
        <Modal
            aria-labelledby="editContact"
            aria-describedby="editContact"
            open={openEditContactModal}
            onClose={handleEditContactClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
        }}
        >
            <Fade in={openEditContactModal}>
                <Box sx={style} className="rounded-md">
                    <h3>Edit Contact</h3>
                    <form className="grid p-4 justify-center gap-4" onSubmit={handleSubmitEditContact}>
                        <TextField
                        required
                        name="contactName"
                        label="Contact Name"
                        onChange={handleChange}
                        value={updatedContactData.contactName ? updatedContactData.contactName : (contactName || '')}
                        />
                        <TextField
                        required
                        name="address"
                        label="Contact Address"
                        onChange={handleChange}
                        value={updatedContactData.address ? updatedContactData.address : (contactAddress || '')}
                        />
                        <button  type='submit' className="text-black rounded mt-4 mb-3 px-4 py-4 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                            Edit contact
                        </button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    )
}

export default EditContactModal;