import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';

class TokenController {
    
    generateToken(payload, sessionId) {
        return jwt.sign({ ...payload, sessionId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    }

    validateToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return null;
        }
    }
    
    generateSessionId() {
        return uuidv4();
    }
}

export default new TokenController();
