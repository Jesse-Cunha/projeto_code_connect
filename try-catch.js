try {
    // Código que pode gerar erro
    console.log(minhaFuncao());
  } catch (erro) {
    // O que fazer se um erro ocorrer
    console.log("Um erro ocorreu: ", erro.message);
  }