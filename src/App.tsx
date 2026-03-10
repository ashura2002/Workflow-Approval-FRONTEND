import React from "react";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <div>
      <header>
        <Header />
      </header>

      <div className="flex h-screen">
        <aside className="w-64 bg-red-200">
          <Sidebar />
        </aside>

        <main className=" overflow-y-auto border w-full bg-amber-500">
          <div>Main Content</div>
        </main>
      </div>
    </div>
  );
};

export default App;
