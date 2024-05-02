"use client";
import { useState, useRef, useContext } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';

import AppContext from '../context/AppContext';
import UserContext from '../context/UserContext';
import CircleWebSDK from './CircleWebSDK';
import HomeNav from './HomeNav';
import MyWallets from './MyWallets';
import TransferForm from './TransferForm';
import TransactionHistory from './TransactionHistory';
import Profile from './Profile';

const Navigation = ({ profile, user, userIdStatus, userWallets, setUserWallets, listWallet, checkUserStatus }) => {
    const {
        checkUser,
        addContact,
        editContact,
        removeContact,
        setPIN,
        updatePIN, 
        restorePIN, 
        createWallet, 
        updateWallet, 
        checkWalletBalances, 
        walletBalances, 
        setWalletBalances, 
        outboundTransfer,
        listTransactions,
        addFaucet
    } = useContext(AppContext);
    const { setUser } = useContext(UserContext);
    const [value, setValue] = useState(0);
    const ref = useRef(null);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: undefined
    };

    const content = () => {
        if (value === 0) {
            return (
                // To display Home page
                <HomeNav 
                    user={user} 
                    userIdStatus={userIdStatus} 
                    profile={profile} 
                    setPIN={setPIN} 
                    updatePIN={updatePIN} 
                    restorePIN={restorePIN} 
                    options={options} 
                    userWallets={userWallets}
                    addFaucet={addFaucet}
                />
            )
        } else if (value === 1) {
            return (
                // To display Transfer page
                <TransferForm 
                    user={user} 
                    userWallets={userWallets} 
                    checkWalletBalances={checkWalletBalances} 
                    outboundTransfer={outboundTransfer} 
                    addContact={addContact}
                />
            )
        } else if (value === 2) {
            return (
                // To display Transaction History page
                <TransactionHistory listTransactions={listTransactions} userWallets={userWallets} options={options}/>
            )
        } else if (value === 3) {
            return (
                // To display My Wallets page
                <MyWallets 
                    user={user} 
                    userWallets={userWallets} 
                    setUserWallets={setUserWallets} 
                    options={options}
                    createWallet={createWallet}
                    updateWallet={updateWallet}
                    listWallet={listWallet}
                    checkWalletBalances={checkWalletBalances}
                    walletBalances={walletBalances}
                    setWalletBalances={setWalletBalances}
                />
            )
        } else if (value === 4) {
            return (
                // To display My Profile page
                <Profile editContact={editContact} removeContact={removeContact} checkUser={checkUser} setUser={setUser}/>
            )
        }
    };

    return (
        <Box sx={{ pb: 0, width: "100vh" }} ref={ref} className='rounded-md grid' style={{ minWidth: 'max-content'}}>
            <List className='justify-self-center' sx={{ width: "100vh" }} style={{ minWidth: 'max-content' }}>
                {content()}
            </List>
            <Paper elevation={3}>
                <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                >
                <Tooltip title="Home">
                    <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                </Tooltip>
                <Tooltip title="Transfer">
                    <BottomNavigationAction label="Transfer" icon={<PaidIcon />} />
                </Tooltip>
                <Tooltip title="Transaction History">
                    <BottomNavigationAction label="Transactions History" icon={<HistoryIcon />} />
                </Tooltip>
                <Tooltip title="My Wallets">
                    <BottomNavigationAction label="My Wallets" icon={<AccountBalanceWalletIcon />} />
                </Tooltip>
                <Tooltip title="My Profile">
                    <BottomNavigationAction label="My Profile" icon={<AccountCircleIcon />} />
                </Tooltip>
                </BottomNavigation>
            </Paper>
            <CircleWebSDK />
        </Box>
    )
}

export default Navigation;