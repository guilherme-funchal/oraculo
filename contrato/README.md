# Executar o ExemploOracle


## Ajustar HardHat para ter chaves privadas.
ajustar o arquivo hardhat.config.js no diretório onde está instalado o HARDHAT: 

```
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: '0x1111111111111111111111111111111111111111111111111111111111111111',
          balance: '1000000000000000000000', // 1000 ETH
        },
        {
          privateKey: '0x2222222222222222222222222222222222222222222222222222222222222222',
          balance: '2000000000000000000000', // 2000 ETH
        },
        {
          privateKey: '0x3333333333333333333333333333333333333333333333333333333333333333',
          balance: '3000000000000000000000', // 3000 ETH
        },
        {
          privateKey: '0x4444444444444444444444444444444444444444444444444444444444444444',
          balance: '4000000000000000000000', // 4000 ETH
        },
        // Mais contas podem ser adicionadas aqui
      ],
    },
  }
};
```
rodar hardhat: 
(acertar versai do node local caso necessário ex:nvm use v21.1.0) 

```
npx hardhat node
 
```

## Rodar Remix Client local
no diretorio ./contrato:

```
remixd 
```

## Entrar no Remix
```
https://remix.ethereum.org/
ajustar worksapce para localhost (connect to localhost)
Implantar OracleSerpro.sol (Enviremont DEV - HardHat Provider)
Implantar o VendaLoja.sol passando o endereco do OracleSerpro.sol como parametro no Deploy

```


## Rodar scipt node local
```
cd ./contrato/scripts/
ajustar o CONTRACT_ADDRESS para o endereço que foi publicado o contrato.
node oracleSerpro.js

