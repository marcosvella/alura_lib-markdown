const fetch = require("node-fetch");

async function checaStatus(arrayURLs) {
  try {
    const arrayStatus = await Promise.all(
      arrayURLs.map(async (url) => {
        const res = await fetch(url);
        return res.status;
      })
    );
    return arrayStatus;
  } catch (err) {
    manejaErros(err);
  }
}

async function validaURLs(arrayLinks) {
  const links = geraArrayDeURLs(arrayLinks);
  const statusLinks = await checaStatus(links);

  const resultados = arrayLinks.map((objeto, index) => ({
    ...objeto,
    status: statusLinks[index],
  }));
  return resultados;
}

function geraArrayDeURLs(arrayLinks) {
  return arrayLinks.map((objetoLink) => Object.values(objetoLink).join());
}

function manejaErros(erro) {
  throw new Error(erro.message);
}

module.exports = validaURLs;
