import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

import SidebarLayout from "src/layouts/SidebarLayout";
import BaseLayout from "src/layouts/BaseLayout";

import SuspenseLoader from "src/components/SuspenseLoader";
import LoggedArea from "./utils/LoggedArea";
import AdminArea from "./utils/AdminArea";

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

//Auth
const Login = Loader(lazy(() => import("src/pages/auth/LoginCaptcha")));
const Logout = Loader(lazy(() => import("src/pages/auth/Logout")));
// Pages
const LandingPage = Loader(lazy(() => import("src/pages/landingpage")));
//const Katalog = Loader(lazy(() => import("src/pages/landingpage/Katalog")));
const Katalog = Loader(lazy(() => import("src/pages/landingpage/Record")));
const Peta = Loader(lazy(() => import("src/pages/landingpage/Map")));
const Panduan = Loader(lazy(() => import("src/pages/landingpage/Panduan")));
const BeritaPage = Loader(lazy(() => import("src/pages/landingpage/Berita")));
const BeritaDetailPage = Loader(lazy(() => import("src/pages/landingpage/Berita/Detail")));

// Status

const Status404 = Loader(
  lazy(() => import("src/pages/landingpage/Status/Status404"))
);
const Status500 = Loader(
  lazy(() => import("src/pages/landingpage/Status/Status500"))
);
const StatusComingSoon = Loader(
  lazy(() => import("src/pages/landingpage/Status/ComingSoon"))
);
const StatusMaintenance = Loader(
  lazy(() => import("src/pages/landingpage/Status/Maintenance"))
);

const Overview = Loader(lazy(() => import("src/pages/overview")));
// Dashboards
const Aktivitas = Loader(lazy(() => import("src/pages/dashboards/Aktivitas")));
const Notifikasi = Loader(
  lazy(() => import("src/pages/dashboards/Notifikasi"))
);

// Systems
//const UserRole = Loader(lazy(() => import("src/pages/systems/User/Role")));
//const UserList = Loader(lazy(() => import("src/pages/systems/User/List")));
const User = Loader(lazy(() => import("src/pages/systems/User")));
//const UserForm = Loader(lazy(() => import("src/pages/systems/User/UserForm")));

const Settings = Loader(lazy(() => import("src/pages/systems/Settings")));

// Akun
const UserProfile = Loader(lazy(() => import("src/pages/akun/profile")));
const UserSettings = Loader(lazy(() => import("src/pages/akun/settings")));

// Managements
//const Produsen = Loader(lazy(() => import("src/pages/managements/Produsen")));
const IGT = Loader(lazy(() => import("src/pages/managements/IGT")));
const Keywords = Loader(lazy(() => import("src/pages/managements/Keywords")));
const Pemeriksaan = Loader(
  lazy(() => import("src/pages/managements/Pemeriksaan"))
);

// data
const DProdusen = Loader(lazy(() => import("src/pages/data/Produsen")));
const DPemeriksaan = Loader(lazy(() => import("src/pages/data/Pemeriksaan")));
const DPublikasi = Loader(lazy(() => import("src/pages/data/Publikasi")));
const DPublikasiCsw = Loader(
  lazy(() => import("src/pages/data/Publikasi_Csw"))
);
const Unduh = Loader(lazy(() => import("src/pages/data/Unduh")));
const Metadata = Loader(lazy(() => import("src/pages/metadata/Metadata")));
//const UnduhMetadata = Loader(lazy(() => import("src/pages/metadata/Unduh")));

// batnas
const Upload = Loader(lazy(() => import("src/pages/batnas/Upload")));
const Verifikasi = Loader(lazy(() => import("src/pages/batnas/Verifikasi")));
const Publikasi = Loader(lazy(() => import("src/pages/batnas/Publikasi")));
const RencanaSurvei = Loader(
  lazy(() => import("src/pages/batnas/RencanaSurvei"))
);
const Berita = Loader(lazy(() => import("src/pages/batnas/Berita")));
const Komentar = Loader(lazy(() => import("src/pages/batnas/Komentar")));

const UnduhEksternal = Loader(
  lazy(() => import("src/pages/data/UnduhEksternal"))
);

