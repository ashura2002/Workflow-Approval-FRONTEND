import React from "react";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";
// import { LoginPage } from "./pages/LoginPage";

const App: React.FC = () => {
  return (
    <div>
      {/* <LoginPage /> */}
      <header className="">
        <Header />
      </header>

      <div className="flex h-screen">
        <aside className="w-64 bg-red-200">
          <Sidebar />
        </aside>

        <main className="overflow-y-auto border w-full bg-amber-500">
          <div>
            Main Content <br /> ROUTER HERE lorem1000
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
