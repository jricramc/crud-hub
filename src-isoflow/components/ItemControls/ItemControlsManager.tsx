import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';
import { IconSelection } from '@/src-isoflow/components/ItemControls/IconSelection/IconSelection';
import { UiElement } from '../UiElement/UiElement';
import { NodeControls } from './NodeControls/NodeControls';
import { ConnectorControls } from './ConnectorControls/ConnectorControls';
import { RectangleControls } from './RectangleControls/RectangleControls';
import { blue } from '@mui/material/colors';
import { Button } from '@/isoflow/components/ui/button';

export const ItemControlsManager = () => {

  const [email, setEmail] = useState('');
  const [expanded, setExpanded] = useState(false);

  const itemControls = useUiStateStore((state) => {
    return state.itemControls;
  });
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
  // @ts-ignore
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
  // @ts-ignore
  const handleEmailChange = (e) => {
		setEmail(e.target.value);
	}
  // @ts-ignore
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

  const theme = useTheme();

  const Controls = useMemo(() => {
    switch (itemControls?.type) {
      case 'NODE':
        return <NodeControls key={itemControls.id} id={itemControls.id} />;
      case 'CONNECTOR':
        return <ConnectorControls key={itemControls.id} id={itemControls.id} />;
      case 'RECTANGLE':
        return <RectangleControls key={itemControls.id} id={itemControls.id} />;
      case 'ADD_ITEM':
        return <IconSelection />;
      default:
        return null;
    }
  }, [itemControls]);

  const topOffset = useMemo(() => {
    return theme.customVars.appPadding.y * 2 + parseInt(theme.spacing(2), 10);
  }, [theme]);

  const [load, setLoad] = useState(false);


  const content = {
    default: {
      header: 'Your Portal to the WebHub Playground 🧩',
      description: 'Welcome to a space designed for the seamless development and deployment of your next groundbreaking application.'
    },
    'my-api': {
      header: 'Nexus: Your API Control Center 🎛️',
      description: 'Nexus is your hub for API management, where you build and orchestrate all your endpoints. This is where innovation takes flight.'
    },
    'data-storage': {
      header: 'Data storage: build a simple and secure database 🗝️',
      description: 'Access data storage solutions provided by industry leaders. Security and reliability are our foremost priorities.',
      actions: [
        {
          text: 'Learn More',
          onClick: () => setExpanded(true),
          variant: 'primary',
        }
      ],
    },
    'card-terminal': {
      header: 'Commerce Gateway: Streamline Transactions 💳',
      description: 'Integrate modern payment solutions to transform the way you do business, making transactions a breeze for you and your customers.'
    },
    'authentication': {
      header: 'Identity Management: Secure Access 🛡️',
      description: 'Manage user authentication with precision and reliability, ensuring secure and streamlined user experiences.'
    },
    'client-endpoints': {
      header: 'Endpoint Bridge: Seamlessly Connect 🌉',
      description: 'Utilize our step-by-step tutorials to link your API to the user interface, enabling a cohesive and intuitive user experience.'
    },
    'websockets': {
      header: 'Real-Time connection: Engage Dynamically ⚡',
      description: 'Leverage the capabilities of websockets for instantaneous communication, enhancing user engagement in real-time.'
    },
    'aws-lambdas': {
      header: 'Lambda Functions: Execute with Precision 🧪',
      description: 'Run your essential business logic and integrate third-party services through AWS Lambdas, optimizing efficiency and scalability.'
    },
  };
  
  // @ts-ignore
  const cnt = content[itemControls?.id] ? content[itemControls?.id] : content.default;


  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 7500)
  }, [])

  // @ts-ignore
  const card = ({ content, sx = {} }) => <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '10px 5px',
      marginBottom: 15,
      borderRadius: 10,
      ...sx,
    }}>
    {content}
  </div>

  return (
    <UiElement
      sx={{
        transition: 'all 0.5s',
        top: expanded ? 0 : topOffset,
        ...(expanded ? { left: 0 } : {}),
        minHeight: expanded ? '100vh' : `calc(100% - ${
          topOffset + theme.customVars.appPadding.y
        }px)`,
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        width: expanded ? '100vw' : '500px',
        opacity: load ? 1 : 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* {Controls} */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '30px 30px', flex: 1 }}>
        {card({
          content: <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }}>
              {cnt.header}
            </div>
            <div style={{ fontSize: 16, fontWeight: 'normal' }}>
              {cnt.description}
            </div>
            {cnt.actions?.length > 0 && cnt.actions.map(({ text = '', onClick = () => {} }) => <Button key="id-1234" onClick={onClick}>{text}</Button> )}
          </div>,
          sx: {
            // background: 'rgba(0, 0, 0, 0.2)',
            // height: 200,
            marginBottom: 20
          },
        })}
        {card({
  content: (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={
          {flex:1}
        } />
      <div style={{ fontSize: 16, fontWeight: 'bold', opacity: 0.8 }}>
        More information and functionality coming soon!
      </div>
      
        <div style={
          {flex:1}
        } />
      
      <div style={{ marginBottom: '10px', fontSize: 20, fontWeight: 'bold' }}>
          Request Early Access
        </div>
     
<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
  <form onSubmit={handleEmailSubmission}>
    <input
      type="email"
      value={email}
      onChange={handleEmailChange}
      placeholder="Enter your email"
      required
      style={{
        padding: '12px 12px',
        color: 'blue',
        fontSize: '14px',
        borderRadius: '4px',
        border: '2px solid #007bff', // Design from the bottom form
        background: '#f9f9f9', // Design from the bottom form
        marginRight: '10px',
        marginBottom:'20px',
        flex: 1,
        maxWidth: '250px'
      }}
    />
    <button 
      type="submit" 
      style={{
        background: '#007bff',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Request
    </button>
  </form>
</div>
</div>
  ),
  sx: {
    background: 'rgba(0, 0, 0, 0.2)',
    flex: 1,
    marginBottom: 0,
    position: 'relative'  // Makes sure the 'bottom' styling in the child div works
  },
})}


      </div>
    </UiElement>
  );
};
