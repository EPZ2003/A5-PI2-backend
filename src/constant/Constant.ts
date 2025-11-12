import dotenv from "dotenv"

dotenv.config()
export class Constant {
	public static readonly POSTGRES_USER =	process.env.POSTGRES_USER
	public static readonly POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
	public static readonly POSTGRES_DB =	process.env.POSTGRES_DB
	public static readonly POSTGRES_HOST =	process.env.POSTGRES_HOST
	public static readonly POSTGRES_PORT =	process.env.POSTGRES_PORT
	public static readonly PREFIX_TABLE =	process.env.PREFIX_TABLE
	public static readonly REST_URL =	process.env.REST_URL
}
