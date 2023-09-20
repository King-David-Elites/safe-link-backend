import { Query } from "mongoose";
import { IToken, ITokenTypes } from "../interfaces/models/user.interface";
import Token from "../models/user.token.model";
import { NotFoundError } from "../constants/errors";

const createToken = async (body: Partial<IToken>): Promise<IToken> => {
  const { email, type } = body;

  const token = await Token.create({ email, type });

  return token;
};

const updateToken = async (query: Object, token: string): Promise<IToken> => {
  const tokenInDb = await Token.findOneAndUpdate(query, { value: token });

  if (!tokenInDb) {
    throw new NotFoundError("token does not exist");
  }

  return tokenInDb;
};

const getToken = async (query: Object): Promise<IToken> => {
  const token = await Token.findOne(query);

  if (!token) {
    throw new NotFoundError("Token does not exist");
  }

  return token;
};

const deleteToken = async (query: Object) => {
  await Token.findOneAndDelete(query);
};

const tokenService = {
  createToken,
  updateToken,
  getToken,
  deleteToken,
};

export default tokenService;
