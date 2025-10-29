import React from "react";
import AccomodationSearchBar from "../../components/accomodationSearchBar/AccomodationSearchBar.jsx";
import ProductsCarousel from "../../components/ProductsCarousel.jsx";
import './Home.css'

const Home = () => {
    return (
      <>
      <div className="home-body">
        <AccomodationSearchBar></AccomodationSearchBar>
      </div>
      <div>
        <ProductsCarousel />
      </div>
      </>
    )
};

export default Home; 