# Executar o Exemplo1


## Instalar pacotes
```
npm install
```

## Configurar o serviço
criar arquivo .env com o seguinte conteúdo : 

```
ETHEREUM_NETWORK = "hardhat"
REST_HOST = "localhost"
REST_HOST_DB = "http://127.0.0.1:3002"
REST_PORT = 3002
SIGNER_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ADDRESS_BC = "http://127.0.0.1:8545"
```

## Configurar o DID do Smart contract
editar o src/config.js 

```
const CONTACT_ADDRESS = 'Identificado do contrato';
```

## Executar serviço
```
npm start
```
