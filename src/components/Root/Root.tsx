// Import Header and Footer
import { Outlet } from "react-router";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";

const Root = () => {
    return (
        <div>
            <Header />
            <main className="bg-background-base w-full p-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Root;