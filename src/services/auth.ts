import bcript from "bcryptjs";

export const criptografarSenha = async (senha: string) => {
  return bcript.hash(senha, 8);
};

export const checarSenha = async (senha: string, hash: string) => {
  return bcript.compare(senha, hash);
};
