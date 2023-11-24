// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CPFOracleInterface.sol";
import "./CPFOracleClientInterface.sol";

// Contrato do Oracle
contract OracleSerpro is CPFOracleInterface{
    address owner;
    uint256 counturl;
    struct RespostaCPF {
        uint256 cpf;
        string data;
        address endereco;
    } 
    mapping(bytes32 => RespostaCPF) public responseData; // Armazena os dados recebidos
    mapping(bytes32 => uint8) public queries;
    mapping(address => bool) public authorized;

    event CPFProvided(uint256 cpf, string situacao);

    constructor() {
        owner = msg.sender;
        authorized[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Sender is not authorized");
        _;
    }


    // Função para fazer uma solicitação ao Oracle
    function consultaCPF(uint256 _cpf, address _endereco) external payable  {
        require(msg.value >= 5 wei, "Favor pagar 5 wei- OracleSerpro");
        bytes32 queryId = keccak256(abi.encodePacked(_cpf));
        queries[queryId] = 1;
	    responseData[queryId].cpf = _cpf;
        responseData[queryId].endereco = _endereco;
        emit RequestCPF(msg.sender, queryId, _cpf);
    }

    // Função que simula a resposta do Oracle
    function provideCPF(bytes32 _queryId, string memory _data) external onlyAuthorized {
        require(queries[_queryId]>0, "Query ID not found");
        responseData[_queryId].data = _data; // Armazena os dados recebidos
        // Limpe a marcação da query
        queries[_queryId] = 2;
        emit CPFProvided(responseData[_queryId].cpf, _data);
	    CPFOracleClientInterface(responseData[_queryId].endereco)._cpfCallback(responseData[_queryId].cpf, _data);
    }
    

    // Função para obter os dados recebidos por uma solicitação
    function retornoCPF(uint256 _cpf) external view returns (string memory) {
        require(queries[keccak256(abi.encodePacked(_cpf))]==2 , "Waiting situacao");        
        return responseData[keccak256(abi.encodePacked(_cpf))].data;
    }



}
