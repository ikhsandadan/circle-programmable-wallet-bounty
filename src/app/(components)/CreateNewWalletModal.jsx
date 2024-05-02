import { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CreateNewWalletModal = ({ 
    openCreateWalletModal, 
    handleCreateWalletClose, 
    onCreateWalletSubmit,
    setBlockchains, 
    setAccountType,
    name,
    setName,
    refId, 
    setRefId
}) => {

    const onChangeHandler = useCallback(
        (setState) => (e) => {
            const value = e.target.value
            setState(value);
            setBlockchains('ETH-SEPOLIA');
        },
        []
    );

    // handle submit to add new wallet
    const onSubmit = (e) => {
        e.preventDefault();
        onCreateWalletSubmit(e);
    };

    return (
        <Modal
            aria-labelledby="Create New Wallet Modal"
            open={openCreateWalletModal}
            onClose={handleCreateWalletClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
            <Fade in={openCreateWalletModal}>
                <Box sx={style} className="rounded-md">
                    <form className="grid p-4 justify-center gap-4 text-black" onSubmit={onSubmit}>
                        <TextField
                            label="Name"
                            value={name || ''}
                            onChange={onChangeHandler(setName)}
                        />
                        <TextField
                            label="Reference or descriptions"
                            value={refId || ''}
                            onChange={onChangeHandler(setRefId)}
                        />
                        <FormControl>
                            <FormLabel id="accountType">Account Type</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="accountType"
                                name="accountType"
                            >
                                <FormControlLabel required value="SCA" control={<Radio />} label="SCA" onChange={onChangeHandler(setAccountType)} />
                                <FormControlLabel required value="EOA" control={<Radio />} label="EOA" onChange={onChangeHandler(setAccountType)} />
                            </RadioGroup>
                            <FormHelperText>Recomended using SCA type.</FormHelperText>
                        </FormControl>
                        <FormControl
                            required
                            component="fieldset"
                            sx={{ m: 3 }}
                            variant="standard"
                        >
                            <FormLabel component="legend">Blockchains</FormLabel>
                            <FormGroup>
                            <FormControlLabel
                                control={
                                <Checkbox checked={true} readOnly name="eth_sepolia" value="ETH-SEPOLIA"/>
                                }
                                label="ETH-SEPOLIA"
                            />
                            </FormGroup>
                        </FormControl>
                        <button  type='submit' className="text-black rounded mt-4 mb-3 px-4 py-4 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                            Create Wallet
                        </button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    )
}

export default CreateNewWalletModal;