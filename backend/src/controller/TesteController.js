const CONTACT_ABI = require('./../config');
const CONTACT_ADDRESS = require('./../config');
const Web3 = require('web3');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const jsonFileList = './user-list.json'
const fs = require('fs');
const jsonFile = './data.json'

require("dotenv").config();

async function esperaRetornoRegular(web3, signer, cpfValue) {
    const contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

    // Enviar o CPF para o contrato antes de iniciar o loop
    try {
        const tx = contratoInteligente.methods.enviaCPF(cpfValue); // Ajuste o valor do CPF a ser enviado
        console.log(tx);
        await tx.send({
            from: signer.address,
            value: 10, // Valor de 10 wei
            gas: 300000,
            gasPrice:0
        });
        console.log("CPF enviado com sucesso para o contrato.");
    } catch (error) {
        console.error("Erro ao enviar o CPF para o contrato:", error);
        throw error; // Propagar o erro para tratamento externo, se necessário
    }

    // Aguardar até que o retorno seja "Regular"
    while (true) {
        try {
            const retorno = await contratoInteligente.methods.getSituacao(cpfValue).call(); // Chamada à função correta
            if (retorno != "Aguardando") {
                console.log("Retorno recebido:", retorno);
                break; // Sai do loop se o retorno for "Regular"
            } else {
                console.log("Aguardando retorno...");
            }
        } catch (error) {
            console.error("Erro ao obter o retorno:", error);
            throw error; // Propagar o erro para tratamento externo, se necessário
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo antes de verificar novamente
    }

}


module.exports = {

    async saldo(req, res) {
        try {
            let conta = req.params.conta;
            console.log(conta);
            var web3 = new Web3(process.env.ADDRESS_BC);
            console.log(CONTACT_ADDRESS.CONTACT_ADDRESS);

            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
            let saldo = await contratoInteligente.methods.balanceOf(conta).call(function (err, res) {
                if (err) {
                    console.log("Ocorreu um erro", err)
                    return
                }
                console.log("Saldo gerado com Sucesso")
            });
            saldo = Web3.utils.fromWei(saldo, 'ether');
            res.status(200).send(JSON.stringify(saldo));
            console.log(saldo);
        } catch (e) {
            saldo = 0;
            res.status(400).send("Usuário não encontrado");
            console.error("Usuário não encontrado");
        }
    },

    async transacoes(req, res) {
        try {
            var web3 = new Web3(process.env.ADDRESS_BC);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
            contratoInteligente.getPastEvents(
                "allEvents",
                { fromBlock: 0, toBlock: 'latest' },
                (err, events) => {
                    res.status(200).send(events);
                }
            );
        } catch (e) {
            console.error(e)
        }
    },
    async carimbo(req, res) {
        try {
            let bloco = req.body.block;
            var web3 = new Web3(process.env.ADDRESS_BC);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
            let block = await web3.eth.getBlock(bloco);
            let timestamp = block.timestamp;
            console.log(timestamp);
            var date = new Date(timestamp * 1000);
            res.status(200).send(`${timestamp}`);
          } catch (e) {
            console.error(e)
          }
    },
    async account(req, res) {
        try {
            const user_id = req.body.user_id
            console.log(user_id);
            var result = [];
            const jsonData = fs.readFileSync(jsonFile)
            const userList = JSON.parse(jsonData)

            for (var i = 0; i < userList.length; i++) {
                if (userList[i]["user_id"] == user_id) {
                    result.push(userList[i]);
                }
            }

            // res.send(account)
            res.status(200).send(JSON.stringify(userList));

        } catch (e) {
            console.error(e)
        }
    },    
    async cunhar(req, res) {
        try {
            let to = req.body.to;
            let amount = req.body.amount;
            amount = Web3.utils.toWei(amount, 'ether');
            console.log(to);
            console.log(amount);

            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    `${process.env.ADDRESS_BC}`
                )
            );
            const signer = web3.eth.accounts.privateKeyToAccount(
                process.env.SIGNER_PRIVATE_KEY
            );
            web3.eth.accounts.wallet.add(signer);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

            const tx = contratoInteligente.methods.mint(to, amount);
            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados enviados com sucesso ...`);
                });
            console.log(`Dados incluídos no bloco ${receipt.blockNumber}`);
            // res.status(200).send(`Moeda incluída e minerada no bloco ${receipt.blockNumber}`);

            res.status(200).json({
                txhash: receipt.transactionHash,
                block: receipt.blockNumber
            });
        } catch (e) {
            console.error(e)
        }
    },
    async accountlist(req, res) {
        try {
            const user_id = req.params.user_id
            var result = [];
            const jsonData = fs.readFileSync(jsonFile)
            const userList = JSON.parse(jsonData)

            // for (var i = 0; i < userList.length; i++) {
            //     if (userList[i]["user_id"] == user_id) {
            //         result.push(userList[i]);
            //     }
            // }

            // res.send(account)
            res.status(200).send(JSON.stringify(userList));

        } catch (e) {
            console.error(e)
        }
    },
    async depositar(req, res) {
        try {
            let to = req.body.to;
            let amount = req.body.amount;
            amount = Web3.utils.toWei(amount, 'ether');
            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    `${process.env.ADDRESS_BC}`
                )
            );
            const signer = web3.eth.accounts.privateKeyToAccount(
                process.env.SIGNER_PRIVATE_KEY
            );
            web3.eth.accounts.wallet.add(signer);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

            const tx = contratoInteligente.methods.mint(to, amount);
            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados enviados com sucesso ...`);
                });
            console.log(`Dados incluídos no bloco ${receipt.blockNumber}`);
            // res.status(200).send(`Moeda incluída e minerada no bloco ${receipt.blockNumber}`);

            res.status(200).json({
                txhash: receipt.transactionHash,
                block: receipt.blockNumber
            });
        } catch (e) {
            console.error(e)
        }
    },
    async sacar(req, res) {
        try {
            let to = req.body.to;
            let value = req.body.value;

            value = Web3.utils.toWei(value, 'ether');

            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    `${process.env.ADDRESS_BC}`
                )
            );
            const signer = web3.eth.accounts.privateKeyToAccount(
                process.env.SIGNER_PRIVATE_KEY
            );
            web3.eth.accounts.wallet.add(signer);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

            const tx = contratoInteligente.methods.sacar(to, value);

            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados enviados com sucesso ...`);
                });
            console.log(`Dados incluídos no bloco ${receipt.blockNumber}`);
            // res.status(200).send(`Moeda incluída e minerada no bloco ${receipt.blockNumber}`);

            res.status(200).json({
                txhash: receipt.transactionHash,
                block: receipt.blockNumber
            });
        } catch (e) {
            console.error(e)
        }
    },
    async transferir(req, res) {
        try {
            let to = req.body.to;
            let from = req.body.from;
            let value = req.body.value;
            let cpf = req.body.cpf;
            value = Web3.utils.toWei(value, 'ether');

            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    `${process.env.ADDRESS_BC}`
                )
            );
            const signer = web3.eth.accounts.privateKeyToAccount(
                process.env.SIGNER_PRIVATE_KEY
            );
            web3.eth.accounts.wallet.add(signer);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);                        
            await esperaRetornoRegular(web3, signer, cpf);
            const tx = contratoInteligente.methods.transferirValor(from, to, value, cpf);
            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados enviados com sucesso ...`);
                });
            console.log(`Dados incluídos no bloco ${receipt.blockNumber}`);
            // res.status(200).send(`Moeda incluída e minerada no bloco ${receipt.blockNumber}`);

            res.status(200).json({
                txhash: receipt.transactionHash,
                block: receipt.blockNumber
            });
        } catch (e) {
            console.error(e);
            res.status(400).send("Erro ao transferir");
            
        }
    }
    
}
