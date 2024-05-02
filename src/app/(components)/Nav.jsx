"use client";
import { useState, useContext, useEffect } from 'react';
import Link from "next/link";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { MenuList } from '@mui/material';

import UserContext from '../context/UserContext';
import AppContext from '../context/AppContext';

function Nav() {
    const router = useRouter();
    const pathName = usePathname();
    const { data: session } = useSession();
    const { checkUser } = useContext(AppContext);
    const { profile, setProfile, setUser, setFormData } = useContext(UserContext);
    const { notification, setNotification } = useContext(AppContext);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [badge, setBadge] = useState(0);
    const open = Boolean(anchorEl);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenNotif = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNotif = () => {
        setAnchorEl(null);
    };

    const handleSignin = (e) => {
        e.preventDefault();
        signIn();
    };

    const handleSignout = (e) => {
        e.preventDefault();
        localStorage.clear();
        signOut();
    };

    const clearAllNotifications = () => {
        localStorage.clear('notification');
        setNotification([]);
    };

    useEffect(() => {
        // Set user profile data
        if (session) {
            setProfile(session?.user);

            const user = checkUser(session.user.email);
            user.then((result) => {
                setUser(result.foundUser);
            })

            let startingUserData = {
                name: session?.user.name,
                email: session?.user.email,
                imageProfile: session?.user.image,
                userId: "",
                contact: []
            };

            setFormData(startingUserData);
        }

        if (!session && pathName === '/Profile') {
            router.replace('/');
        }
    }, [session]);

    useEffect(() => {
        setBadge(notification.length);
    }, [notification]);

    return (
        <AppBar position="fixed">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
            <Link href="/">
                <img src="circle.png" className="w-36 pr-4"/>
            </Link>

            {profile ? 
                <>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                </Box>
                <Box sx={{flexGrow: 0}} className="pr-6">
                    <Tooltip title="Open Notifications">
                    <IconButton
                        size="large"
                        aria-label={`show ${badge} new notifications`}
                        color="inherit"
                        onClick={handleOpenNotif}
                    >
                        <Badge badgeContent={badge} color="error" >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="notification"
                        anchorEl={Boolean(anchorEl)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                    }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={open}
                        onClose={handleCloseNotif}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuList className='grid gap-2'>
                            {notification.map((notif, index) => (
                                <MenuItem key={index} className="hover:bg-slate-600 hover:text-white">
                                    <Typography variant="inherit" noWrap>
                                        {notif}
                                    </Typography>
                                </MenuItem>
                            ))}
                            {notification.length < 1 ? (
                                <MenuItem>
                                    No Notifications
                                </MenuItem>
                            ) : (
                                <MenuItem className='hover:bg-white place-self-center'>
                                    <div onClick={clearAllNotifications} className="bg-slate-300 hover:bg-red-600 hover:text-white px-4 py-4 rounded">
                                        Clear all notifications
                                    </div>
                                </MenuItem>
                            )}
                        </MenuList>
                    </Menu>
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt="Remy Sharp" src={profile?.image} />
                    </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem className="hover:bg-slate-600 hover:text-white">
                            <Link href="#" onClick={handleSignout}>
                                Sign Out
                            </Link>
                        </MenuItem>
                    </Menu>
                </Box>
                </>
            : 
                <Link href="#" onClick={handleSignin} className="self-center ml-auto bg-white/5 text-white p-2 rounded-md hover:bg-white/15">
                    <button>Login</button>
                </Link>
            }
            </Toolbar>
        </Container>
        </AppBar>
    );
}
export default Nav;