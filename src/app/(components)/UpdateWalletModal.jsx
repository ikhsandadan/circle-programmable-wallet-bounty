import { useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

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

const UpdateWalletModal = ({ 
    openUpdateWalletModal, 
    handleUpdateWalletClose, 
    onUpdateWalletSubmit, 
    name, 
    setName, 
    refId, 
    setRefId }) => {
    const onChangeHandler = useCallback(
        (setState) => (e) => {
            const value = e.target.value
            setState(value);
        },
        []
    );

    return (
        <Modal
            aria-labelledby="Update Wallet Modal"
            open={openUpdateWalletModal}
            onClose={handleUpdateWalletClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
            <Fade in={openUpdateWalletModal}>
                <Box sx={style} className="rounded-md">
                    <form className="grid p-4 justify-center gap-4" onSubmit={onUpdateWalletSubmit}>
                        <TextField
                            label="name"
                            value={name || ''}
                            onChange={onChangeHandler(setName)}
                        />
                        <TextField
                            label="refId"
                            value={refId || ''}
                            onChange={onChangeHandler(setRefId)}
                        />
                        <button  type='submit' className="text-black rounded mt-4 mb-3 px-4 py-4 bg-slate-300 self-center hover:bg-slate-600 hover:text-white">
                            Update
                        </button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    )
}

export default UpdateWalletModal;