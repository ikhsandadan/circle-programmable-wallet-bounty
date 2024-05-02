import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
import {v4 as uuidv4} from 'uuid';

// Function for get user wallet balance
export async function GET(req, { params }) {
    const { walletId } = params;
    const userToken = req.nextUrl.searchParams.get('userToken');

    const options = {
        method: 'GET',
        url: `https://api.circle.com/v1/w3s/wallets/${walletId}/balances`,
        params: {pageSize: '10'},
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

// Function to update wallet
export async function PUT(req, { params }) {
    const { walletId } = params;
    const userToken = req.nextUrl.searchParams.get('userToken');
    const name = req.nextUrl.searchParams.get('name');
    const refId = req.nextUrl.searchParams.get('refId');

    const options = {
        method: 'PUT',
        url: `https://api.circle.com/v1/w3s/wallets/${walletId}`,
        headers: {
            accept: 'application/json',
            'X-User-Token': userToken,
            'content-type': 'application/json',
            authorization: `Bearer ${API_KEY}`
        },
        data: {name: name, refId: refId}
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

// Function to transfer token
export async function POST(req, { params }) {
    let myuuid = uuidv4();
    const { walletId } = params;
    const userToken = req.nextUrl.searchParams.get('userToken');
    const destinationAddress = req.nextUrl.searchParams.get('destinationAddress');
    const tokenId = req.nextUrl.searchParams.get('tokenId');
    const amounts = req.nextUrl.searchParams.get('amounts');

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
            amounts: [amounts],
            idempotencyKey: myuuid,
            destinationAddress: destinationAddress,
            feeLevel: 'MEDIUM',
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