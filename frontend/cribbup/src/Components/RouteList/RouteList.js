
import React, { useContext } from "react";
import { Spinner } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "../Context/AuthContext";
import PrivateRoute from "../Context/PrivateRoute";
import NavBar from "../Navbar/NavBar";
import Footer from '../Footer/Footer';
import HomePage from '../HomePage/HomePage';
import Login from "../AuthContext/LoginForm";
import SignupForm from '../AuthContext/signUpForm';
import SearchPage from "../Properties/SearchPage";
import BuildingDetails from '../Properties/Building';
import FavoritePage from "../Properties/FavoritePage";
import Profile from "../User/Profile";
import NotFoundPage from "../NotFoundPage/NotFound";


function RouteList() {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-5 pageSpinner" />;
    }

    return (
        <AuthProvider>
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/favorites" element={<FavoritePage />} />
                    <Route path="/property/:zpid" element={<BuildingDetails />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Wildcard Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* Footer */}
            <Footer />
        </AuthProvider>
    );
}

export default RouteList;

