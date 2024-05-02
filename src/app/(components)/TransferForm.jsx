import { useCallback, useEffect, useState, Fragment } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';

const TransferForm = ({ user, userWallets, checkWalletBalances, outboundTransfer, addContact }) => {
    const [wallet, setWallet] = useState();
    const [destinationAddress, setDestinationAddress] = useState();
    const [tokenId, setTokenId] = useState();
    const [balances, setBalances] = useState();
    const [amounts, setAmounts] = useState();
    const [addToContact, setAddToContact] = useState(false);
    const [contactName, setContactName] = useState();
    const [contactList, setContactList] = useState();

    const onChangeHandler = useCallback(
        (setState) => (e) => {
            const value = e.target.value
            setState(value);
        },
        []
    );

    // Function to submit transfer token
    const onSubmit = async (e) => {
        e.preventDefault();

        // Check if user wants to add an address to contact list or not
        if (addToContact) {
            // If addContact returns true then address is saved to user contact list
            const newFormData = ({
                contactName: contactName,
                address: destinationAddress
            });
            
            await addContact(newFormData, user._id);
        }
        
        await outboundTransfer(wallet, destinationAddress, tokenId, amounts);
    };

    const handleChangeAddContact = (event) => {
        setAddToContact(event.target.checked);
    };

    // Function to check if address is already in contact list or not
    const checkContact = () => {
        if (contactList) {
            for (let i = 0; i < contactList.length; i++) {
                if (destinationAddress === contactList[i]?.address) {
                    // If address is found in contact list then return nothing
                    return null;
                }
            }
            return (
                // If address is not found then return an input of contact name and checkbox of add to contact
                <>
                <TextField
                    label="Contact Name"
                    value={contactName || ''}
                    onChange={onChangeHandler(setContactName)}
                />
                <FormControl className='flex place-content-center'>
                    <FormControlLabel className='place-self-center' control={<Checkbox checked={addToContact} onChange={handleChangeAddContact} />} label="Add to contacts" />
                </FormControl>
                </>
            );
        }
    };

    // Chekc and update wallet balances
    useEffect(() => {
        if (wallet) {
            const balance = checkWalletBalances(wallet);
            balance.then((result) => {
                setBalances(result.data.tokenBalances);
            })
        }

        if (user) {
            setContactList(user.contact)
        }
    }, [wallet, user]);

    useEffect(() => {
        checkContact();
    }, [destinationAddress, contactList]);

    return (
        <>
        <div className="text-black text-xl font-semibold my-3 mx-5 text-center">Transfer Token</div>
        <form className="grid p-4 justify-center gap-4 text-black" onSubmit={onSubmit}>
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
                    <MenuItem value={wallet.id} key={index}>{wallet.name || ''}</MenuItem>
                ))}
            </Select>
            {wallet ? (
                <div className='mx-4 place-self-center mb-4'>
                    {balances?.length > 0 ? (
                        <table className='table-fixed'>
                            <caption className="caption-top pt-2">List of Token Balances</caption>
                            <thead>
                                <tr className='bg-slate-100 text-left'>
                                    <th className='font-semibold px-4 py-2'>Name</th>
                                    <th className='font-semibold px-4 py-2'>Amounts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {balances?.map((token, i) => (
                                    <tr key={i} className='border-b'>
                                        <td className='px-4 py-4'>{token.token.name}</td>
                                        <td className='px-4 py-4 flex items-center'>
                                            <img src={token.token.symbol + '.png'} className='h-6 mr-2' alt={token.token.symbol} />
                                            <p>{token.amount} {token.token.symbol}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) :("You dont have any token balances.")}
                </div>
            ) : (null)}

            {balances?.length >= 1 ? (
                <>
                <InputLabel >Select Token</InputLabel>
                <Select
                    labelId="selectToken"
                    id="selectToken"
                    value={tokenId || ''}
                    onChange={onChangeHandler(setTokenId)}
                    autoWidth
                    label="Select Token"
                    variant='filled'
                    className='mb-4'
                >
                    {balances?.map((token, index) => (
                        <MenuItem value={token.token.id} key={index}>{token.token.name || ''}</MenuItem>
                    ))}
                </Select>

                <InputLabel >Amounts</InputLabel>
                <div className='grid grid-flow-cols grid-cols-2 gap-2 justify-items-center'>
                    <TextField
                        required
                        label="Amounts"
                        type="number"
                        value={amounts || ''}
                        onChange={onChangeHandler(setAmounts)}
                    />
                </div>

                <InputLabel >Destination Address</InputLabel>
                <div className='grid grid-flow-cols grid-cols-2 gap-2 justify-items-center'>
                    <TextField
                        required
                        label="Destination Address"
                        value={destinationAddress || ''}
                        onChange={onChangeHandler(setDestinationAddress)}
                    />
                    {checkContact()}
                </div>
                <InputLabel className='mt-2'>Select destination address from contact list</InputLabel>
                <Select
                    labelId="destinationAddress"
                    id="destinationAddress"
                    value={destinationAddress || ''}
                    onChange={onChangeHandler(setDestinationAddress)}
                    autoWidth
                    label="Destination Address"
                    variant='filled'
                    className='mb-4'
                >
                    {contactList?.map((contact, index) => (
                        <MenuItem value={contact.address} key={index}>{contact.contactName}</MenuItem>
                    ))}
                </Select>

                <button  type='submit' className="text-black rounded mt-4 mb-3 px-4 py-4 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                    Confirm Transfer
                </button>
                </>
            ) : (null)}
        </form>
        </>
    )
}

export default TransferForm;