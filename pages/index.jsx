import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useSession, signIn, signOut } from 'next-auth/react';

import '../src/app/assets/css/main.css';
// import '../src/app/assets/css/noscript.css';

export default function Home() {

	const { data: session } = useSession();
	const [preload, setPreload] = useState(true);

	console.log('session: ', session)

  useEffect(() => {
    // const scripts = [
    // //   'jquery.min.js',
    // //   'jquery.scrollex.min.js',
    // //   'jquery.scrolly.min.js',
    // //   'browser.min.js',
    // //   'breakpoints.min.js',
    // //   'util.js',
    // //   'main.js',
    // ].map((fileName) => {

    //   const script = document.createElement("script")

    //   script.src = `/js/${fileName}`;

    //   script.async = true

    //   // script.integrity =
    //   //   "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"

    //   script.crossOrigin = "anonymous"

    //   document.body.appendChild(script)

    //   return script;
    // });



    // Play initial animations on page load.
	setPreload();
    

    // return () => {
    //   for(let i = 0; i < scripts.length; i += 1) {
    //     // clean up the script when the component in unmounted
    //     document.body.removeChild(scripts[i])
    //   }
    // }
  }, [])

  return (
    <div className={`landing ${preload ? 'is-preload' : ''}`}>

		{/* <!-- Page Wrapper --> */}
			<div id="page-wrapper">

				{/* <!-- Header --> */}
					<header id="header" className="alt">
						<h1><a href="#">CrudHUB</a></h1>
						{/* <nav id="nav">
							<ul>
								<li className="special">
									<a href="#menu" className="menuToggle"><span>Menu</span></a>
									<div id="menu">
										<ul>
											<li><a href="#">Home</a></li>
											<li><a href="#">Generic</a></li>
											<li><a href="#">Elements</a></li>
											<li><a href="#">Sign Up</a></li>
											<li><a href="#">Log In</a></li>
										</ul>
									</div>
								</li>
							</ul>
						</nav> */}
					</header>

				{/* <!-- Banner --> */}
					<section id="banner">
						<div className="inner">
							<h2>CrudHUB</h2>
                            <p>Develope, deploy, and<br /> manage your APIs effortlessly</p>
                            {/* <p>Your one stop shop to build and manage your APIs</p> */}
							{/* <p>Automating development, deployment, and management of APIs</p> */}
							<ul className="actions special">
								<li>
								<button
									className="button primary"
									onClick={() => signIn('google', { callbackUrl: '/projects' })}
								>{session ? 'Open Projects' : 'Sign In'}</button>
								</li>
							</ul>
						</div>
						<a href="#one" className="more scrolly">Learn More</a>
					</section>

				{/* <!-- One --> */}
					<section id="one" className="wrapper style1 special">
						<div className="inner">
							<header className="major">
								<h2>
                                Build and manage fully functional hosted APIs for free Powered by AWS
                                </h2>
								<p>CrudHUB offers web developers a <span style={{ textDecoration: 'underline' }}>online sandbox</span> to develop, test, and deploy CRUD APIs with zero code required. As a developer you are able to leverage the power of our <span style={{ textDecoration: 'underline' }}>out of the box integrations</span> with AWS services like DynamoDB, API Gateway, and Lambda to create dynamic and complex CRUD APIs effortlessly.  </p>
							</header>
							{/* <ul className="icons major">
								<li><span className="icon fa-gem major style1"><span className="label">Lorem</span></span></li>
								<li><span className="icon fa-heart major style2"><span className="label">Ipsum</span></span></li>
								<li><span className="icon solid fa-code major style3"><span className="label">Dolor</span></span></li>
							</ul> */}
						</div>
					</section>

				{/* <!-- Two --> */}
					<section id="two" className="wrapper alt style2">
						<section className="spotlight">
							<div className="image"><img src="images/pic01.jpg" alt="" /></div><div className="content">
								<h2>Speed up your development<br />
								 cycle and iterate faster</h2>
								<p>Our application uses industry standard frameworks to deploy AWS infrastructure in seconds and orchastrate them through a simple REST APIs. Allowing developers to focus on designing a high level API architecture.</p>
							</div>
						</section>
						<section className="spotlight">
							<div className="image"><img src="images/pic02.jpg" alt="" /></div><div className="content">
								<h2>Automatic Documentation<br />
								and data management out of the box</h2>
								<p>All data passing through a CrudHUB API endpoint is compressed and summarized into a secure ledger that records your API data story. This serves as a <span style={{ textDecoration: 'underline' }}>single source of truth</span> from which we dynamically build your API documentation from.</p>
							</div>
						</section>
						<section className="spotlight">
							<div className="image"><img src="images/pic03.jpg" alt="" /></div><div className="content">
								<h2>Free Hosting and access<br />
								to expensive third party services</h2>
								<p>CrudHUB builds developers an online sandbox to access enterprise level AWS servics with no strings attached.</p>
							</div>
						</section>
					</section>

				{/* <!-- Three --> */}
					{/* <section id="three" className="wrapper style3 special">
						<div className="inner">
							<header className="major">
								<h2>Products we offer access to</h2>
								<p>Our list of products is not limited to but incldues<br />the following systems and resources displayed below</p>
							</header>
							<ul className="features">
								<li className="icon fa-paper-plane">
									<h3>Arcu accumsan</h3>
									<p>Augue consectetur sed interdum imperdiet et ipsum. Mauris lorem tincidunt nullam amet leo Aenean ligula consequat consequat.</p>
								</li>
								<li className="icon solid fa-laptop">
									<h3>Ac Augue Eget</h3>
									<p>Augue consectetur sed interdum imperdiet et ipsum. Mauris lorem tincidunt nullam amet leo Aenean ligula consequat consequat.</p>
								</li>
								<li className="icon solid fa-code">
									<h3>Mus Scelerisque</h3>
									<p>Augue consectetur sed interdum imperdiet et ipsum. Mauris lorem tincidunt nullam amet leo Aenean ligula consequat consequat.</p>
								</li>
								<li className="icon solid fa-headphones-alt">
									<h3>Mauris Imperdiet</h3>
									<p>Augue consectetur sed interdum imperdiet et ipsum. Mauris lorem tincidunt nullam amet leo Aenean ligula consequat consequat.</p>
								</li>
								<li className="icon fa-heart">
									<h3>Aenean Primis</h3>
									<p>Augue consectetur sed interdum imperdiet et ipsum. Mauris lorem tincidunt nullam amet leo Aenean ligula consequat consequat.</p>
								</li>
								<li className="icon fa-flag">
									<h3>Tortor Ut</h3>
									<p>Augue consectetur sed interdum imperdiet et ipsum. Mauris lorem tincidunt nullam amet leo Aenean ligula consequat consequat.</p>
								</li>
							</ul>
						</div>
					</section> */}

				{/* <!-- CTA --> */}
					<section id="cta" className="wrapper style4">
						<div className="inner">
							<header>
								<h2>Arcue ut vel commodo</h2>
								<p>Aliquam ut ex ut augue consectetur interdum endrerit imperdiet amet eleifend fringilla.</p>
							</header>
							<ul className="actions stacked">
								<li>
									<button
										className="button fit primary"
										onClick={() => signIn('google', { callbackUrl: '/projects' })}
									>{session ? 'Open Projects' : 'Sign In'}</button>
								</li>
								<li><a href="#" className="button fit">Learn More</a></li>
							</ul>
						</div>
					</section>

				{/* <!-- Footer --> */}
					<footer id="footer">
						<ul className="icons">
							<li><a href="#" className="icon brands fa-twitter"><span className="label">Twitter</span></a></li>
							<li><a href="#" className="icon brands fa-facebook-f"><span className="label">Facebook</span></a></li>
							<li><a href="#" className="icon brands fa-instagram"><span className="label">Instagram</span></a></li>
							<li><a href="#" className="icon brands fa-dribbble"><span className="label">Dribbble</span></a></li>
							<li><a href="#" className="icon solid fa-envelope"><span className="label">Email</span></a></li>
						</ul>
						<ul className="copyright">
							<li>&copy; Untitled</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
						</ul>
					</footer>

			</div>
            <Script
                src="/js/jquery.min.js"
                strategy="beforeInteractive"
                onLoad={() =>
                    console.log(`script loaded: /js/jquery.min.js`)
                }
            />
            <Script
                src="/js/browser.min.js"
                strategy="beforeInteractive"
                onLoad={() =>
                    console.log(`script loaded: /js/browser.min.js`)
                }
            />
			<Script
                src="/js/breakpoints.min.js"
                strategy="beforeInteractive"
                onLoad={() =>
                    console.log(`script loaded: /js/breakpoints.min.js`)
                }
            />
			<Script
                src="/js/jquery.scrollex.min.js"
                strategy="beforeInteractive"
                onLoad={() =>
                    console.log(`script loaded: /js/jquery.scrollex.min.js`)
                }
            />
			<Script
                src="/js/jquery.scrolly.min.js"
                strategy="beforeInteractive"
                onLoad={() =>
                    console.log(`script loaded: /js/jquery.scrolly.min.js`)
                }
            />
			<Script
                src="/js/util.js"
                strategy="lazyOnload"
                onLoad={() =>
                    console.log(`script loaded: /js/util.js`)
                }
            />
			<Script
                src="/js/main.js"
                strategy="lazyOnload"
                onLoad={() =>
                    console.log(`script loaded: /js/main.js`)
                }
            />
	</div>
  )
}
