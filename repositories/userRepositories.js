const fs = require('fs');
const path = require('path');

const usersPath = path.resolve(__dirname, '..', 'users.json');

function readUsersFile() {
    const raw = fs.readFileSync(usersPath, 'utf8');
    const { users = [] } = JSON.parse(raw || '{}');
    return users;
  
}

function writeUsersFile(users) {
  const payload = JSON.stringify({ users }, null, 2);
  fs.writeFileSync(usersPath, payload, 'utf8');
}

// --- Entity ---
class User {
  constructor({ username, name, email, role, createdAt, updatedAt }) {
    this.username  = username;
    this.name      = name;
    this.email     = email;
    this.role      = role;
    this.createdAt = createdAt ?? new Date().toISOString();
    this.updatedAt = updatedAt ?? new Date().toISOString();
  }

  static findAll() {
    return readUsersFile().map((u) => new User(u));
  }

  static findByUsername(username) {
    const uname = String(username || '').toLowerCase();
    const data = readUsersFile().find(
      (u) => String(u.username || '').toLowerCase() === uname
    );
    return data ? new User(data) : null;
  }

  static existsUsernameOrEmail(data) {
    const uname = String(data.username || '').toLowerCase();
    const mail  = String(data.email || '').toLowerCase();
    return readUsersFile().some(
      (u) =>
        String(u.username || '').toLowerCase() === uname ||
        String(u.email || '').toLowerCase() === mail
    );
  }

  static createUser({ username, name, email, role }) {
    const users = readUsersFile();
    const now  = new Date().toISOString();
    const user = new User({
      username: String(username).trim(),
      name: String(name).trim(),
      email: String(email).trim(),
      role: String(role).trim(),
      createdAt: now,
      updatedAt: now,
    });
    writeUsersFile([...users, user]);
    return user;
  }
}

module.exports = { User };
