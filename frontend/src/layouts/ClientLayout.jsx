import Header from "../components/Header/Header";

import Footer from "../components/Footer/Footer";

function ClientLayout({
  children
}) {

  return (
    <>

      <Header />

      {children}

      <Footer />

    </>
  );
}

export default ClientLayout;