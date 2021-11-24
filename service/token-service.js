import JWT from "jsonwebtoken";
import tokenModel from "../models/token-model.js";

class TokenService {
    generateAccessToken(id,isBanned, roles){
        const payload = {
            id,
            isBanned,
            roles

        }
        const accessToken = JWT.sign(payload, process.env.JWT_SECRET, {expiresIn: "24h"})
        const refreshToken = JWT.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "24h"})
        return {accessToken, refreshToken}
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await tokenModel.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken) {
        return tokenModel.deleteOne({refreshToken});
    }
}

export default new TokenService();