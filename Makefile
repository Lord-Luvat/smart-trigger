environment:
	npm install

start:
	npx ts-node app/smartTrigger.ts

start-listen:
	npx ts-node app/smartTrigger.ts listen

start-fetch:
	npx ts-node app/smartTrigger.ts fetch

start-push:
	npx ts-node app/smartTrigger.ts push

format:
	npm run lint
