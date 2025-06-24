import { Typography, Avatar, Grid, useTheme } from "@mui/material";
import { useSelector } from "react-redux";

function PageHeader() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const theme = useTheme();

  // Fungsi untuk mendapatkan motivasi berdasarkan role dan hari
  const getDailyMotivation = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Minggu, 1 = Senin, dst.
    const dayOfMonth = today.getDate();
    
    // Motivasi berdasarkan role untuk setiap hari
    const roleBasedMotivations = {
      ROLE_ADMIN: {
        0: [ // Minggu
          "Minggu yang tenang untuk monitoring sistem batimetri nasional!",
          "Waktu yang tepat untuk evaluasi dan perencanaan strategis data batimetri!",
          "Refleksi mingguan: memastikan integritas data kedalaman laut Indonesia!",
          "Hari yang baik untuk menganalisis performa sistem dan user management!"
        ],
        1: [ // Senin
          "Senin baru, monitoring baru untuk ekosistem batimetri nasional!",
          "Mari awali minggu dengan mengoptimalkan sistem pengelolaan data kedalaman!",
          "Senin adalah momentum untuk koordinasi tim dan evaluasi sistem!",
          "Semangat Senin untuk memastikan akses data batimetri yang berkualitas!"
        ],
        2: [ // Selasa
          "Selasa produktif untuk maintenance dan optimalisasi database batimetri!",
          "Hari yang tepat untuk memastikan sinkronisasi data antar wilayah!",
          "Selasa penuh fokus pada quality control data kedalaman nasional!",
          "Mari pastikan sistem berjalan optimal untuk kepentingan maritim Indonesia!"
        ],
        3: [ // Rabu
          "Pertengahan minggu, saatnya evaluasi menyeluruh sistem batimetri!",
          "Rabu adalah momentum untuk koordinasi dengan stakeholder maritim!",
          "Tengah minggu yang tepat untuk analisis trend data kedalaman!",
          "Rabu produktif untuk memastikan keamanan dan integritas data!"
        ],
        4: [ // Kamis
          "Kamis yang fokus pada pengawasan kualitas data batimetri nasional!",
          "Hampir weekend, pastikan semua sistem monitoring berjalan sempurna!",
          "Kamis adalah hari untuk finalisasi report dan dokumentasi sistem!",
          "Semangat Kamis untuk memastikan aksesibilitas data bagi semua user!"
        ],
        5: [ // Jumat
          "Jumat berkah dengan pencapaian optimal dalam pengelolaan data batimetri!",
          "Akhiri minggu dengan laporan lengkap sistem batimetri nasional!",
          "Jumat yang produktif untuk backup dan securing data kedalaman!",
          "Penutup minggu yang sempurna dengan sistem yang stabil dan aman!"
        ],
        6: [ // Sabtu
          "Sabtu santai namun tetap siaga untuk sistem batimetri 24/7!",
          "Weekend monitoring: memastikan kontinuitas layanan data kedalaman!",
          "Sabtu yang tenang untuk maintenance rutin dan sistem check!",
          "Akhir pekan dengan kepuasan sistem batimetri yang terjaga optimal!"
        ]
      },
      ROLE_WALIDATA: {
        0: [ // Minggu
          "Minggu yang tenang untuk review dan validasi data batimetri wilayah!",
          "Waktu yang tepat untuk evaluasi kualitas data kedalaman di area Anda!",
          "Refleksi mingguan: memastikan akurasi data batimetri regional!",
          "Hari yang baik untuk perencanaan validasi data minggu depan!"
        ],
        1: [ // Senin
          "Senin semangat untuk validasi data batimetri yang presisi!",
          "Mari awali minggu dengan verifikasi data kedalaman yang akurat!",
          "Senin adalah momentum untuk quality assurance data regional!",
          "Semangat baru untuk memastikan standar data batimetri terbaik!"
        ],
        2: [ // Selasa
          "Selasa produktif untuk cross-check dan validasi data lapangan!",
          "Hari yang tepat untuk memastikan konsistensi data antar survei!",
          "Selasa fokus pada verifikasi metadata dan kualitas pengukuran!",
          "Mari pastikan setiap titik kedalaman tervalidasi dengan sempurna!"
        ],
        3: [ // Rabu
          "Pertengahan minggu, saatnya deep review data batimetri!",
          "Rabu adalah momentum untuk koordinasi dengan tim survei lapangan!",
          "Tengah minggu yang tepat untuk analisis anomali data kedalaman!",
          "Rabu produktif untuk memastikan standar kualitas data regional!"
        ],
        4: [ // Kamis
          "Kamis yang fokus pada finalisasi validasi data batimetri!",
          "Hampir weekend, pastikan semua data sudah terverifikasi optimal!",
          "Kamis adalah hari untuk approval data dan dokumentasi QC!",
          "Semangat Kamis untuk melengkapi proses validasi mingguan!"
        ],
        5: [ // Jumat
          "Jumat berkah dengan data batimetri yang tervalidasi sempurna!",
          "Akhiri minggu dengan kepuasan data berkualitas tinggi!",
          "Jumat yang produktif untuk submit data yang sudah divalidasi!",
          "Penutup minggu yang memuaskan dengan standar validasi terpenuhi!"
        ],
        6: [ // Sabtu
          "Sabtu santai setelah minggu penuh validasi data yang teliti!",
          "Weekend dengan kepuasan data batimetri wilayah yang terjamin!",
          "Sabtu yang tenang untuk review final dan persiapan minggu depan!",
          "Akhir pekan dengan pencapaian validasi data yang memuaskan!"
        ]
      },
      ROLE_PRODUSEN: {
        0: [ // Minggu
          "Minggu yang inspiratif untuk persiapan survei batimetri yang optimal!",
          "Waktu yang tepat untuk perencanaan teknis dan logistik survei!",
          "Refleksi mingguan: evaluasi metode dan hasil survei kedalaman!",
          "Hari yang baik untuk maintenance peralatan dan persiapan data!"
        ],
        1: [ // Senin
          "Senin energik untuk memulai survei batimetri yang presisi!",
          "Mari awali minggu dengan semangat mengukur kedalaman laut Indonesia!",
          "Senin adalah momentum untuk eksekusi rencana survei lapangan!",
          "Semangat baru untuk menghasilkan data batimetri berkualitas tinggi!"
        ],
        2: [ // Selasa
          "Selasa produktif untuk pengumpulan data batimetri di lapangan!",
          "Hari yang tepat untuk optimalisasi teknik survei kedalaman!",
          "Selasa fokus pada akurasi pengukuran dan kalibrasi peralatan!",
          "Mari hasilkan data kedalaman yang presisi dan dapat diandalkan!"
        ],
        3: [ // Rabu
          "Pertengahan minggu, saatnya maksimalkan produktivitas survei!",
          "Rabu adalah momentum untuk mencapai target coverage area!",
          "Tengah minggu yang tepat untuk evaluasi progress survei!",
          "Rabu produktif untuk memastikan kualitas data yang dikumpulkan!"
        ],
        4: [ // Kamis
          "Kamis yang fokus pada finalisasi survei dan processing data!",
          "Hampir weekend, pastikan target survei tercapai optimal!",
          "Kamis adalah hari untuk quality check data hasil survei!",
          "Semangat Kamis untuk melengkapi deliverables survei batimetri!"
        ],
        5: [ // Jumat
          "Jumat berkah dengan hasil survei batimetri yang memuaskan!",
          "Akhiri minggu dengan pencapaian target survei yang gemilang!",
          "Jumat yang produktif untuk submit data hasil survei lapangan!",
          "Penutup minggu yang sempurna dengan data berkualitas tinggi!"
        ],
        6: [ // Sabtu
          "Sabtu santai setelah minggu penuh survei yang produktif!",
          "Weekend dengan kepuasan hasil kerja lapangan yang maksimal!",
          "Sabtu yang tenang untuk post-processing dan dokumentasi!",
          "Akhir pekan dengan pencapaian survei batimetri yang membanggakan!"
        ]
      }
    };

    // Ambil role utama (jika ada multiple roles, ambil yang pertama)
    const userRole = Array.isArray(currentUser.roles) 
      ? currentUser.roles[0] 
      : currentUser.roles;
    
    // Fallback ke ROLE_ADMIN jika role tidak ditemukan
    const roleMotivations = roleBasedMotivations[userRole] || roleBasedMotivations.ROLE_ADMIN;
    const dayMotivations = roleMotivations[dayOfWeek];
    const motivationIndex = dayOfMonth % dayMotivations.length;
    
    return dayMotivations[motivationIndex];
  };

  // Fungsi untuk mendapatkan salam berdasarkan jam
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 5) return "Dini hari yang tenang";
    if (hour < 10) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    if (hour < 21) return "Selamat petang";
    return "Selamat malam";
  };

  // Fungsi untuk mendapatkan emoji berdasarkan role dan hari
  const getRoleBasedEmoji = () => {
    const dayOfWeek = new Date().getDay();
    const userRole = Array.isArray(currentUser.roles) 
      ? currentUser.roles[0] 
      : currentUser.roles;

    const roleEmojiMap = {
      ROLE_ADMIN: {
        0: "🖥️", 1: "⚙️", 2: "📊", 3: "🔍", 4: "📋", 5: "✅", 6: "🛡️"
      },
      ROLE_WALIDATA: {
        0: "📝", 1: "🔍", 2: "✅", 3: "📊", 4: "📋", 5: "🎯", 6: "📈"
      },
      ROLE_PRODUSEN: {
        0: "🛠️", 1: "🚢", 2: "📡", 3: "🎯", 4: "📊", 5: "🏆", 6: "⚓"
      }
    };

    return roleEmojiMap[userRole]?.[dayOfWeek] || "🌊";
  };

  // Fungsi untuk mendapatkan title berdasarkan role
  const getRoleTitle = () => {
    const userRole = Array.isArray(currentUser.roles) 
      ? currentUser.roles[0] 
      : currentUser.roles;

    const roleTitles = {
      ROLE_ADMIN: "Administrator Sistem Batimetri",
      ROLE_WALIDATA: "Wali Data Batimetri",
      ROLE_PRODUSEN: "Produsen Data Batimetri"
    };

    return roleTitles[userRole] || "Pengguna Sistem Batimetri";
  };

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {getTimeBasedGreeting()}, {currentUser.username}! {getRoleBasedEmoji()}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 500,
            mb: 1
          }}
        >
          {getRoleTitle()}
        </Typography>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
            maxWidth: 500,
            lineHeight: 1.4
          }}
        >
          {getDailyMotivation()}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;

/*
 <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8),
          }}
          variant="rounded"
          alt={user.name}
          src={user.avatar}
        />
      </Grid>
      */