import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContextProvider } from './hooks/useAuth';

import Routes from './routes';

import './styles/global.scss';

function App() {
	return (
		<BrowserRouter>
			<AuthContextProvider>
				<Routes />
				<ToastContainer />
			</AuthContextProvider>
		</BrowserRouter>
	);
}

export default App;
