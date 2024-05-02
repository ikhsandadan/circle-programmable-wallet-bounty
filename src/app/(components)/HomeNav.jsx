import { useState, useCallback, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const HomeNav = ({ user, userIdStatus, profile, setPIN, updatePIN, restorePIN, options, userWallets, addFaucet }) => {
    const [wallet, setWallet] = useState();
    const [eth, setEth] = useState(false);
    const [usdc, setUsdc] = useState(false);
    const [eudc, setEudc] = useState(false);

    const onChangeHandler = useCallback(
        (setState) => (e) => {
            const value = e.target.value
            setState(value);
        },
        []
    );

    const handleChangeChecked = useCallback(
        (setState) => (e) => {
            const value = e.target.checked
            setState(value);
        },
        []
    );

    // Submit to addFaucet
    const onSubmit = async (e) => {
        e.preventDefault();
        await addFaucet(eth, usdc, eudc, wallet);
    };

    return (
        <div className="grid grid-flow-row auto-rows-auto text-black place-content-center" style={{ minWidth: 'max-content' }}>
            <table className='text-black place-content-center' style={{ minWidth: 'max-content' }}>
                <tbody>
                    <tr>
                        <td colSpan="2" className="text-xl font-semibold my-3 mx-5"> Hi, {profile?.name}</td>
                    </tr>
                    <tr>
                        <td className='font-semibold'>User ID</td>
                        <td className='pl-6'>{user?.userId}</td>
                    </tr>
                    <tr>
                        <td className='font-semibold'>Create by</td>
                        <td className='pl-6'>{new Date(userIdStatus?.createDate).toLocaleString(undefined, options) || ''}</td>
                    </tr>
                    {userIdStatus?.pinStatus === "UNSET" ? (
                        <tr>
                            <td className='font-semibold'>PIN Status</td>
                            <td className='pl-6'>{userIdStatus?.pinStatus}</td>
                            <td>
                                <button onClick={setPIN} className="text-black rounded ml-6 py-1 px-1 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                                    Set PIN
                                </button>
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td className='font-semibold'>PIN Status</td>
                            <td className='pl-6'>{userIdStatus?.pinStatus}</td>
                            <td>
                                <button onClick={updatePIN} className="text-black rounded ml-6 py-1 px-1 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                                    Update PIN
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {userIdStatus?.pinStatus === "ENABLED" ? (
                <div className="grid items-center gap-2">
                    <div className="text-center mt-2">Forgot your PIN?</div>
                    <button onClick={restorePIN} className="text-black rounded mb-2 px-1 py-1 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                        Reset PIN
                    </button>
                </div>
            ) : (null)}
            {userWallets?.length != 0 ? (
                <>
                <Divider className='my-2'/>
                <div className='grid justify-center'>
                    <div className="text-lg font-semibold my-3 mx-5 text-center">Add faucet to your testnet wallet</div>
                    <form className='grid justify-center' onSubmit={onSubmit}>
                        <InputLabel >Select Wallet</InputLabel>
                        <Select
                            labelId="selectWallet"
                            id="selectWallet"
                            value={wallet || ''}
                            onChange={onChangeHandler(setWallet)}
                            autoWidth
                            label="Select Wallet"
                            variant='filled'
                            className='mb-4'
                        >
                            {userWallets?.map((wallet, index) => (
                                <MenuItem value={wallet.address} key={index}>{wallet.name || ''}</MenuItem>
                            ))}
                        </Select>
                        {wallet ? (
                            <>
                            <InputLabel className='mt-2'>Select Token</InputLabel>
                            <div className='flex'>
                                <FormControlLabel
                                    control={
                                        <Switch checked={eth} onChange={handleChangeChecked(setEth)} name="eth" />
                                    }
                                    label="ETH-SEPOLIA"
                                    labelPlacement="top"
                                    className='my-2'
                                />
                                <FormControlLabel
                                    control={
                                        <Switch checked={usdc} onChange={handleChangeChecked(setUsdc)} name="usdc" />
                                    }
                                    label="USDC"
                                    labelPlacement="top"
                                    className='my-2'
                                />
                                <FormControlLabel
                                    control={
                                        <Switch checked={eudc} onChange={handleChangeChecked(setEudc)} name="eudc" />
                                    }
                                    label="EUDC"
                                    labelPlacement="top"
                                    className='my-2'
                                />
                            </div>
                            {eth || usdc || eudc ? (
                                <button className="text-black rounded mb-2 px-1 py-1 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                                    Add Faucet
                                </button>
                            ) : (null)}
                            </>
                        ) : (null)}
                    </form>
                </div>
                </>
            ) : (null)}
        </div>
    )
}

export default HomeNav;