import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useSession, signIn, signOut } from 'next-auth/react';

import '../src/app/assets/css/main.css';
// import '../src/app/assets/css/noscript.css';

export default function Home() {

	const { data: session } = useSession();
	const [preload, setPreload] = useState(true);
	const [email, setEmail] = useState('');


	console.log('session: ', session)
	const sendEmail = async ({ subject = '', content = '', email = '' }) => {
		try {
			const response = await fetch('https://ga33n2aqc3.execute-api.us-east-2.amazonaws.com/prod/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ subject, content, email }),
			});
			
			const body = await response.json();
			console.log('body: ', body);
		} catch (err) {
			console.log('err: ', err);
		}
	};

	const saveEmail = async (email) => {
		try {
			const response = await fetch('https://94e7dq31vc.execute-api.us-east-2.amazonaws.com/default/LandingPage', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email }),
			});
	
			// Check for successful response
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
	
			const data = await response.json();
			console.log(data);
	
		} catch (error) {
			console.error('There was a problem sending the email:', error);
		}
	}
	
	// Usage:
	
	
		

	


	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	}

	const handleEmailSubmission = (e) => {
		e.preventDefault();
		console.log("Email submitted for early access:", email);

		const email1 = {
			subject: "Welcome to WebHub 🚀 - Your Journey Begins Here!",
			content: `
				<h1>Welcome to WebHub!</h1>
				
				<p>Hey there,</p>
		
				<p>We're absolutely thrilled to have you onboard. 🎉 You're among the select few who have taken the first step into the future of the web with WebHub!</p>
		
				<p>Here's a sneak peek of what's in store for you:</p>
		
				<ul>
					<li>🛠 Cutting-edge tools to supercharge your applications.</li>
					<li>🌐 A seamless low-code app development experience like never before.</li>
					<li>🤝 A community of pioneers passionate about the future of web development.</li>
				</ul>
		
				<p>But that's just the tip of the iceberg. We're working day and night to bring even more features and improvements to make your WebHub experience truly exceptional.</p>
		
				<p>While you wait, we'd love for you to join our <a href="https://discord.gg/8mY5BRv8">community forums</a> and be part of the discussions. Share your thoughts, insights, or even just a hello! We value your feedback and insights as they help shape WebHub's future.</p>
		
				<p>Stay tuned for more updates. The best is yet to come!</p>
		
				<br>
				<p>Happy exploring,</p>
				<p><strong>The WebHub Team</strong></p>
		
				<p><small>P.S. Got questions? Feel free to <a href="mailto:webhubhq@gmail.com">reach out to us</a>. We're always here to help!</small></p>
			`,
			email: email
		}
		

		sendEmail(email1)
		saveEmail(email)
		// TODO: Send the email to your backend or third-party service
		setEmail(''); // Reset the email input field
	}
	

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
						<h1><a href="#">WebHub</a></h1>
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
		<h2>WebHub</h2>
		<p>Build your backend in minutes<br /> manage it effortlessly</p>
		<ul className="actions special">
			<li>
				<button
					className="button primary"
					onClick={() => signIn('google', { callbackUrl: '/projects' })}
				>{session ? 'Open Projects' : 'Sign In'}</button>
			</li>
			<li>
				<a href="https://webhub.mintlify.app/quickstart" className="button" target="_blank" rel="noopener noreferrer">Documentation</a> {/* Adjust the href as per your routing */}
			</li>
			<li>
				<a href="mailto:webhubhq@gmail.com" className="button" target="_blank" rel="noopener noreferrer">Contact Us</a>
			</li>
		</ul>
		<ul className="early access">
			<h3>Get Early Access</h3>
		</ul>
        <form onSubmit={handleEmailSubmission}>
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
				style={{ padding: '10px', width: '100%', maxWidth: '400px', display: 'block', margin: '0 auto', marginBottom: '60px'}}
            />
            <button type="submit">Submit</button>
        </form>
	</div>
	<a href="#one" className="more scrolly">Learn More</a>
</section>
{/* 
<section className="email-submission-section">
    <div className="inner">
        <h2>Get Early Access</h2>
        <form onSubmit={handleEmailSubmission}>
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
            />
            <button type="submit">Submit</button>
        </form>
	
    </div>
</section> */}



				{/* <!-- One --> */}
					<section id="one" className="wrapper style1 special">
						<div className="inner">
							<header className="major">
								<h2>
                                {/* Build and manage fully functional hosted APIs for free Powered by AWS */}
								Prototype and test your ideas by using your<br />  webhub API
                                </h2>
								<p>WebHub offers web developers an <span style={{ textDecoration: 'underline' }}>online sandbox</span> to develop, test, and deploy backend resources with zero code required. As a creator you are able to leverage the power of our <span style={{ textDecoration: 'underline' }}>out of the box integrations</span> with AWS services like DynamoDB, API Gateway, and Lambda to create dynamic and complex APIs effortlessly.  </p>
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
								<p>Our application uses industry standard frameworks to deploy AWS infrastructure in seconds and orchastrate them through a simple REST API. Allowing you to focus on designing a high level backend architecture.</p>
							</div>
						</section>
						<section className="spotlight">
							<div className="image"><img src="images/pic02.jpg" alt="" /></div><div className="content">
								<h2>Automatic Documentation<br />
								and data management out of the box</h2>
								<p>All data passing through a WebHub API endpoint is compressed and summarized into a secure ledger that records your API data story. This serves as a <span style={{ textDecoration: 'underline' }}>single source of truth</span> from which we dynamically build your backend's documentation from.</p>
							</div>
						</section>
						<section className="spotlight">
							<div className="image"><img src="images/pic03.jpg" alt="" /></div><div className="content">
								<h2>Free Hosting and access<br />
								to expensive third party services</h2>
								<p>WebHub builds developers an online sandbox to access enterprise level AWS services with no strings attached.</p>
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
								<h2>Get Started</h2>
								<p>Its time to stop wasting time, resources, and money and onboard on to the best backend development stack on the market today!</p>
							</header>
							<ul className="actions stacked">
								<li>
									<button
										className="button fit primary"
										onClick={() => signIn('google', { callbackUrl: '/projects' })}
									>{session ? 'Open Projects' : 'Sign In'}</button>
								</li>
								{/* <li><a href="#" className="button fit">Learn More</a></li> */}
							</ul>
						</div>
					</section>


				{/* <!-- Discord Section --> */}
					<section className="discord-section">
						<div className="inner"
						style={{ padding: '0px', width: '100%', maxWidth: '400px', display: 'block', margin: '0 auto', marginBottom: '10px', marginLeft: '775px'}}>
							<a href="https://discord.gg/8mY5BRv8" target="_blank" rel="noopener noreferrer">
								<i className="icon brands fa-discord"></i>
								Join the Community
							</a>
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
							<li>&copy; WEBHUB</li><li>MIT Affiliated</li>
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
