import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Site } from "./pages/Site";
import { Courses } from "./pages/Courses";
import { Exams } from "./pages/Exams";
import { Faculty } from "./pages/Faculty";
import { Testimonials } from "./pages/Testimonials";
import { Blog } from "./pages/Blog";
import { WhyUs } from "./pages/WhyUs";
import { Stats } from "./pages/Stats";
import { Banners } from "./pages/Banners";
import { GalleryImages } from "./pages/GalleryImages";
import { ContactSubmissions } from "./pages/ContactSubmissions";
import { AdmissionSubmissions } from "./pages/AdmissionSubmissions";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="site" element={<Site />} />
        <Route path="courses" element={<Courses />} />
        <Route path="exams" element={<Exams />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blog" element={<Blog />} />
        <Route path="why-us" element={<WhyUs />} />
        <Route path="stats" element={<Stats />} />
        <Route path="banners" element={<Banners />} />
        <Route path="gallery" element={<GalleryImages />} />
        <Route path="submissions/contact" element={<ContactSubmissions />} />
        <Route path="submissions/admission" element={<AdmissionSubmissions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
