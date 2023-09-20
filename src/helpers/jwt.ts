import jwt from "jsonwebtoken";
import settings from "../constants/settings";

class JWT {
  private readonly decodeSecret = async (): Promise<string> => {
    const secret = await Buffer.from(
      settings.accessTokenSecret,
      "base64"
    ).toString("ascii");

    return secret;
  };

  public signJWT = async (userId: string): Promise<string> => {
    const token = await jwt.sign({ userId }, await this.decodeSecret(), {
      expiresIn: "1y",
    });

    return token;
  };
}

const JWTHelper = new JWT();

export default JWTHelper;
