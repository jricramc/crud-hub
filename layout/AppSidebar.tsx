import Link from "next/link";
import { useContext } from "react";
import AppMenu from "./AppMenu";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { LayoutState } from "../types/layout";

const AppSidebar = () => {
    const { setLayoutState } = useContext(LayoutContext);
    const anchor = () => {
        setLayoutState((prevLayoutState: LayoutState) => ({
            ...prevLayoutState,
            anchored: !prevLayoutState?.anchored,
        }));
    };
    return (
        <>
            <div className="sidebar-header flex-column">
                {/* <Link href="/" className="app-logo">
                    <img src="/assets/hero-light.svg" width="100px" />
                </Link>
                <button
                    className="layout-sidebar-anchor p-link z-2 mb-2"
                    type="button"
                    onClick={anchor}
                ></button> */}
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>API72</div>
                <div style={{ height: 1, width: '30px', marginTop: 5, backgroundColor: '#fefefe' }}></div>
            </div>

            <div className="layout-menu-container">
                <MenuProvider>
                    <AppMenu />
                </MenuProvider>
            </div>
        </>
    );
};

export default AppSidebar;
