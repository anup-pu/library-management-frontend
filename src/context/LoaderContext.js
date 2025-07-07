import React, { createContext, useContext, useState } from 'react';
import Loader from '../components/Loader'; // Make sure this component exists

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      {loading && <Loader />} {/* 👈 shows loader when loading is true */}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
