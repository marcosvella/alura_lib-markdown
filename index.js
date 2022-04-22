const chalk = require("chalk");
const fs = require("fs");

function extraiLinks(texto) {
  const regex = /\[([^\]]*)\]\((https?:\/\/[^$#\s].[^\s]*)\)/gm;
  const arrayResultado = [];

  let temp;
  while ((temp = regex.exec(texto)) !== null) {
    arrayResultado.push({ [temp[1]]: temp[2] });
  }

  return arrayResultado.length == 0 ? "Não há links" : arrayResultado;
}

function trataErro(erro) {
  throw new Error(chalk.red(erro.code, "Deu ruim"));
}

function pegaArquivo(caminhoDoArquivo) {
  try {
    const encoding = "utf-8";
    let texto = fs.readFileSync(caminhoDoArquivo, encoding).toString();
    return extraiLinks(texto);
  } catch (err) {
    trataErro(err);
  }
}

module.exports = pegaArquivo;
