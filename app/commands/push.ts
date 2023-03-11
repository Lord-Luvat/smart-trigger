import fs from 'fs';
import path from 'path';
import axios, { AxiosResponse } from 'axios';

export interface OrderData {
	bridge: string;
	address: string;
	requestor: string;
	token_id: number;
	recipe_id: number;
}

export const postOrder = async (
	baseUrl: string,
	apiVersion: string,
	orderData: OrderData
): Promise<AxiosResponse> => {
	const endpoint = `${baseUrl}/api/${apiVersion}/orders`;
	try {
		console.log(
			`Posting order to ${endpoint} for token_id ${orderData.token_id}...`
		);
		const response = await axios.post(endpoint, orderData);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export interface PushOptions {
	baseUrl: string;
	apiVersion: string;
	tokenId?: number;
}

// Take the decoded oracle requests data saved to file
// and post them to the OrderAPI
export const pushRequests = async ({
	baseUrl,
	apiVersion,
	tokenId,
}: PushOptions) => {
	// Set the API configuration

	const outputDir = `${path
		.dirname(process.argv[1])
		.split('/')
		.slice(0, -1)
		.join('/')}/output`;

	// Print the script usage
	console.log(`Using API URL: ${baseUrl}`);
	console.log(`Using API version: ${apiVersion}`);

	console.log(`Parsing requests from ${outputDir}...`);

	// Read the requests from file
	// If a tokenId is provided, only read that request
	// Otherwise, read all the requests
	const requests: OrderData[] = [];
	// zero is a valid tokenId, so we need to check for undefined
	if (typeof tokenId !== 'undefined') {
		const data = fs.readFileSync(`${outputDir}/${tokenId}.json`, 'utf8');
		const request = JSON.parse(data);
		requests.push(request);
	} else {
		fs.readdirSync(outputDir).map((file) => {
			const data = fs.readFileSync(`${outputDir}/${file}`, 'utf8');
			const request = JSON.parse(data);
			requests.push(request);
		});
	}
	for (const request of requests) {
		const orderData: OrderData = {
			bridge: 'orderpizzav1',
			address: request.address,
			requestor: request.requestor,
			token_id: request.token_id,
			recipe_id: request.recipe_id,
		};
		const response = await postOrder(baseUrl, apiVersion, orderData);
		console.log(response);
	}
};

export default pushRequests;
