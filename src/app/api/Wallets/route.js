import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
import {v4 as uuidv4} from 'uuid';

// function for creating wallet
export async function POST(req) {
    let myuuid = uuidv4();
    const userToken = req.nextUrl.searchParams.get('userToken');
    const blockchains = req.nextUrl.searchParams.get('blockchains');
    const accountType = req.nextUrl.searchParams.get('accountType'); // SCA/EOA
    const name = req.nextUrl.searchParams.get('name') || ''; // Optional wallet name
    const refId = req.nextUrl.searchParams.get('refId') || ''; // Optional reference or description used to identify the wallet

    const options = {
        method: 'POST',
        url: 'https://api.circle.com/v1/w3s/user/wallets',
        headers: {
            accept: 'application/json',
            'X-User-Token': userToken,
            'content-type': 'application/json',
            authorization: `Bearer ${API_KEY}`
        },
        data: {
            idempotencyKey: myuuid,
            blockchains: Array.isArray(blockchains) ? blockchains : [blockchains],
            accountType: accountType,
            metadata: [{name: name, refId: refId}]
        }
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