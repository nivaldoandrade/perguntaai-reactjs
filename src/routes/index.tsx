import { Switch, Route } from 'react-router-dom';


import Home from "../pages/Home";
import CreateRooms from "../pages/CreateRooms";
import Rooms from "../pages/Rooms";
import AdminRooms from "../pages/AdminRooms";

export default function Routes() {
	return (
		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/rooms/news" component={CreateRooms} />
			<Route path="/rooms/:id" component={Rooms} />
			<Route path="/adminrooms/:id" component={AdminRooms} />
		</Switch>
	);
}