const routes = [
  {
    path: "",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "katalog",
        element: <Katalog />,
      },
      {
        path: "berita",
        children: [
          {
            path: "",
            element: <BeritaPage />,
          },
          {
            path: ":uuid",
            element: <BeritaDetailPage />,
          },
        ],
      },
      {
        path: "panduan",
        element: <Panduan />,
      },
      {
        path: "peta",
        element: <Peta />,
      },
      {
        path: "auth",
        children: [
          {
            path: "",
            element: <Navigate to="login" replace />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "logout",
            element: <Logout />,
          },
        ],
      },
      {
        path: "status",
        children: [
          {
            path: "",
            element: <Navigate to="404" replace />,
          },
          {
            path: "404",
            element: <Status404 />,
          },
          {
            path: "500",
            element: <Status500 />,
          },
          {
            path: "maintenance",
            element: <StatusMaintenance />,
          },
          {
            path: "coming-soon",
            element: <StatusComingSoon />,
          },
        ],
      },
      {
        path: "*",
        element: <Status404 />,
      },
    ],
  },
  {
    path: "overview",
    element: (
      <LoggedArea>
        <SidebarLayout />
      </LoggedArea>
    ),
    children: [
      {
        path: "",
        element: <Overview />,
      },
    ],
  },
  {
    path: "systems",
    element: (
      <LoggedArea>
        <SidebarLayout />
      </LoggedArea>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="settings" replace />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "user",
        element: (
          <AdminArea>
            <User />
          </AdminArea>
        ),
      },
    ],
  },
  {
    path: "akun",
    element: (
      <LoggedArea>
        <SidebarLayout />
      </LoggedArea>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="profile" replace />,
      },
      {
        path: "profile",
        children: [
          {
            path: "",
            element: <Navigate to="details" replace />,
          },
          {
            path: "details",
            element: <UserProfile />,
          },
          {
            path: "settings",
            element: <UserSettings />,
          },
          {
            path: "aktivitas",
            element: <Aktivitas />,
          },
          {
            path: "notifikasi",
            element: <Notifikasi />,
          },
        ],
      },
    ],
  },
  {
    path: "managements",
    element: (
      <LoggedArea>
        <SidebarLayout />
      </LoggedArea>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="igt" replace />,
      },
      {
        path: "igt",
        element: <IGT />,
      },
      {
        path: "keywords",
        element: <Keywords />,
      },
      //{
      //  path: "produsen",
      //  element: <Produsen />,
      //},
      {
        path: "pemeriksaan",
        element: <Pemeriksaan />,
      },
    ],
  },
  {
    path: "data",
    element: (
      <LoggedArea>
        <SidebarLayout />
      </LoggedArea>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="produsen" replace />,
      },

      {
        path: "produsen",
        element: <DProdusen />,
      },

      {
        path: "pemeriksaan",
        element: <DPemeriksaan />,
      },
      {
        path: "publikasi",
        children: [
          {
            path: "",
            element: <DPublikasi />,
          },
          {
            path: "unduh/:uuid",
            element: <Unduh tab="role" />,
          },
        ],
      },
      {
        path: "publikasi-csw",
        children: [
          {
            path: "",
            element: <DPublikasiCsw />,
          },
        ],
      },
    ],
  },
  {
    path: "metadata",
    element: (
      <LoggedArea>
        <SidebarLayout />
      </LoggedArea>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="daftar" replace />,
      },
      {
        path: "daftar",
        children: [
          {
            path: "",
            element: <Metadata />,
          },
          //{
          //  path: "unduh/:uuid",
          //  element: <Unduh tab="role" />,
          // },
        ],
      },
    ],
  },
  {
    path: "batnas",
    element: (
      <LoggedArea>
        <SidebarLayout />
      </LoggedArea>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="upload" replace />,
      },
      {
        path: "upload",
        element: <Upload />,
      },
      {
        path: "verifikasi",
        element: <Verifikasi />,
      },
      {
        path: "publikasi",
        element: <Publikasi />,
      },
      {
        path: "rencanaSurvei",
        element: <RencanaSurvei />,
      },
      {
        path: "berita",
        element: <Berita />,
      },
      {
        path: "komentar",
        element: <Komentar />,
      },
    ],
  },
];

export default routes;
