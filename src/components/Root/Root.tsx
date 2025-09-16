// Import Header and Footer
import { Outlet } from "react-router";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import useLoginManager from "@utils/hooks/useLoginManager";

const Root = () => {
    // Use Login Manager once at the project root.
    useLoginManager();

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