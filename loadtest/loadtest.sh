
endpoint="ws://localhost:2567"
room="game"
numClients=2000

npx colyseus-loadtest example.ts --room $room --numClients $numClients --endpoint $endpoint
# yq eval '.bob.*.cats' sample.yaml