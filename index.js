import chalk from "chalk";
import { readFileSync } from "fs";

function extraiLinks(texto) {
  const regex = /\[([^\]]*)\]\((https?:\/\/[^$#\s].[^\s]*)\)/gm;
  const arrayResultado = [];

  let temp;
  while ((temp = regex.exec(texto)) !== null) {
    arrayResultado.push({ [temp[1]]: temp[2] });
  }

  console.log(arrayResultado);
}

function trataErro(erro) {
  throw new Error(chalk.red(erro.code, "Deu ruim"));
}

function pegaArquivo(caminhoDoArquivo) {
  try {
    const encoding = "utf-8";
    let texto = readFileSync(caminhoDoArquivo, encoding).toString();
    extraiLinks(texto);
  } catch (err) {
    trataErro(err);
  }
}

pegaArquivo("./arquivos/texto1.md");
