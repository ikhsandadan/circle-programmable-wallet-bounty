import { useEffect, useState, useCallback } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const TransactionHistory = ({ listTransactions,  userWallets, options }) => {
    const [transactionLists, setTransactionLists] = useState();
    const [selectedWallet, setSelectedWallet] = useState();

    // Token list by token ID
    const tokenLists = {
        "979869da-9115-5f7d-917d-12d434e56ae7": {
            tokenName: "ETH-SEPOLIA"
        },
        "c22b378a-843a-59b6-aaf5-bcba622729e6": {
            tokenName: "EURC"
        },
        "5797fbd6-3795-519d-84ca-ec4c5f80c3b1": {
            tokenName: "USDC"
        }
    };

    // Function to check transaction list of user wallet
    const checkTransactions = async () => {
        if (selectedWallet) {
            const lists = await listTransactions(selectedWallet);
            setTransactionLists(lists.transactions);
        }
    };

    const onChangeHandler = useCallback(
        (setState) => (e) => {
            const value = e.target.value
            setState(value);
        },
        []
    );

    // Check transaction of wallet by selected user wallet
    useEffect(() => {
        checkTransactions();
    }, [selectedWallet])

    return (
        <div className='grid place-content-center text-black mx-6'>
            <div className="text-xl font-semibold my-3 mx-5 text-center">Transactions History</div>
            <InputLabel className='mt-2'>Select Wallet</InputLabel>
            <Select
                labelId="selectWallet"
                id="selectWallet"
                value={selectedWallet || ''}
                onChange={onChangeHandler(setSelectedWallet)}
                autoWidth
                label="Select Wallet"
                variant='filled'
                className='mb-4'
            >
                {userWallets?.map((wallet, index) => (
                    <MenuItem value={wallet.id} key={index}>{wallet.name || ''}</MenuItem>
                ))}
            </Select>
            {transactionLists?.length >= 1 ? (
                <table className='table-fixed text-xs'>
                    <caption className="caption-top py-2">List of Token Balances</caption>
                    <thead>
                        <tr className='bg-slate-100 text-left'>
                            <th className='font-semibold px-4 py-2'>Operation</th>
                            <th className='font-semibold px-4 py-2'>Amount</th>
                            <th className='font-semibold px-4 py-2'>Network</th>
                            <th className='font-semibold px-4 py-2'>TX Hash</th>
                            <th className='font-semibold px-4 py-2'>State</th>
                            <th className='font-semibold px-4 py-2'>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionLists?.map((transaction, index) => (
                            <tr key={index} className='border-b'>
                                <td className='px-4 py-4'>
                                    <div className='flex'>
                                        <div className='place-self-center'>
                                            {transaction.transactionType == "INBOUND" ? (
                                                <ArrowCircleDownIcon className='text-green-500'/>
                                            ) : (<ArrowCircleUpIcon className='text-red-500'/>)}
                                        </div>
                                        <div className='grid mx-1'>
                                            <div>{transaction.operation}</div>
                                            <div>{transaction.transactionType}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-4 py-4'>
                                    <div className='flex items-center'>
                                        <img src={tokenLists[transaction.tokenId].tokenName + '.png'} className='h-6 mr-2' alt={tokenLists[transaction.tokenId].tokenName} />
                                        <p>{transaction.amounts[0]} {tokenLists[transaction.tokenId].tokenName}</p>
                                    </div>
                                </td>
                                <td className='px-4 py-4'>{transaction.blockchain}</td>
                                <td className='px-4 py-4'>{transaction.txHash}</td>
                                <td className={`px-4 py-4 ${transaction.state === 'COMPLETE' ? 'text-green-500' : transaction.state === 'CONFIRMED' ? 'text-blue-500' : 'text-red-500'}`}>
                                    {transaction.state}
                                </td>
                                <td className='px-4 py-4'>{new Date(transaction.createDate).toLocaleString(undefined, options) || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : ("You dont have any transactions.")
            }
        </div>
    )
}

export default TransactionHistory;