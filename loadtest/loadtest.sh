
endpoint="ws://localhost:2567"
room="game"
numClients=1

npx colyseus-loadtest loadtest.ts --room $room --numClients $numClients --endpoint $endpoint
# yq eval '.bob.*.cats' sample.yaml