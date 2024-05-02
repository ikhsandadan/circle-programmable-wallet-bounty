"use client";
import React, { useContext, useState } from "react";

import AppContext from "../context/AppContext";

const UserForm = ({ formData: initialFormData, setFormData, checkUserRegistered, checkUserByid }) => {
    const { addUserData, addUserId } = useContext(AppContext);
    const formData = initialFormData || { userId: '', email: '', name: '' };

    // Function to handle create a new user data to database and Circle user ID
    const handleSubmitAddUserId = async (e) => {
        e.preventDefault();
        let checkUserId = await checkUserByid(formData?.userId)
        
        if (formData.userId.length >= 5 && checkUserId?.foundUser == null) {
            // if userId length equal or more than 5 letter and userId is not found on database then create a new Circle's user ID and user data to database
            await addUserId(formData?.userId);
            await addUserData(formData);

            checkUserRegistered();
        } else if (formData.userId.length < 5) {
            alert("User ID must be at least 5 characters long");
        } else if (checkUserId?.foundUser != null) {
            alert("User ID not available");
        }
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
    
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    

    return (
        <div className="flex justify-center py-4 px-10">
            <form className="flex flex-col gap-3 text-black mb-5" method="post" onSubmit={handleSubmitAddUserId}>
                <h3>Create a Circle User ID</h3>
                <label>User ID</label>
                <input 
                    id="userId"
                    name="userId"
                    onChange={handleChange}
                    required={true}
                    value={formData?.userId}
                    size={formData?.userId?.length}
                    className="ml-2 py-2 px-2 bg-slate-200 rounded-sm"
                />
                <label className="mt-2">Email</label>
                <input 
                    id="email"
                    name="email"
                    required={true}
                    readOnly
                    value={formData?.email}
                    size={formData?.email?.length}
                    className="ml-2 py-2 px-2 bg-slate-200 rounded-sm"
                />
                <label className="mt-2">Full Name</label>
                <input 
                    id="name"
                    name="name"
                    required={true}
                    readOnly
                    value={formData?.name}
                    size={formData?.name?.length}
                    className="ml-2 py-2 px-2 bg-slate-200 rounded-sm"
                />
                <button  type="submit" className="rounded mt-4 mb-3 px-4 py-4 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default UserForm;