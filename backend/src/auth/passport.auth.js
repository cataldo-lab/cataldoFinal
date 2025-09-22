// backend/src/auth/passport.auth.js
"use strict";
import passport from "passport";
import User from "../entity/personas/user.entity.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { AppDataSource } from "../config/configDb.js";

const options = {
  // Extraer JWT desde cookies en lugar del header Authorization
  jwtFromRequest: ExtractJwt.fromExtractors([
    // Primero intenta desde cookie
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      return token;
    },
    // Como fallback, también permite desde header (útil para testing)
    ExtractJwt.fromAuthHeaderAsBearerToken()
  ]),
  secretOrKey: ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          email: jwt_payload.email,
        },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }),
);

export function passportJwtSetup() {
  passport.initialize();
}