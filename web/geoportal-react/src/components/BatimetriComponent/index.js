import React, { useState } from "react";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBBadge,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBTooltip,
} from "mdb-react-ui-kit";

function BatimetriComponent() {
  const [lihatPetaModal, setLihatPetaModal] = useState(false);
  const [toggleOneModal, settoggleOneModal] = useState(false);
  const [toggleTwoModal, setToggleTwoModal] = useState(false);

  return (
    <div>
      <MDBRow>
        <MDBCol>
          <h4 className="mx-5 mt-3 text-center">
            Batimetri Nasional dan Sistem informasi ini merupakan sinergi dari
            Kementerian dan Lembaga dalam penyediaan data kedalaman laut dan
            topografi Indonesia.
          </h4>
        </MDBCol>
      </MDBRow>
      <MDBRow className="row-cols-1 row-cols-md-4 g-4 mt-3 mx-5">
        <MDBCol>
          <MDBCard className="h-100 ">
            <MDBCardImage
              src="https://mdbootstrap.com/img/new/standard/city/044.webp"
              alt="..."
              position="top"
            />
            <MDBCardBody style={{ position: "relative" }}>
              <MDBCardTitle>Card title</MDBCardTitle>
              <MDBCardText>
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
              </MDBCardText>
              <div className="d-flex justify-content-between mt-3 align-items-end">
                <MDBBadge
                  className="btn-sm"
                  style={{ width: "35%", backgroundColor: "#d1d6ee" }}
                >
                  20/09/2023
                </MDBBadge>
                <MDBBadge
                  className="btn-sm bg-warning"
                  style={{ width: "35%" }}
                >
                  BIG
                </MDBBadge>
              </div>
            </MDBCardBody>
            <MDBCardFooter className="d-flex justify-content-center align-items-center">
              <MDBTooltip tag="a" wrapperProps={{}} title="Lihat Peta">
                <MDBIcon
                  icon="map-marked-alt"
                  className="text-center"
                  color="primary"
                  size="lg"
                  onClick={() => setLihatPetaModal(!lihatPetaModal)}
                />
              </MDBTooltip>

              <div
                className="vertical-line mx-5"
                style={{
                  width: "2px",
                  height: "100%",
                  backgroundColor: "black",
                  margin: "10px", // Sesuaikan jarak horizontal dari garis dengan ikon
                }}
              ></div>

              <MDBTooltip tag="a" wrapperProps={{}} title="Lihat Metadata">
                <MDBIcon
                  icon="info-circle"
                  className=" text-center"
                  color="warning"
                  size="lg"
                  onClick={() => settoggleOneModal(!toggleOneModal)}
                />
              </MDBTooltip>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard className="h-100">
            <MDBCardImage
              src="https://mdbootstrap.com/img/new/standard/city/043.webp"
              alt="..."
              position="top"
            />
            <MDBCardBody>
              <MDBCardTitle>Card title</MDBCardTitle>
              <MDBCardText>
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
              </MDBCardText>
              <div className="d-flex justify-content-between mt-3 align-items-end">
                <MDBBadge
                  className="btn-sm"
                  style={{ width: "35%", backgroundColor: "#d1d6ee" }}
                >
                  20/09/2023
                </MDBBadge>
                <MDBBadge
                  className="btn-sm bg-warning"
                  style={{ width: "35%" }}
                >
                  KHUB
                </MDBBadge>
              </div>
            </MDBCardBody>
            <MDBCardFooter className="d-flex justify-content-center align-items-center">
              <MDBTooltip tag="a" wrapperProps={{}} title="Lihat Peta">
                <MDBIcon
                  icon="map-marked-alt"
                  className="text-center"
                  color="primary"
                  size="lg"
                  onClick={() => setLihatPetaModal(!lihatPetaModal)}
                />
              </MDBTooltip>
              <div
                className="vertical-line mx-5"
                style={{
                  width: "2px",
                  height: "100%",
                  backgroundColor: "black",
                  margin: "10px", // Sesuaikan jarak horizontal dari garis dengan ikon
                }}
              ></div>

              <MDBTooltip tag="a" wrapperProps={{}} title="Lihat Metadata">
                <MDBIcon
                  icon="info-circle"
                  className="text-center"
                  color="warning"
                  size="lg"
                  onClick={() => settoggleOneModal(!toggleOneModal)}
                />
              </MDBTooltip>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard className="h-100">
            <MDBCardImage
              src="https://mdbootstrap.com/img/new/standard/city/042.webp"
              alt="..."
              position="top"
            />
            <MDBCardBody>
              <MDBCardTitle>Card title</MDBCardTitle>
              <MDBCardText>
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
              </MDBCardText>
              <div className="d-flex justify-content-between mt-3 align-items-end">
                <MDBBadge
                  className="btn-sm"
                  style={{ width: "35%", backgroundColor: "#d1d6ee" }}
                >
                  20/09/2023
                </MDBBadge>
                <MDBBadge
                  className="btn-sm bg-warning"
                  style={{ width: "35%" }}
                >
                  ESDM
                </MDBBadge>
              </div>
            </MDBCardBody>
            <MDBCardFooter className="d-flex justify-content-center align-items-center">
              <MDBTooltip tag="a" wrapperProps={{}} title="Lihat Peta">
                <MDBIcon
                  icon="map-marked-alt"
                  className="text-center"
                  color="primary"
                  size="lg"
                  onClick={() => setLihatPetaModal(!lihatPetaModal)}
                />
              </MDBTooltip>

              <div
                className="vertical-line mx-5"
                style={{
                  width: "2px",
                  height: "100%",
                  backgroundColor: "black",
                  margin: "10px", // Sesuaikan jarak horizontal dari garis dengan ikon
                }}
              ></div>

              <MDBTooltip tag="a" wrapperProps={{}} title="Lihat Metadata">
                <MDBIcon
                  icon="info-circle"
                  className="text-center"
                  color="warning"
                  size="lg"
                  onClick={() => settoggleOneModal(!toggleOneModal)}
                />
              </MDBTooltip>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard className="h-100">
            <MDBCardImage
              src="https://mdbootstrap.com/img/new/standard/city/042.webp"
              alt="..."
              position="top"
            />
            <MDBCardBody>
              <MDBCardTitle>Card title</MDBCardTitle>
              <MDBCardText>
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
              </MDBCardText>
              <div className="d-flex justify-content-between mt-3 align-items-end">
                <MDBBadge
                  className="btn-sm"
                  style={{ width: "35%", backgroundColor: "#d1d6ee" }}
                >
                  20/09/2023
                </MDBBadge>
                <MDBBadge
                  className="btn-sm bg-warning"
                  style={{ width: "35%" }}
                >
                  AL
                </MDBBadge>
              </div>
            </MDBCardBody>
            <MDBCardFooter className="d-flex justify-content-center align-items-center">
              <MDBTooltip tag="a" wrapperProps={{}} title="Lihat Peta">
                <MDBIcon
                  icon="map-marked-alt"
                  className="text-center"
                  color="primary"
                  size="lg"
                  onClick={() => setLihatPetaModal(!lihatPetaModal)}
                />
              </MDBTooltip>

              <div
                className="vertical-line mx-5"
                style={{
                  width: "2px",
                  height: "100%",
                  backgroundColor: "black",
                  margin: "10px", // Sesuaikan jarak horizontal dari garis dengan ikon
                }}
              ></div>

              <MDBTooltip tag="a" wrapperProps={{}} title="Lihat Metadata">
                <MDBIcon
                  icon="info-circle"
                  className="text-center"
                  color="warning"
                  size="lg"
                  onClick={() => settoggleOneModal(!toggleOneModal)}
                />
              </MDBTooltip>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <MDBRow className="justify-content-center mt-3 mb-5">
        <MDBCol className="text-center">
          <MDBBtn className="me-4 shadow">
            <MDBIcon icon="chevron-left" size="1x" />
          </MDBBtn>
          <MDBBtn className="shadow">
            <MDBIcon icon="chevron-right" size="1x" />
          </MDBBtn>
        </MDBCol>
      </MDBRow>

      <MDBModal
        open={toggleOneModal}
        setOpen={settoggleOneModal}
        tabIndex="-1"
        staticBackdrop
      >
        <MDBModalDialog scrollable size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Nama Batimetri</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => settoggleOneModal(!toggleOneModal)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBTable striped>
                <MDBTableBody>
                  <h5>Metadata</h5>
                  {[...Array(11)].map((_, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "left" }}>
                        Isi baris ke-{index + 1}
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                onClick={() => {
                  settoggleOneModal(!settoggleOneModal);
                  setTimeout(() => {
                    setToggleTwoModal(!toggleTwoModal);
                  }, 400);
                }}
                style={{ textTransform: "none" }}
              >
                Tampikan Full Metadata
              </MDBBtn>
              {/* <MDBBtn
                color="secondary"
                onClick={() => setScrollableModal(!setScrollableModal)}
              >
                Close
              </MDBBtn>
              <MDBBtn>Save changes</MDBBtn> */}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal
        open={toggleTwoModal}
        setOpen={setToggleTwoModal}
        tabIndex="-1"
        staticBackdrop
      >
        <MDBModalDialog centered size="fullscreen-xxl-down">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modal 2</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setToggleTwoModal(!toggleTwoModal)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Close this modal and show the first with the button below.
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                onClick={() => {
                  setToggleTwoModal(!toggleTwoModal);
                  setTimeout(() => {
                    settoggleOneModal(!toggleOneModal);
                  }, 400);
                }}
                style={{ textTransform: "none" }}
              >
                Kembali Ke Awal
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal
        open={lihatPetaModal}
        setOpen={setLihatPetaModal}
        tabIndex="-1"
        staticBackdrop
      >
        <MDBModalDialog centered size="fullscreen-xxl-down">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Nama Batimetri</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setLihatPetaModal(!lihatPetaModal)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Close this modal and show the first with the button below.
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default BatimetriComponent;
