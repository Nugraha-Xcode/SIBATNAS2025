import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

function LandingPageIndex() {
  return (
    <MDBFooter
      className="text-center"
      color="white"
      style={{ backgroundColor: "darkBlue" }}
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href="" className="me-4 text-reset">
            <MDBIcon color="secondary" fab icon="facebook-f" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon color="secondary" fab icon="twitter" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon color="secondary" fab icon="google" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon color="secondary" fab icon="instagram" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon color="secondary" fab icon="linkedin" />
          </a>
          <a href="" className="me-4 text-reset">
            <MDBIcon color="secondary" fab icon="github" />
          </a>
        </div>
      </section>

      <section>
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="3" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                {/* <MDBIcon icon="gem" className="me-3" /> */}
                Sistem Informasi Batimetri Nasional
              </h6>
              <p>
                Data Batimetri Nasional merupakan kompilasi data dari Tim
                Batimetri Nasional yang terdiri dari : Badan Informasi
                Geospasial, Pusat Hidro-Oseanografi TNI AL, Kementerian Energi
                dan Sumber Daya Mineral, Kementerian Perhubungan, Badan Riset
                dan Inovasi Nasional, dan Kementerian Koordinator Bidang
                Kemaritiman.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Link Cepat</h6>
              <p>
                <a href="#!" className="text-reset">
                  Beranda
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Peta
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Cari
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Berita
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Panduan Pengguna
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Link Terhubung</h6>
              <p>
                <a href="#!" className="text-reset">
                  Batnas
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Demnas
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Kontak</h6>
              <p>
                <MDBIcon color="secondary" icon="home" className="me-2" />
                Sekretariat Tim Batimetri Nasional | JL.Raya Jakarta-Bogor KM.46
                Cibinong, Bogor, 16911, Jawa Barat, Indonesia.
              </p>
              <p>
                <MDBIcon color="secondary" icon="envelope" className="me-3" />
                sibatnas@big.go.id
              </p>
              <p>
                <MDBIcon color="secondary" icon="phone" className="me-3" />{" "}
                021-87901255
              </p>
              <p>
                <MDBIcon color="secondary" icon="print" className="me-3" />{" "}
                87901255
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © 2024 Copyright : 
        <a className="text-reset fw-bold" href="https://sibatnas.big.go.id/">
          Sistem Batimetri Nasional - Badan Informasi Geospasial
        </a>
      </div>
    </MDBFooter>
  );
}

export default LandingPageIndex
