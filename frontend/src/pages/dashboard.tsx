import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Chip,
  Button,
  useTheme,
} from "@mui/material";
import {
  SensorsOutlined,
  WarningAmber,
  CheckCircleOutline,
  ErrorOutline,
  Business as BusinessIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

const statusColors = {
  active: "#4caf50",
  inactive: "#9e9e9e",
  maintenance: "#ff9800",
  error: "#f44336",
};

// Test verileri - Gerçek uygulamada API'den alınacak
const dummyData = {
  totalSensors: 24,
  activeSensors: 19,
  inactiveSensors: 2,
  maintenanceSensors: 1,
  errorSensors: 2,
  recentAlerts: [
    {
      id: 1,
      message: "Sıcaklık sensörü kritik seviyeyi aştı",
      severity: "error",
      timestamp: "2023-06-25T10:30:00Z",
    },
    {
      id: 2,
      message: "Nem sensörü bağlantısı koptu",
      severity: "warning",
      timestamp: "2023-06-25T09:15:00Z",
    },
    {
      id: 3,
      message: "Basınç sensörü normal değerlere döndü",
      severity: "info",
      timestamp: "2023-06-24T18:22:00Z",
    },
  ],
  sensorTypes: [
    { name: "Sıcaklık", count: 8 },
    { name: "Nem", count: 5 },
    { name: "Basınç", count: 4 },
    { name: "Hareket", count: 3 },
    { name: "Gaz", count: 2 },
    { name: "Diğer", count: 2 },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(dummyData);
  const theme = useTheme();
  const router = useRouter();
  const statCardStyle = {
    p: 2,
    display: "flex",
    flexDirection: "column",
    height: 140,
    alignItems: "center",
    justifyContent: "flex-start", // İçeriği üstten başlatarak düzenli bir görünüm sağlanıyor
    textAlign: "center",
    pt: 2, // Üstten sabit bir padding
  }; // Başlıklar için ortak stil
  const cardTitleStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 40, // Sabit yükseklik ekliyoruz, böylece tüm başlıklar aynı boyutta olacak
    marginBottom: 1, // Altındaki içerik ile arasında tutarlı boşluk
  };

  // Sayfalar için menü kartları
  const menuItems = [
    {
      title: "Şirketler",
      description: "Şirket bilgilerini görüntüle ve düzenle",
      icon: <BusinessIcon fontSize="large" />,
      path: "/companies",
      color: theme.palette.primary.main,
    },
    {
      title: "Sensörler",
      description: "Sensör verilerini izle ve yönet",
      icon: <SensorsOutlined fontSize="large" />,
      path: "/sensors",
      color: theme.palette.secondary.main,
    },
    {
      title: "Kullanıcılar",
      description: "Kullanıcı yönetimi ve izinler",
      icon: <PeopleIcon fontSize="large" />,
      path: "/users",
      color: theme.palette.success.main,
    },
    {
      title: "Bildirimler",
      description: "Sistem bildirimleri ve uyarılar",
      icon: <NotificationsIcon fontSize="large" />,
      path: "/notifications",
      color: theme.palette.warning.main,
    },
  ];

  // Gerçek uygulamada, burada API'den dashboard verileri alınacak
  useEffect(() => {
    // API'den verileri al
    // setData(apiResponseData);
  }, []);

  return (
    <ProtectedRoute>
      <Head>
        <title>Kontrol Paneli | Sensör İzleme Platformu</title>
      </Head>
      <MainLayout>
        {" "}
        <Typography variant="h4" sx={{ mb: 4 }}>
          Hoş Geldiniz, {user?.name ?? "Kullanıcı"}
        </Typography>
        {/* Hızlı Erişim Kartları - Yatay Liste */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {menuItems.map((item, index) => (
            <Grid item xs={6} sm={3} md={3} key={index}>
              <Paper
                elevation={1}
                onClick={() => router.push(item.path)}
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderLeft: `3px solid ${item.color}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      mr: 1.5,
                      bgcolor: `${item.color}15`,
                      p: 1,
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: { color: item.color, fontSize: "1.3rem" },
                    })}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        {/* İstatistik Başlığı */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Sensör İstatistikleri
        </Typography>{" "}
        {/* Özet Kartları */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            {" "}
            <Paper elevation={2} sx={statCardStyle}>
              {" "}
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                sx={cardTitleStyle}
              >
                <SensorsOutlined sx={{ color: "black", mr: 1 }} /> Toplam
                Sensörler
              </Typography>{" "}
              <Typography
                component="p"
                variant="h3"
                sx={{ width: "100%", textAlign: "center", mt: 1 }}
              >
                {data.totalSensors}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {" "}
            <Paper elevation={2} sx={statCardStyle}>
              {" "}
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                sx={cardTitleStyle}
              >
                <CheckCircleOutline
                  sx={{ color: statusColors.active, mr: 1 }}
                />{" "}
                Aktif Sensörler
              </Typography>{" "}
              <Typography
                component="p"
                variant="h3"
              >
                {data.activeSensors}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {" "}
            <Paper elevation={2} sx={statCardStyle}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
                sx={cardTitleStyle}
              >
                <WarningAmber sx={{ color: statusColors.maintenance, mr: 1 }} />{" "}
                Bakımdaki Sensörler
              </Typography>{" "}
              <Typography
                component="p"
                variant="h3"
            
              >
                {data.maintenanceSensors}
              </Typography>
            
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3} >
          
            <Paper elevation={2} sx={statCardStyle} >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
                sx={cardTitleStyle}
              >
                <ErrorOutline sx={{ color: statusColors.error, mr: 1 }} />{" "}
                Hatalı Sensörler
              </Typography>{" "}
              <Typography
                component="p"
                variant="h3"
              >
                {data.errorSensors}
              </Typography>
                
            
            </Paper>
          </Grid>
        </Grid>
        {/* Alt Bölüm */}
        <Grid container spacing={3}>
          {/* Son Uyarılar */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardHeader title="Son Uyarılar" />
              <CardContent>
                {data.recentAlerts.length > 0 ? (
                  data.recentAlerts.map((alert) => (
                    <Box
                      key={alert.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        bgcolor: "background.paper",
                        borderLeft: 4,
                        borderColor:
                          alert.severity === "error"
                            ? "error.main"
                            : alert.severity === "warning"
                            ? "warning.main"
                            : "info.main",
                      }}
                    >
                      <Typography variant="body1">{alert.message}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {new Date(alert.timestamp).toLocaleString("tr-TR")}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">
                    Henüz bir uyarı bulunmuyor.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sensör Tipleri */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardHeader title="Sensör Tipleri" />
              <CardContent>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {data.sensorTypes.map((type) => (
                    <Chip
                      key={type.name}
                      label={`${type.name}: ${type.count}`}
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
