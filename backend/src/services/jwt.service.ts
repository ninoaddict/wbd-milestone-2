import { SECRET_KEY } from "../config";
import Unauthorized from "../errors/unauthorized.error";
const crypto = require("crypto");

export class JwtService {
  private key: string;
  private alg;

  constructor() {
    this.key = SECRET_KEY || "secret";
    this.alg = { alg: "HS256", typ: "JWT" };
  }

  private encodeBase64(str: string): string {
    return Buffer.from(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  private decodeBase64(str: string): string {
    const paddedStr = str.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(paddedStr, "base64").toString("utf-8");
  }

  private stringify(obj: any): string {
    return JSON.stringify(obj);
  }

  private checkSumGen(head: string, body: string): string {
    const checkSumStr = head + "." + body;
    const hash = crypto.createHmac("sha256", this.key);
    const checkSum = hash
      .update(checkSumStr)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return checkSum;
  }

  public encode(obj: any): string {
    let result = "";
    const header = this.encodeBase64(this.stringify(this.alg));
    result += header + ".";
    const body = this.encodeBase64(this.stringify(obj));
    result += body + ".";
    const checkSum = this.checkSumGen(header, body);
    result += checkSum;

    return result;
  }

  public decode(str: string) {
    const jwtArr = str.split(".");

    if (jwtArr.length !== 3) {
      throw new Error("Invalid token structure");
    }

    const head = jwtArr[0];
    const body = jwtArr[1];
    const hash = jwtArr[2];
    const checkSum = this.checkSumGen(head, body);

    if (hash === checkSum) {
      const res = JSON.parse(this.decodeBase64(body));
      return res;
    } else {
      throw new Unauthorized("Token signature verification failed");
    }
  }
}

export const jwtService = new JwtService();
