"use client";
import {useContext, useEffect, useState} from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Tooltip from '@mui/material/Tooltip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import UserContext from '../context/UserContext';
import EditContactModal from './EditContactModal';
import AddContactModal from './AddContactModal';

const Profile = ({ editContact, removeContact, checkUser, setUser }) => {
    const { profile, user } = useContext(UserContext);
    const [contactId, setContactId] = useState();
    const [contactName, setContactName] = useState();
    const [contactAddress, setContactAddress] = useState();
    const [openEditContactModal, setOpenEditContactModal] = useState(false);
    const [openAddContactModal, setOpenAddContactModal] = useState(false);
    const handleAddContactClose = () => setOpenAddContactModal(false);
    const handleEditContactClose = () => setOpenEditContactModal(false);

    const handleAdd = () => {
        setOpenAddContactModal(true);
    };

    // Function to open edit or update contact modal  
    const handleUpdate = async (id, name, address) => {
        setContactId(id);
        setContactName(name);
        setContactAddress(address);
        setOpenEditContactModal(true);
    };

    // Function to remove contact from list
    const handleDelete = async (contactId, contactName) => {
        await removeContact(user._id, contactId, contactName);
        updateUserData();
    };

    // Function to update user data
    const updateUserData = () => {
        const updatedUser = checkUser(user.email);
        updatedUser.then((result) => {
            setUser(result.foundUser);
        })
    };

    useEffect(() => {
        updateUserData();
    },[openEditContactModal, openAddContactModal])

    return (
        <div className="min-w-full min-h-full text-black mt-6">
            <div className="container mx-auto mb-10">
                <div className="grid grid-cols-6">
                    <div className="grid relative justify-self-center justify-center col-span-2">
                            <div className="flex text-2xl border-2 rounded-full size-60 relative overflow-hidden justify-self-center">
                                <img src={profile?.image} alt={profile?.name} className="absolute inset-0 w-full h-full object-cover justify-self-center" />
                            </div>
                    </div>
                    <div className="grid space-y-12 col-span-3">
                        <div className="text-2xl font-semibold">Personal Information</div>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="">
                                <label htmlFor="userId" className="block w-full text-base font-medium leading-6">
                                    User ID
                                </label>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="userId"
                                    id="userId"
                                    autoComplete="userId"
                                    value={user?.userId || ""}
                                    size={user?.userId.length}
                                    readOnly
                                    className="block rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="first-name" className="block w-full text-base font-medium leading-6">
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="full-name"
                                    id="full-name"
                                    autoComplete="full-name"
                                    value={profile?.name || ""}
                                    size={profile?.name.length}
                                    readOnly
                                    className="block rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-base font-medium leading-6">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={profile?.email || ""}
                                    size={profile?.email.length}
                                    readOnly
                                    className="block rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        {user?.contact?.length != 0 ? (
                            <table className='table-fixed place-self-center'>
                                <caption className="caption-top py-2">
                                    <div className='grid'>
                                        <p>Contact Lists</p>
                                        <Tooltip title="Add New Contact" className='place-self-end'>
                                            <IconButton onClick={handleAdd}>
                                                <PersonAddIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </caption>
                                <thead>
                                    <tr className='bg-slate-100 text-left'>
                                        <th className='font-semibold px-4 py-2'>No.</th>
                                        <th className='font-semibold px-4 py-2'>Name</th>
                                        <th className='font-semibold px-4 py-2'>Address</th>
                                        <th className='font-semibold px-4 py-2'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user?.contact?.map((contact, i) => (
                                        <tr key={i} className='border-b'>
                                            <td className='px-4 py-4'>{i+1}</td>
                                            <td className='px-4 py-4'>{contact.contactName}</td>
                                            <td className='px-4 py-4'>{contact.address}</td>
                                            <td className='px-4 py-4'>
                                                <Tooltip title="Edit Contact">
                                                    <IconButton onClick={() => handleUpdate(contact._id, contact.contactName, contact.address)}>
                                                    <EditNoteIcon className='text-black'/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Contact">
                                                    <IconButton onClick={() => handleDelete(contact._id, contact.contactName)}>
                                                    <DeleteForeverIcon className='text-red-600'/>
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <Tooltip title="Add New Contact" className='place-self-center'>
                                <IconButton onClick={handleAdd}>
                                    <PersonAddIcon/>
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
            <EditContactModal
                id={user._id}
                contactId={contactId} 
                contactName={contactName}
                contactAddress={contactAddress}
                email={user.email}
                openEditContactModal={openEditContactModal} 
                handleEditContactClose={handleEditContactClose} 
                editContact={editContact}
                checkUser={checkUser}
                setUser={setUser}
            />
            <AddContactModal user={user} address={contactAddress} openAddContactModal={openAddContactModal} handleAddContactClose={handleAddContactClose}/>
        </div>
    )
}

export default Profile;