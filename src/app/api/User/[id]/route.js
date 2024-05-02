import User from "@/app/(models)/User";
import { NextResponse } from "next/server";

// Function to add contact to user database
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        const userData = body.newFormData;

        const updateUserData = await User.findByIdAndUpdate(id, {
            $push: {contact: userData}
        })
        return NextResponse.json({ message: "Contact Added"}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error}, { status: 500 });
    }
};

// Function to get user data by email from database
export async function GET(req, { params }) {
    try {
        const { id } = params;

        const foundUser = await User.findOne({ email: id });

        return NextResponse.json({ foundUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error}, { status: 500 });
    }
};

// Function to remove contact from user database
export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        const contactId = body.contactId;

        const updateUserData = await User.findByIdAndUpdate(id, {
            $pull: { contact: { _id: contactId } }
        });

        if (!updateUserData) {
            return NextResponse.json({ message: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Contact Removed" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
};