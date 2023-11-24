// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface CPFOracleInterface {
    event RequestCPF(address indexed requester, bytes32 indexed queryId, uint256 cpf);
    function consultaCPF(uint256 _cpf, address endereco) external payable ;
    function provideCPF(bytes32 _queryId, string memory _data) external; 
}
