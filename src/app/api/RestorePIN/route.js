import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
import {v4 as uuidv4} from 'uuid';

// Function to restore user PIN
export async function POST(req) {
    let myuuid = uuidv4();
    const userToken = req.nextUrl.searchParams.get('userToken');

    const options = {
        method: 'POST',
        url: 'https://api.circle.com/v1/w3s/user/pin/restore',
        headers: {
            accept: 'application/json',
            'X-User-Token': userToken,
            'content-type': 'application/json',
            authorization: `Bearer ${API_KEY}`
        },
        data: {idempotencyKey: myuuid}
    };

    return axios.request(options)
    .then(function (response) {
        return new Response(JSON.stringify(response.data), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 201
        });
    })
    .catch(function (error) {
        return new Response(error);
    });
};