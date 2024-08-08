import {
	FusionSDK,
	NetworkEnum,
	PrivateKeyProviderConnector,
} from "@1inch/fusion-sdk";
import Web3 from "web3";
import fetch from "node-fetch"; // Make sure to install node-fetch: npm install node-fetch

const makerPrivateKey = "0x123....";
const makerAddress = "0x123....";

const nodeUrl = "....";

const blockchainProvider = new PrivateKeyProviderConnector(
	makerPrivateKey,
	new Web3(nodeUrl)
);

let tokenData: any = {};

async function fetchTokenData() {
	try {
		const response = await fetch(
			"https://raw.githubusercontent.com/MetaMask/contract-metadata/master/contract-map.json"
		);
		tokenData = await response.json();
	} catch (error) {
		console.error("Error fetching token data:", error);
	}
}

function getTokenAddressByName(tokenName: string): string | null {
	for (const address in tokenData) {
		if (tokenData[address].name.toLowerCase() === tokenName.toLowerCase()) {
			return address;
		}
	}
	return null;
}

const sdk = new FusionSDK({
	url: "https://api.1inch.dev/fusion",
	network: 1,
	blockchainProvider,
	authKey: process.env.SWAP_AUTH_KEY,
});

export async function placeOrder(
	exTokenName: string,
	reqTokenName: string,
	amt: string,
	address: string
) {
	const fromTokenAddress = getTokenAddressByName(exTokenName);
	const toTokenAddress = getTokenAddressByName(reqTokenName);

	if (!fromTokenAddress || !toTokenAddress) {
		throw new Error("Invalid token names provided.");
	}

	return sdk.placeOrder({
		fromTokenAddress,
		toTokenAddress,
		amount: amt,
		walletAddress: address,
	});
}

// Fetch token data on module initialization
fetchTokenData().catch(console.error);
