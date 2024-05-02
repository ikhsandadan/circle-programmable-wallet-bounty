import { NextResponse } from "next/server";
import User from "@/app/(models)/User";

// Function to add user data to database
export async function POST(req) {
    try {
        const body = await req.json();
        const userData = body.formData;
        await User.create(userData);

        return NextResponse.json({message: "User Created"}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: "Error", error}, {status: 500});
    }
};

// Function to edit or update contact in user database
export async function PUT(req) {
    try {
        const body = await req.json();
        const id = body.id
        const contactId = body.contactId;
        const updatedContactData = body.updatedContactData;

        const updateUserData = await User.findOneAndUpdate(
            { _id: id, "contact._id": contactId },
            { $set: { "contact.$": updatedContactData } },
            { new: true }
        );

        if (!updateUserData) {
            return NextResponse.json({ message: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Contact Updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
};