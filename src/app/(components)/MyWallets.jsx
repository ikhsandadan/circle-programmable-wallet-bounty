import { useEffect, useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddCardIcon from '@mui/icons-material/AddCard';

import UpdateWalletModal from './UpdateWalletModal';
import CreateNewWalletModal from './CreateNewWalletModal';

const MyWallets = ({ 
    user, 
    userWallets, 
    setUserWallets, 
    options, 
    createWallet, 
    updateWallet, 
    listWallet, 
    checkWalletBalances, 
    walletBalances, 
    setWalletBalances
}) => {
    const [openUpdateWalletModal, setOpenUpdateWalletModal] = useState(false);
    const [openCreateWalletModal, setOpenCreateWalletModal] = useState(false);
    const [blockchains, setBlockchains] = useState();
    const [accountType, setAccountType] = useState();
    const [name, setName] = useState();
    const [refId, setRefId] = useState();
    const [walletId, setWalletId] = useState();
    const [flag, setFlag] = useState(false);
    const handleUpdateWalletClose = () => setOpenUpdateWalletModal(false);
    const handleCreateWalletClose = () => setOpenCreateWalletModal(false);

    // Function to handle update wallet data (name, refId)
    const onUpdateWalletSubmit = async (e) => {
        e.preventDefault();
        await updateWallet(walletId, name, refId);

        setOpenUpdateWalletModal(false);
        setFlag(!flag);
    };

    // Function to pass value to name, refId, and walletId and open Update Wallet Modal
    const handleOpenUpdateWallet = (walletId, name, refId) => {
        setName(name);
        setRefId(refId);
        setWalletId(walletId);

        setOpenUpdateWalletModal(true);
    };

    // Function to handle create new wallet
    const onCreateWalletSubmit = async (e) => {
        e.preventDefault();
        
        await createWallet(blockchains, accountType, name, refId);

        setOpenCreateWalletModal(false);
        setFlag(!flag);
    };

    const handleOpenCreateWallet = () => {
        setOpenCreateWalletModal(true);
    };

    useEffect(() => {
        const userWallet = listWallet(user.userId);
        userWallet.then((result) => {
            setUserWallets(result.data.wallets);
        });
    }, [flag]);

    // To update user wallet balances
    useEffect(() => {
        const fetchBalances = async () => {
            const balancePromises = userWallets?.map(wallet => checkWalletBalances(wallet?.id));
            const balances = await Promise.all(balancePromises);
            setWalletBalances(balances.filter(balance => balance !== null));
        };
    
        fetchBalances();
    }, [userWallets]);

    return (
        <>
        <div className="text-black text-xl font-semibold mt-3 mx-5 text-center">My Wallets</div>
        {userWallets.length == 0 ? (
            <div className="text-black mt-3 mx-5 text-center">You dont have any wallet</div>
        ) : (null)}
        <div className='flex-grid grid'>
            <div className='grid grid-flow-cols grid-cols-2 text-black place-content-center mb-0 pb-0'>
                {userWallets?.map((wallet, index) => (
                    <div className='grid grid-flow-row auto-rows-auto pb-4 gap-1 border-4 rounded-xl mt-9 mx-6 border-slate-600' key={index} style={{ minWidth: 'max-content' }}>
                        <table className='table-fixed'>
                            <tbody>
                                <tr>
                                    <td className='px-4 py-2 font-semibold'>Wallet Name</td>
                                    <td className='px-4 py-2'>{wallet?.name || ''}</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 font-semibold'>Wallet Descriptions</td>
                                    <td className='px-4 py-2'>{wallet?.refId || ''}</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 font-semibold'>Wallet ID</td>
                                    <td className='px-4 py-2'>{wallet?.id}</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 font-semibold'>Wallet Address</td>
                                    <td className='px-4 py-2'>{wallet?.address}</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 font-semibold'>Account Type</td>
                                    <td className='px-4 py-2'>{wallet?.accountType}</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 font-semibold'>Blockchain</td>
                                    <td className='px-4 py-2'>{wallet?.blockchain}</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 font-semibold'>Create Date</td>
                                    <td className='px-4 py-2'>{new Date(wallet?.createDate).toLocaleString(undefined, options) || ''}</td>
                                </tr>
                                <tr>
                                    <td className='px-4 py-2 font-semibold'>Update Date</td>
                                    <td className='px-4 py-2'>{new Date(wallet?.updateDate).toLocaleString(undefined, options) || ''}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='mx-4 place-self-center mb-4'>
                            <table className='table-fixed'>
                                <caption className="caption-top pt-2">List of Token Balances</caption>
                                <thead>
                                    <tr className='bg-slate-100 text-left'>
                                        <th className='font-semibold px-4 py-2'>Name</th>
                                        <th className='font-semibold px-4 py-2'>Amounts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {walletBalances?.filter(balance => balance.walletId === wallet.id).map((balance, index) => (
                                    <Fragment key={index}>
                                        {balance?.data?.tokenBalances?.map((token, i) => (
                                            <tr key={i} className='border-b'>
                                                <td className='px-4 py-4'>{token.token.name}</td>
                                                <td className='px-4 py-4 flex items-center'>
                                                    <img src={token.token.symbol + '.png'} className='h-6 mr-2' alt={token.token.symbol} />
                                                    <p>{token.amount} {token.token.symbol}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => handleOpenUpdateWallet(wallet?.id, wallet?.name, wallet?.refId)} className="text-black rounded py-1 px-1 mx-4 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                            Update Wallet Name and Descriptions
                        </button>
                    </div>
                ))}
            </div>
            <div className='flex mb-2 mr-6 place-self-end justify-self-end'>
                <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
                    <SpeedDial
                        ariaLabel="SpeedDial Create Wallet"
                        icon={<SpeedDialIcon />}
                    >
                        <SpeedDialAction
                            key='createNewWallet'
                            icon= {<AddCardIcon />}
                            tooltipTitle='Create New Wallet'
                            onClick={handleOpenCreateWallet}
                            className='mt-0 mb-0 py-0'
                        />
                    </SpeedDial>
                </Box>
            </div>
            < UpdateWalletModal 
                openUpdateWalletModal={openUpdateWalletModal} 
                handleUpdateWalletClose={handleUpdateWalletClose}
                onUpdateWalletSubmit={onUpdateWalletSubmit} 
                name={name}
                setName={setName}
                refId={refId}
                setRefId={setRefId}
            />
            <CreateNewWalletModal 
                openCreateWalletModal={openCreateWalletModal} 
                handleCreateWalletClose={handleCreateWalletClose}
                onCreateWalletSubmit={onCreateWalletSubmit}
                blockchains={blockchains}
                setBlockchains={setBlockchains}
                setAccountType={setAccountType}
                name={name}
                setName={setName}
                refId={refId}
                setRefId={setRefId}
            />
        </div>
        </>
    )
}

export default MyWallets;