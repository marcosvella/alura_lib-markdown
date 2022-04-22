const pegaArquivo = require("../index.js");

const arrayResult = [
  {
    Google: "https://google.com.br",
  },
  {
    Facebook: "https://facebook.com",
  },
];

describe("pegaArquivo::", () => {
  it("deve ser uma função", () => {
    expect(typeof pegaArquivo).toBe("function");
  });

  it("deve retornar array com resultados", async () => {
    const resultado = await pegaArquivo(
      "/home/marcosvella/Documents/Github/alura_lib-markdown/test/arquivos/texto1.md"
    );
    expect(resultado).toEqual(arrayResult);
  });

  it('Deve retornar mensagem "Não há links"', () => {
    expect(
      pegaArquivo(
        "/home/marcosvella/Documents/Github/alura_lib-markdown/test/arquivos/texto1_sem-links.md"
      )
    ).toBe("Não há links");
  });
});
