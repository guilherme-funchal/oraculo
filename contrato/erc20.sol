// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CPFOracleInterface.sol";
import "./CPFOracleClientInterface.sol";

contract Serpro is ERC20, Ownable, CPFOracleClientInterface {
    CPFOracleInterface cpfOracle;
    mapping(uint256 => string) private situacao;

    constructor(address initialOwner, address _cpfOracle)
        ERC20("Serpro", "SRP")
        Ownable(initialOwner) {
        cpfOracle = CPFOracleInterface(_cpfOracle);
	_mint(address(this), 100000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transferirValor(address from, address to, uint256 value, uint256 _cpf) public onlyOwner  {
	    require(keccak256(abi.encodePacked(situacao[_cpf])) == keccak256(abi.encodePacked("Regular")), "CPF ainda nao foi validado");	
        _transfer(from, to, value);
    }

    function _cpfCallback(uint256 _cpf, string memory _situacao) public {
        require(address(cpfOracle) == msg.sender, "Nao foi o Oraculo CPF que retornou a resposta.");
        situacao[_cpf] = _situacao;
    }

    function enviaCPF(uint256 _cpf) external payable {
        require(msg.value >= 10 wei, "Favor pagar 10 wei");
	situacao[_cpf] = "Aguardando";
        cpfOracle.consultaCPF{value: 5 wei}(_cpf, address(this));
    }


    function getSituacao(uint256 _cpf) public view returns (string memory) {       
        return situacao[_cpf];
    }



}
