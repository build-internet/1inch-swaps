import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { placeOrder } from "../src/index";

const app = express();

app.use(bodyParser.json());

app.post("/test", async (req: Request, res: Response) => {
	try {
		const { exTokenName, reqTokenName, address, amount } = req.body;

		if (!exTokenName || !reqTokenName) {
			return res.status(400).send("exTokenName and reqTokenName are required");
		}

		const order = await placeOrder(exTokenName, reqTokenName, amount, address);
		res.json(order);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.get("/test", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Example app listening on port 3000!");
});
