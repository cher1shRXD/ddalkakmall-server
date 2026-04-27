import { FastifyInstance } from "fastify";
import * as userService from "../user/user.service.js";
import * as authRepository from "./auth.repository.js";
import { User } from "../user/user.entity.js";

const ACCESS_TTL = "1h";
const REFRESH_TTL = "7d";

interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export async function fetchGoogleProfile(
  accessToken: string,
): Promise<GoogleProfile> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Google profile");
  return res.json() as Promise<GoogleProfile>;
}

function issueTokenPair(app: FastifyInstance, user: User): TokenPair {
  const accessToken = app.jwt.sign(
    { userId: user.id, email: user.email },
    { expiresIn: ACCESS_TTL },
  );
  const refreshToken = app.jwt.sign(
    { userId: user.id, type: "refresh" },
    { expiresIn: REFRESH_TTL },
  );
  return { accessToken, refreshToken };
}

export async function handleGoogleCallback(
  app: FastifyInstance,
  profile: GoogleProfile,
): Promise<{ tokens: TokenPair; user: User }> {
  const user = await userService.findOrCreate({
    provider: "google",
    providerId: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
  });

  const tokens = issueTokenPair(app, user);
  await authRepository.saveRefreshToken(user.id, tokens.refreshToken);

  return { tokens, user };
}

export async function rotateTokens(
  app: FastifyInstance,
  refreshToken: string,
): Promise<TokenPair> {
  const payload = app.jwt.verify<{ userId: string; type: string }>(
    refreshToken,
  );
  if (payload.type !== "refresh") throw new Error("Invalid token type");

  const userId = await authRepository.resolveRefreshToken(refreshToken);
  if (!userId) throw new Error("Refresh token revoked or expired");

  const user = await userService.getById(userId);
  if (!user) throw new Error("User not found");

  await authRepository.deleteRefreshToken(refreshToken);
  const tokens = issueTokenPair(app, user);
  await authRepository.saveRefreshToken(user.id, tokens.refreshToken);

  return tokens;
}

export async function logout(refreshToken: string): Promise<void> {
  await authRepository.deleteRefreshToken(refreshToken);
}
