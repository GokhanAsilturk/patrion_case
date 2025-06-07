import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { UserRole } from '../types/user';
import Link from 'next/link';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Sensors as SensorsIcon,
  ListAlt as ListAltIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    text: 'Kullanıcılar',
    icon: <PeopleIcon />,
    path: '/users',
    roles: [UserRole.ADMIN],
  },
  {
    text: 'Şirketler',
    icon: <BusinessIcon />,
    path: '/companies',
    roles: [UserRole.ADMIN],
  },
  {
    text: 'Sensörler',
    icon: <SensorsIcon />,
    path: '/sensors',
    roles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    text: 'Loglar',
    icon: <ListAltIcon />,
    path: '/logs',
    roles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    text: 'Bildirimler',
    icon: <NotificationsIcon />,
    path: '/notifications',
    roles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    text: 'Ayarlar',
    icon: <SettingsIcon />,
    path: '/settings',
    roles: [UserRole.ADMIN, UserRole.USER],
  },
  {
    text: 'Profil',
    icon: <PersonIcon />,
    path: '/profile',
    roles: [UserRole.ADMIN, UserRole.USER],
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
    handleMenuClose();
  };

  // Kullanıcının rolüne göre menü öğelerini filtrele
  const filteredMenuItems = menuItems.filter((item) => {
    if (!user) return false;
    return item.roles.includes(user.role as UserRole);
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            <Link
              href="/dashboard"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Sensör İzleme Platformu
            </Link>
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
              {user?.name?.charAt(0) ?? 'U'}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profil</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Çıkış Yap</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Kontrol Paneli
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />        {/* Ana Sayfalar - Hızlı Erişim */}
        <Box sx={{ py: 1 }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: 0.5, 
              fontSize: '0.75rem', 
              px: 2, 
              mb: 1 
            }}
          >
            Hızlı Erişim
          </Typography>
          <List dense>
            <ListItem disablePadding>
              <ListItemButton 
                selected={router.pathname === '/companies'} 
                onClick={() => handleNavigate('/companies')}
                sx={{
                  borderLeft: router.pathname === '/companies' ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <BusinessIcon fontSize="small" color={router.pathname === '/companies' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary="Şirketler" 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: router.pathname === '/companies' ? 600 : 400 
                  }}
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                selected={router.pathname === '/sensors'} 
                onClick={() => handleNavigate('/sensors')}
                sx={{
                  borderLeft: router.pathname === '/sensors' ? `4px solid ${theme.palette.secondary.main}` : '4px solid transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SensorsIcon fontSize="small" color={router.pathname === '/sensors' ? 'secondary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary="Sensörler" 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: router.pathname === '/sensors' ? 600 : 400 
                  }}
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                selected={router.pathname === '/users'} 
                onClick={() => handleNavigate('/users')}
                sx={{
                  borderLeft: router.pathname === '/users' ? `4px solid ${theme.palette.success.main}` : '4px solid transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PeopleIcon fontSize="small" color={router.pathname === '/users' ? 'success' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary="Kullanıcılar" 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: router.pathname === '/users' ? 600 : 400 
                  }}
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                selected={router.pathname === '/notifications'} 
                onClick={() => handleNavigate('/notifications')}
                sx={{
                  borderLeft: router.pathname === '/notifications' ? `4px solid ${theme.palette.warning.main}` : '4px solid transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <NotificationsIcon fontSize="small" color={router.pathname === '/notifications' ? 'warning' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary="Bildirimler" 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: router.pathname === '/notifications' ? 600 : 400 
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Divider sx={{ mt: 0, mb: 0 }} />
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={router.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="xl">
          {children}
        </Container>
      </Main>
    </Box>
  );
};

export default MainLayout;