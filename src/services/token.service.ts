import { Query } from "mongoose";
import { IToken, ITokenTypes } from "../interfaces/models/user.interface";
import Token from "../models/user.token.model";
import { NotFoundError } from "../constants/errors";
import { randomBytes } from "crypto";

const createToken = async (body: Partial<IToken>): Promise<IToken> => {
  body = {
    email: body.email,
    type: body.type,
  };

  // use crypto bytes for reset password
  if (body.type === ITokenTypes.passwordResetToken) {
    body.value = randomBytes(32).toString("hex");
  }

  const token = await Token.create(body);

  return token;
};

const updateToken = async (query: Object, token: string): Promise<IToken> => {
  const tokenInDb = await Token.findOneAndUpdate(query, { value: token });

  if (!tokenInDb) {
    throw new NotFoundError("token does not exist");
  }

  return tokenInDb;
};

const getToken = async (query: Object): Promise<IToken | null> => {
  const token = await Token.findOne(query);

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
