import express from 'express';
import { createServer } from 'http';
import { Sequelize } from 'sequelize-typescript';
import { Server as IoServer } from 'socket.io';
import AppResources from './AppRessources';
import { Constant } from './constant/Constant';
import V1GazEmission from './dm-durablinator/entities/V1GazEmission';
import V2WaterConsumption from './dm-durablinator/entities/V2WaterConsumption';
import V3WasteProduction from './dm-durablinator/entities/V3WasteProduction';
import V4HealthSecurityWorkCondition from './dm-durablinator/entities/V4HealthSecurityWorkCondition';
import V5BioacumulationToxicity from './dm-durablinator/entities/V5BioacumulationToxicity';
import V6InclusionAndDiversity from './dm-durablinator/entities/V6InclusionAndDiversity';
import IndexDMDurable from './dm-durablinator/entities/IndexDMDurable';

class Server {
	public app = express();
	public httpServer = createServer(this.app)
	public io = new IoServer(this.httpServer, {})
	private readonly db = Constant.POSTGRES_DB!
	private readonly user = Constant.POSTGRES_USER!
	private readonly pwd = Constant.POSTGRES_PASSWORD!
	private readonly host = Constant.POSTGRES_HOST!
	private readonly port = Number(Constant.POSTGRES_PORT!)
	public sequelize = new Sequelize(this.db, this.user, this.pwd, {
		host: this.host,
		port: this.port,
		dialect: "postgres",
		dialectOptions: {},
		models: [V1GazEmission, V2WaterConsumption, V3WasteProduction, V4HealthSecurityWorkCondition, V5BioacumulationToxicity, V6InclusionAndDiversity, IndexDMDurable],
		logging: false
	})

	public router = new AppResources().router;
}
const endpoint = "/api"
const server = new Server();
//Handle body content
server.app.use(express.json())
server.app.use(express.urlencoded({ extended: true }))

//Apply resources into the server instance 
server.app.use(endpoint, server.router)

const checkBddConnection = async () => {
	try {
		//Check connection 
		await server.sequelize.authenticate()

		// Sync all models
		await server.sequelize.sync({ alter: true })

	} catch (err) {
		console.log("Error of Sequelize connection : ", err)
	}
}

//Connection
checkBddConnection();

// make server listen on some port
((port = 3000) => {
	server.httpServer.listen(port, () => console.log("OK launched"));
})();

export { server }
