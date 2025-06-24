import { Card, CardContent, Grid, Tooltip } from "@mui/material";
import Big from "src/assets/lembaga/big.svg";
import AL from "src/assets/lembaga/AL.svg";
import KHUB from "src/assets/lembaga/KHUB.svg";
import MRVS from "src/assets/lembaga/MRVS.svg";
import SDM from "src/assets/lembaga/SDM.svg";
import BRIN from "src/assets/lembaga/BRIN.svg";

function LembagaComponent() {
  const lembagaData = [
    {
      src: Big,
      alt: "Big",
      title: "Badan Informasi Geospasial",
      url: "https://www.big.go.id/",
    },
    {
      src: BRIN,
      alt: "BRIN",
      title: "Badan Riset dan Inovasi Nasional",
      url: "https://brin.go.id",
    },
    {
      src: SDM,
      alt: "SDM",
      title: "Kementerian Energi dan Sumber Daya Mineral",
      url: "https://www.esdm.go.id/",
    },
    {
      src: KHUB,
      alt: "KHUB",
      title: "Kementerian Perhubungan RI",
      url: "https://dephub.go.id/",
    },
    {
      src: MRVS,
      alt: "MRVS",
      title: "Kementerian Koordinator Bidang Kemaritiman dan Investasi",
      url: "https://maritim.go.id/",
    },
    {
      src: AL,
      alt: "AL",
      title: "Pusat Hidro-Oseanografi TNI AL",
      url: "https://www.pushidrosal.id/",
    },
  ];

  const handleLogoClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const logoStyle = {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    cursor: "pointer",
    transition: "transform 0.3s ease, filter 0.3s ease",
    filter: "grayscale(0%)",
  };

  const logoHoverStyle = {
    transform: "scale(1.1)",
    filter: "grayscale(0%) brightness(1.1)",
  };

  return (
    <Card
      className="shadow border p-3 mt-5"
      style={{ 
        margin: "55px", 
        backgroundColor: "#f6f8f3",
        width: "100%",
        borderRadius: "8px"
      }}
    >
      <CardContent className="p-4">
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '0 40px'
          }}
        >
          {lembagaData.map((lembaga, index) => (
            <div
              key={index}
              style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: '120px'
              }}
            >
              <Tooltip 
                title={lembaga.title}
                placement="top"
                arrow
              >
                <img
                  src={lembaga.src}
                  alt={lembaga.alt}
                  style={logoStyle}
                  onClick={() => handleLogoClick(lembaga.url)}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, logoHoverStyle);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.filter = "grayscale(0%)";
                  }}
                />
              </Tooltip>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default LembagaComponent;