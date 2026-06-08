import { RouterProvider } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import router from "./routes/index";

function App() {
  return (
    <ClientLayout>
      <RouterProvider router={router} />
    </ClientLayout>
  );
}

export default App;