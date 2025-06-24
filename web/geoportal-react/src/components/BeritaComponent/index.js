import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { retrieveBeritaPublic } from "src/redux/actions/berita";
import {
  MDBBtn,
  MDBCard,
  MDBContainer,
  MDBCol,
  MDBIcon,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBRipple,
  MDBRow,
  MDBSpinner,
} from "mdb-react-ui-kit";

function BeritaComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const beritaList = useSelector((state) => state.berita || []);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const itemsPerPage = 6; // 1 featured + 5 regular items per page

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(retrieveBeritaPublic());
      } catch (err) {
        console.error("Error fetching berita:", err);
        setError("Gagal memuat berita. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [dispatch]);

  // Helper function untuk memotong teks
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    const cleanText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  };

  // Helper function untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function untuk mendapatkan URL gambar
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://mdbcdn.b-cdn.net/img/new/slides/080.webp";

    if (imagePath.startsWith('http')) return imagePath;

    const baseUrl = process.env.REACT_APP_API_URL;
    return imagePath.startsWith('/api/') ? `${baseUrl}${imagePath}` : `${baseUrl}/api/berita/image/${imagePath.split('/').pop()}`;
  };

  // Function untuk handle navigation ke detail berita
  const handleReadMore = (uuid) => {
    navigate(`/berita/${uuid}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(beritaList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = beritaList.slice(startIndex, startIndex + itemsPerPage);

  const featuredBerita = currentItems[0]; // First item as featured
  const regularBerita = currentItems.slice(1); // Rest as regular items

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <MDBContainer className="py-5 text-center">
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
        <p className="mt-3">Memuat berita...</p>
      </MDBContainer>
    );
  }

  if (error) {
    return (
      <MDBContainer className="py-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Oops!</h4>
          <p>{error}</p>
          <hr />
          <MDBBtn
            color="danger"
            onClick={() => window.location.reload()}
          >
            Muat Ulang
          </MDBBtn>
        </div>
      </MDBContainer>
    );
  }

  if (beritaList.length === 0) {
    return (
      <MDBContainer className="py-5 text-center">
        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">Belum Ada Berita</h4>
          <p>Belum ada berita yang dipublikasikan. Silakan kembali lagi nanti.</p>
        </div>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="py-5">
      {/* Featured News Section */}
      {featuredBerita && (
        <MDBRow className="gx-5 border-bottom pb-4 mb-5 mt-4">
          <MDBCol md="6" className="mb-4">
            <MDBRipple
              className="bg-image hover-overlay ripple shadow-2-strong rounded-5"
              rippleTag="div"
              rippleColor="light"
            >
              <img
                src={getImageUrl(featuredBerita.gambar)}
                className="w-100"
                alt={featuredBerita.judul}
                style={{
                  height: "300px",
                  objectFit: "cover",
                  objectPosition: "center"
                }}
                onError={(e) => {
                  e.target.src = "https://mdbcdn.b-cdn.net/img/new/slides/080.webp";
                }}
              />
              <a href="#!" onClick={(e) => {
                e.preventDefault();
                handleReadMore(featuredBerita.uuid);
              }}>
                <div
                  className="mask"
                  style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                ></div>
              </a>
            </MDBRipple>
          </MDBCol>
          <MDBCol md="6" className="mb-4">
            <span className="badge bg-danger px-2 py-1 shadow-1-strong mb-3">
              {"Berita Terbaru"}
            </span>
            <h4>
              <strong>{truncateText(featuredBerita.judul, 60)}</strong>
            </h4>
            <p className="text-muted mb-3">
              {truncateText(featuredBerita.konten, 150)}
            </p>
            <small className="text-muted d-block mb-3">
              <MDBIcon icon="calendar-alt" className="me-2" />
              {formatDate(featuredBerita.createdAt)}
              <MDBIcon icon="eye" className="ms-3 me-2" />
              Berita Terbaru
            </small>
            <MDBBtn
              color="primary"
              onClick={() => handleReadMore(featuredBerita.uuid)}
            >
              <MDBIcon icon="book-open" className="me-2" />
              Baca Selengkapnya
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      )}

      {/* Section Title */}
      <MDBRow className="mb-5">
        <div className="text-center">
          <h2>Berita Terkait</h2>
          <h5 className="text-muted">Berita dan informasi-informasi seputar Batimetri</h5>
          {beritaList.length > 0 && (
            <p className="text-muted">
              Menampilkan {Math.min(startIndex + 1, beritaList.length)} - {Math.min(startIndex + itemsPerPage, beritaList.length)} dari {beritaList.length} berita
            </p>
          )}
        </div>
      </MDBRow>

      {/* Regular News Grid */}
      <MDBRow className="gx-lg-5">
        {regularBerita.map((berita, index) => (
          <MDBCol lg="4" md="6" className="mb-4 mb-lg-0" key={berita.uuid}>
            <div>
              <MDBRipple
                className="bg-image hover-overlay shadow-1-strong ripple rounded-5 mb-4"
                rippleTag="div"
                rippleColor="light"
              >
                <img
                  src={getImageUrl(berita.gambar)}
                  className="img-fluid"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    objectPosition: "center"
                  }}
                  alt={berita.judul}
                  onError={(e) => {
                    e.target.src = "https://mdbcdn.b-cdn.net/img/new/slides/080.webp";
                  }}
                />
                <a href="#!" onClick={(e) => {
                  e.preventDefault();
                  handleReadMore(berita.uuid);
                }}>
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                  ></div>
                </a>
              </MDBRipple>

              <div className="mb-3">
                <span className="badge bg-primary px-2 py-1 shadow-1-strong mb-2">
                  {berita.kategori || "Umum"}
                </span>
              </div>

              <a
                href="#!"
                className="text-dark text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  handleReadMore(berita.uuid);
                }}
              >
                <h5 className="mb-3" style={{ lineHeight: "1.4" }}>
                  {truncateText(berita.judul, 50)}
                </h5>
                <p className="text-muted mb-3" style={{ lineHeight: "1.6" }}>
                  {truncateText(berita.konten, 120)}
                </p>
              </a>

              <small className="text-muted d-block mb-3">
                <MDBIcon icon="calendar-alt" className="me-2" />
                {formatDate(berita.createdAt)}
                <br />
                <MDBIcon icon="tag" className="me-2 mt-1" />
                {berita.kategori}
              </small>

              <MDBBtn
                size="sm"
                outline
                color="primary"
                onClick={() => handleReadMore(berita.uuid)}
              >
                <MDBIcon icon="arrow-right" className="me-2" />
                Selengkapnya
              </MDBBtn>

              <hr />
            </div>
          </MDBCol>
        ))}
      </MDBRow>

      {/* Empty State for Regular News */}
      {regularBerita.length === 0 && featuredBerita && (
        <MDBRow>
          <MDBCol className="text-center">
            <p className="text-muted">Tidak ada berita lain untuk ditampilkan.</p>
          </MDBCol>
        </MDBRow>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination berita" className="mt-5">
          <MDBPagination circle className="mb-0 justify-content-center">
            <MDBPaginationItem disabled={currentPage === 1}>
              <MDBPaginationLink
                href="#"
                tabIndex={-1}
                aria-disabled={currentPage === 1}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              >
                <MDBIcon icon="chevron-left" />
                Previous
              </MDBPaginationLink>
            </MDBPaginationItem>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <MDBPaginationItem
                  key={pageNumber}
                  active={currentPage === pageNumber}
                >
                  <MDBPaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                    {currentPage === pageNumber && (
                      <span className="visually-hidden">(current)</span>
                    )}
                  </MDBPaginationLink>
                </MDBPaginationItem>
              );
            })}

            <MDBPaginationItem disabled={currentPage === totalPages}>
              <MDBPaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
              >
                Next
                <MDBIcon icon="chevron-right" />
              </MDBPaginationLink>
            </MDBPaginationItem>
          </MDBPagination>
        </nav>
      )}
    </MDBContainer>
  );
}

export default BeritaComponent;
