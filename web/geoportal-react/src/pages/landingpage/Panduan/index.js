import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import environment from "src/config/environment";
import { useState, useEffect } from "react";
import TopMenu from "src/components/TopMenu";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Helmet } from "react-helmet-async";
function Panduan() {
  const [data, setData] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [pagination, setPagination] = useState(1);
  const [query, setQuery] = useState("none");
  const [tag, setTag] = useState("Semua");

  const [windowY, setWindowY] = useState(0);

  const menuItems = [
    { title: "PANDUAN", id: "guidelines", isHeader: true },
    { title: "Memulai", id: "getting-started" },
    { title: "Kurasi Data Geospasial", id: "data-curation" },
    { title: "Pengembangan Metadata Geospasial", id: "metadata-development" },
    { title: "Kualitas Data Geospasial", id: "data-quality" },
    {
      title: "Panduan Teknis: Gaya Desain untuk Representasi Data Geospasial",
      id: "design-style",
    },
    //{ title: "Manual Geoportal", id: "geoportal-manual" },
  ];

  //const url_list_data = `${environment.api}/harvestings/limit/title/${page}/${size}/${query}`;
  //const url_list_count = `${environment.api}/harvestings/count/${query}`;
  /*
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch(url_list_data, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
    fetch(url_list_count, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setPagination(Math.ceil(data.count / size));
      });
  }, []);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch(url_list_data, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, [page]);
  
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch(url_list_data, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
    fetch(url_list_count, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setPagination(Math.ceil(data.count / size));
      });
  }, [query]);
  */
  const handleScroll = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  window.addEventListener("scroll", function () {
    //console.log(this.window.scrollY);
    setWindowY(this.window.scrollY);
    /*
    var sticky = document.getElementById("sidebar");
    var scroll = window.scrollY;
    var sections = document.querySelectorAll(".help-single section");
    var sidebarLinks = document.querySelectorAll("#sidebar li a");
    var sidebarWidth = sticky.offsetWidth; // Store the width of the sidebar

    // Update the active link based on scroll position
    sections.forEach(function (section, i) {
      if (section.getBoundingClientRect().top <= scroll - 100) {
        sidebarLinks.forEach((link) => link.classList.remove("active"));
        sidebarLinks[i].classList.add("active");
      }
    });

    // Make the sidebar sticky after scrolling past 170px
    if (scroll >= 170) {
      sticky.classList.add("fixed");
      sticky.style.width = sidebarWidth + "px"; // Apply stored width
    } else {
      sticky.classList.remove("fixed");
      sticky.style.width = "80%"; // Default width when not fixed
    }
      */
  });

  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <>
      <Helmet>
        <title>Panduan Pengguna</title>
      </Helmet>
      <Grid container sx={{ height: "92vh", backgroundColor: "#fff" }}>
        {/* Left Menu */}
        <Grid item xs={3} id="sidebar">
          <Paper
            sx={{
              height: "100%",
              bgcolor: "#1e4620",
              borderRadius: 0,
              color: "white",
              overflowY: "auto",
              //position: "fixed",
              // top: "50px",
              paddingTop: windowY + "px",
            }}
          >
            <List sx={{ padding: "40px" }}>
              {menuItems.map((item) => (
                <ListItem
                  key={item.id}
                  disablePadding
                  sx={{
                    bgcolor: item.isHeader ? "#1e4620" : "#00260c",
                    "&:hover": {
                      bgcolor: !item.isHeader && "#2e562f",
                    },
                    color: activeMenu === item.id ? "#b0b0b0" : "inherit",
                  }}
                >
                  {item.isHeader ? (
                    <ListItemText
                      primary={item.title}
                      sx={{
                        pl: 2,
                        pb: 2,
                        "& .MuiListItemText-primary": {
                          fontWeight: "bold",
                        },
                      }}
                    />
                  ) : (
                    <ListItemButton
                      onClick={() => {
                        handleScroll(item.id);
                        setActiveMenu(item.id);
                      }}
                      sx={{
                        pl: 2,
                        "&:hover": {
                          bgcolor: "#4d8b4f", // Custom hover color for ListItemButton
                        },
                      }}
                    >
                      <ListItemText primary={item.title} />
                    </ListItemButton>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={9}>
          <Box sx={{ p: 4 }}>
            <section id="getting-started">
              <Typography variant="h3" component="h1" gutterBottom>
                Memulai
              </Typography>
              <Typography paragraph sx={{ fontSize: "11pt" }}>
                Sebagai sebuah proyek kolaboratif yang melibatkan banyak
                produsen data, berbagi data menjadi hal penting dalam mendukung
                optimalisasi penggunaan inventarisasi data sekaligus pertukaran
                pengetahuan. Hal ini bertujuan untuk meningkatkan kualitas dan
                eksposur pengelolaan dan penyebarluasan informasi geospasial
                dalam lingkup Jaringan Informasi Geospasial Nasional (JIGN).
                Geoportal Palapa telah dirancang dan dikembangkan sebagai sebuah
                sistem yang dapat memfasilitasi akses data (geospasial) yang
                efektif dan efisien, serta berbagi data baik di dalam inventaris
                data internal maupun dengan Penghubung Simpul Jaringan (PSJ).
              </Typography>
              <Typography paragraph sx={{ fontSize: "11pt" }}>
                Selain itu, Geoportal Palapa juga diharapkan dapat memenuhi
                kebutuhan untuk mempublikasikan atau menyebarluaskan informasi
                geospasial kepada masyarakat yang lebih luas. Untuk
                memaksimalkan manfaat dari Geoportal Palapa dalam mendukung
                kebijakan JIGN, data geospasial harus dipersiapkan dengan cermat
                agar memenuhi standar kualitas yang telah ditetapkan. Kurasi
                data menjadi langkah penting untuk memastikan pengelolaan data
                dilakukan secara tepat, sementara metadata berperan dalam
                menyampaikan kualitas data serta informasi deskriptif lainnya
                yang relevan untuk keperluan berbagi data. Dokumen-dokumen ini
                disusun oleh tim Geoportal Palapa sebagai pedoman dalam
                pengelolaan data sesuai kebijakan Jaringan Informasi Geospasial
                Nasional.
              </Typography>
            </section>

            <section id="data-curation">
              <Typography variant="h3" component="h1" gutterBottom>
                Kurasi Data Geospasial
              </Typography>
              <Typography paragraph sx={{ fontSize: "11pt" }}>
                Kurasi digital dapat didefinisikan sebagai kegiatan memelihara
                dan menambah nilai pada sekumpulan informasi digital terpercaya
                untuk penggunaan saat ini dan di masa depan (Beagrie, 2006).
                Kurasi ini melampaui sekadar pengarsipan dan pelestarian. Kurasi
                data digital berkaitan dengan pengelolaan data "selama data
                tersebut tetap memiliki nilai bagi kepentingan ilmiah,
                penelitian, akademik, dan/atau administratif, dengan tujuan
                mendukung reproduktibilitas hasil, penggunaan ulang, dan
                penambahan nilai pada data tersebut, mengelolanya sejak tahap
                penciptaan hingga dinyatakan tidak lagi berguna, serta
                memastikan aksesibilitas dan pelestarian jangka panjangnya,
                keaslian, dan integritasnya" (DCC n.d. dalam Sandifer n.d.).
              </Typography>
            </section>

            <section id="metadata-development">
              <Typography variant="h3" component="h1" gutterBottom>
                Pengembangan Metadata Geospasial
              </Typography>
              <Typography paragraph sx={{ fontSize: "11pt" }}>
                Metadata spasial atau metadata geografis dapat didefinisikan
                sebagai metadata yang berlaku untuk data dan informasi
                geografis. Metadata ini dapat disimpan bersama dengan data
                geospasial (dalam format vektor dan raster) atau dicantumkan
                dalam dokumen terpisah. Terdapat banyak standar untuk metadata
                geospasial, termasuk standar metadata dari International
                Organization for Standardization (ISO) dan Federal Geographic
                Data Committee (FGDC). Dokumen ini mengadopsi ISO 19115-1:2014 -
                Informasi Geografis - Metadata sebagai standar untuk
                pengembangan informasi geografis atau metadata spasial.
              </Typography>
            </section>

            <section id="data-quality">
              <Typography variant="h3" component="h1" gutterBottom>
                Kualitas Data Geospasial
              </Typography>
              <Typography paragraph sx={{ fontSize: "11pt" }}>
                Dalam dokumen ini, istilah "data geospasial" digunakan untuk
                merujuk pada data yang memberikan informasi tentang lokasi
                fitur, atribut, dan sering kali informasi temporal. Berbagai
                jenis data geospasial dapat dihasilkan untuk berbagai tujuan dan
                melalui berbagai proses.
              </Typography>
            </section>

            <section id="design-style">
              <Typography variant="h3" component="h1" gutterBottom>
                Panduan Teknis: Gaya Desain untuk Representasi Data Geospasial
              </Typography>
              <Typography paragraph sx={{ fontSize: "11pt" }}>
                Panduan ini bertujuan untuk memberikan pedoman teknis dalam
                penerapan gaya desain yang konsisten dan efektif untuk
                representasi data geospasial. Dengan memanfaatkan simbolisasi,
                warna, dan elemen visual lainnya, panduan ini dirancang untuk
                memastikan bahwa data geospasial dapat disajikan secara jelas,
                informatif, dan mudah dipahami oleh berbagai audiens.
              </Typography>
              <Typography paragraph sx={{ fontSize: "11pt" }}>
                Panduan ini mencakup prinsip-prinsip dasar dalam desain visual
                data geospasial, teknik implementasi simbolisasi dalam peta dan
                visualisasi data, serta praktik terbaik untuk mendukung
                publikasi dan penyebaran data geospasial. Melalui penerapan gaya
                desain yang sistematis, representasi data geospasial dapat
                meningkatkan interpretasi, analisis, dan pengambilan keputusan
                berbasis data secara lebih efektif.
              </Typography>
            </section>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Panduan;
