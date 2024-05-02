import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Function to request testnet faucet
export async function POST(req){
    const ethString = req.nextUrl.searchParams.get('eth');
    const eth = ethString === "true" ? true : false;
    const usdcString = req.nextUrl.searchParams.get('usdc');
    const usdc = usdcString === "true" ? true : false;
    const eudcString = req.nextUrl.searchParams.get('eudc');
    const eudc = eudcString === "true" ? true : false;
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    const options = {
    method: 'POST',
    url: 'https://api.circle.com/v1/faucet/drips',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${API_KEY}`
    },
    data: {
        blockchain: 'ETH-SEPOLIA',
        native: eth,
        usdc: usdc,
        eurc: eudc,
        address: walletAddress
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