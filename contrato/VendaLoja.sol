// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./CPFOracleInterface.sol";
import "./CPFOracleClientInterface.sol";

contract VendaLoja is CPFOracleClientInterface {
    CPFOracleInterface cpfOracle;

    mapping(uint256 => string) private situacao;

    constructor(address _cpfOracle) {
        cpfOracle = CPFOracleInterface(_cpfOracle);
    }

    function _cpfCallback(uint256 _cpf, string memory _situacao) public {
        require(address(cpfOracle) == msg.sender, "Nao foi o Oraculo CPF que retornou a resposta.");
        situacao[_cpf] = _situacao;
    }

    function enviaCPF(uint256 _cpf) external payable {
        require(msg.value >= 6 wei, "Favor pagar 6 wei");
        cpfOracle.consultaCPF{value: 5 wei}(_cpf, address(this));

    }

    function getSituacao(uint256 _cpf) public view returns (string memory) {       
        return situacao[_cpf];
    }
}
