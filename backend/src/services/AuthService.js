import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';

const SALT_ROUNDS = 10;

export default class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  register(payload) {
    const { name, email, password } = payload;
    if (!name || !email || !password) {
      throw new Error('Name, email and password are required');
    }

    const existing = this.userRepository.getByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
    const user = this.userRepository.create({ name, email, passwordHash, role: 'customer' });
    return user;
  }

  login(payload) {
    const { email, password } = payload;
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = this.userRepository.getByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userID: user.userID, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'mtr_secret',
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        userID: user.userID,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  getProfile(userID) {
    const user = this.userRepository.getById(userID);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  updateProfile(userID, payload) {
    const existing = this.userRepository.getById(userID);
    if (!existing) {
      throw new Error('User not found');
    }

    const name = payload.name || existing.name;
    const email = payload.email || existing.email;
    if (email !== existing.email) {
      const inUse = this.userRepository.getByEmail(email);
      if (inUse && inUse.userID !== userID) {
        throw new Error('Email already in use');
      }
    }

    const updated = this.userRepository.update(userID, { name, email });
    return updated;
  }

  updatePassword(userID, payload) {
    const { currentPassword, newPassword } = payload;
    if (!currentPassword || !newPassword) {
      throw new Error('Current and new password are required');
    }

    const fullUser = this.userRepository.getByEmail(this.userRepository.getById(userID).email);
    const matches = bcrypt.compareSync(currentPassword, fullUser.passwordHash);
    if (!matches) {
      throw new Error('Current password is incorrect');
    }

    const passwordHash = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    this.userRepository.updatePassword(userID, passwordHash);
    return true;
  }
}
