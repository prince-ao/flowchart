import { useState, useEffect } from "react";

const useDeviceSize = () => {
  const [isPhone, setIsPhone] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const phoneMediaQuery = window.matchMedia("(max-width: 768px)");
    const tabletMediaQuery = window.matchMedia(
      "(min-width: 769px) and (max-width: 1080px)"
    );

    const handlePhoneMediaQueryChange = (event) => {
      setIsPhone(event.matches);
    };

    const handleTabletMediaQueryChange = (event) => {
      setIsTablet(event.matches);
    };

    handlePhoneMediaQueryChange(phoneMediaQuery); // Set initial value for phone
    handleTabletMediaQueryChange(tabletMediaQuery); // Set initial value for tablet

    phoneMediaQuery.addEventListener("change", handlePhoneMediaQueryChange); // Listen for changes
    tabletMediaQuery.addEventListener("change", handleTabletMediaQueryChange); // Listen for changes

    return () => {
      phoneMediaQuery.removeEventListener(
        "change",
        handlePhoneMediaQueryChange
      );
      tabletMediaQuery.removeEventListener(
        "change",
        handleTabletMediaQueryChange
      );
    };
  }, []);

  return { isPhone, isTablet };
};

export default useDeviceSize;
