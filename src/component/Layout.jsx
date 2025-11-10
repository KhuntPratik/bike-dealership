import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbarr from './Navbarr';
import Footer from './Footer';

const Layout = () => {
	return (
		<>
			<Navbarr />
			<div className="container-fluid">
				<Outlet />
			</div>
			<Footer />
		</>
	);
};

export default Layout;