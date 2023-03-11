# Smart Trigger - Blockchain Listener CLI
## Install and Run
- install dependancies
```
make environment
```
or
```
npm install
```
Designed to run as script, install ts-node typescript interpreter globally
```
npm install -g ts-node
```
and set the file to be executable
```
chmod +x projectRoot/app/smartTrigger.ts
```
then run script directly via path to smartTrigger.ts script
```
projectRoot/app/smartTrigger.ts
```
or install as global script

## Usage
basic usage includes 3 commands/modes:
  - listen (default)
  - fetch
  - push

All options on commands provide default values, and if no command is given the 
script runs the listen command by default.

recommended usage is to continuously run the app as a service in the 'listen' 
mode for live processing, and intermittenly (daily?) run the app in the 'fetch' 
mode followed by the 'push' mode in case any events were missed by the service
due to restarts or provider downtime. Intermittent runs can be performed via a
cronjob.
### listen
listen continuously monitors the blockchain for OracleRequest events. When an 
event is emitted, it is processed and the decoded cbor data, saved to disk
in the data directory. The data is then also pushed to the pizza oven's
Order API.

can be kept alive as a service/daemon using pm2
```
npm install -g pm2
pm2 start path/to/smartTrigger.ts
```
pm2 will restart the application if it dies, or if the system is rebooted.

### fetch
fetch returns all OracleRequest events (filtered by pendingRequests), decodes
their cbor data, and saves them to disk in the projectRoot/output 
directory. Naming format is tokenId.json where the tokenId is the id of the pizza box
being minted against. Latest block visited is stored to avoid unnecessary re-processing
of events.

### push
pushes json file/s stored in the output directory to the pizza oven's Order API

For more details on usage and options, use the --help option