const { ethers } = require('hardhat');
const axios = require('axios');

const YOUR_LOCAL_NODE_URL = 'http://localhost:8545'; // URL do seu nó Ethereum local

const CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "cpf",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "situacao",
				"type": "string"
			}
		],
		"name": "CPFProvided",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "requester",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "queryId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "cpf",
				"type": "uint256"
			}
		],
		"name": "RequestCPF",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "authorized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_cpf",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_endereco",
				"type": "address"
			}
		],
		"name": "consultaCPF",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_queryId",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "_data",
				"type": "string"
			}
		],
		"name": "provideCPF",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "queries",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "responseData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "cpf",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "data",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "endereco",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_cpf",
				"type": "uint256"
			}
		],
		"name": "retornoCPF",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const CONTRACT_ADDRESS = '0xAE519FC2Ba8e6fFE6473195c092bF1BAe986ff90'; // Endereço do seu contrato
const PRIVATE_KEY = '0x1111111111111111111111111111111111111111111111111111111111111111';

async function listenToEvents() {
    const provider = new ethers.JsonRpcProvider(YOUR_LOCAL_NODE_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
	console.log(contract);


    // Escuta o evento 'NewMessage' emitido pelo contrato
    contract.on('RequestCPF', async (requester, queryId, cpf) => {
        console.log('Novo evento NewRequest recebido:');
        console.log('Requester:', requester);
        console.log('QueryId:', queryId);
        console.log('URL:', cpf);
		const cpfCompleto = cpf.toString().padStart(11, '0');
		const URL = `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df-trial/v1/cpf/${cpfCompleto}`;
  		const config = {
    		headers: {
      			'accept': 'application/json',
      			'Authorization': 'Bearer 06aef429-a981-3ec5-a1f8-71d38d86481e'
    		}
  		};
		let situacao;
		 try {
			const response = await axios.get(URL, config);
			const jsonData = response.data;    			
			situacao = jsonData.situacao.descricao;
			console.log('Data:', situacao);			
		} catch (error) {
			situacao = "Erro";
			console.error('Erro ao buscar dados:', error);
		}
		const tx = await contract.provideCPF(queryId, situacao);
        await tx.wait();
		console.log(queryId);
        console.log('Dados enviados para o contrato Ethereum.' + queryId);
    });

    

    contract.on('*', (event) => {
        console.log('Novo evento recebido:');
        console.log('Nome do evento:', event.event);
        console.log('Argumentos:', event.args);
    });
}

listenToEvents();
