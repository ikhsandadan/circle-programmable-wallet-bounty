import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
import {v4 as uuidv4} from 'uuid';

// Function to list transaction
export async function GET(req) {
    const userToken = req.nextUrl.searchParams.get('userToken');
    const walletId = req.nextUrl.searchParams.get('walletId');

    const options = {
    method: 'GET',
    url: 'https://api.circle.com/v1/w3s/transactions',
    params: {
        includeAll: 'true',
        walletIds: walletId,
        pageSize: '50'
    },
    headers: {
        accept: 'application/json',
        'X-User-Token': userToken,
        authorization: `Bearer ${API_KEY}`
    }
    };

    return axios.request(options)
    .then(function (response) {
        return new Response(JSON.stringify(response.data), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        });
    })
    .catch(function (error) {
        return new Response(error);
    });
};

// Function to create transfer transactions
export async function POST(req) {
    const userToken = req.nextUrl.searchParams.get('userToken');
    const amount = req.nextUrl.searchParams.get('amount');
    const destinationAddress = req.nextUrl.searchParams.get('destinationAddress');
    const feeLevel = req.nextUrl.searchParams.get('feeLevel');
    const tokenId = req.nextUrl.searchParams.get('tokenId');
    const walletId = req.nextUrl.searchParams.get('walletId');
    let myuuid = uuidv4();

    const options = {
        method: 'POST',
        url: 'https://api.circle.com/v1/w3s/user/transactions/transfer',
        headers: {
            accept: 'application/json',
            'X-User-Token': userToken,
            'content-type': 'application/json',
            authorization: `Bearer ${API_KEY}`
        },
        data: {
            amounts: [amount],
            idempotencyKey: myuuid,
            destinationAddress: destinationAddress,
            feeLevel: feeLevel,
            tokenId: tokenId,
            walletId: walletId
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