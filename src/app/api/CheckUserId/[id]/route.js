import { NextResponse } from "next/server";
import User from "@/app/(models)/User";

// Function to get user data by userId from database
export async function GET(req, { params }) {
    try {
        const { id } = params;

        const foundUser = await User.findOne({ userId: id });

        return NextResponse.json({ foundUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error}, { status: 500 });
    }
};