import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret"; // should be a env variable

const JWT_AUTH_EXP = process.env.JWT_AUTH_EXP || "1y";

function encodedSecret() {
    return new TextEncoder().encode(JWT_SECRET);
}

export async function signJWT(payload) {

    const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(JWT_AUTH_EXP)
    .sign(encodedSecret())
    
    return token;
}

// Verify JWT-token
/*
export function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}*/
export async function verifyJWT(token) {

  const verified = await jose.jwtVerify(
      token,
      encodedSecret()
  )
  
  return verified.payload
}