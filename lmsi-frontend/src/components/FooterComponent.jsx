import React from "react";

const FooterComponent = () => (
  <footer className="bg-dark text-white text-center py-3 mt-5">
    <p className="mb-0">
      © {new Date().getFullYear()} Talahena Public Library – All Rights Reserved
    </p>
  </footer>
);

export default FooterComponent;
