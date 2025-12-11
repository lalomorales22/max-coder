import { UserProfile, GameProject, LogEntry, TypingResult } from '../types';

const DB_NAME = 'CodeCaptainDB';
const DB_VERSION = 2; // Incremented for new stores

export class StorageService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error("Database error: ", event);
        reject("Database error");
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Users table
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('username', 'username', { unique: false });
        }
        
        // Games table
        if (!db.objectStoreNames.contains('games')) {
          const gameStore = db.createObjectStore('games', { keyPath: 'id' });
          gameStore.createIndex('userId', 'userId', { unique: false });
        }
        
        // Logs table
        if (!db.objectStoreNames.contains('logs')) {
          db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
        }

        // Typing Results table
        if (!db.objectStoreNames.contains('typing_results')) {
          const typeStore = db.createObjectStore('typing_results', { keyPath: 'id' });
          typeStore.createIndex('userId', 'userId', { unique: false });
        }
      };
    });
  }

  async loginUser(username: string): Promise<UserProfile> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const index = store.index('username');
      const request = index.get(username);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          // Create new user
          const newUser: UserProfile = {
            id: crypto.randomUUID(),
            username: username,
            xp: 0,
            stars: 0,
            level: 1,
            createdAt: Date.now()
          };
          store.put(newUser);
          resolve(newUser);
        }
      };
      request.onerror = () => reject("Error logging in");
    });
  }

  async saveUser(user: UserProfile): Promise<void> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.put(user);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject("Error saving user");
    });
  }

  async saveGame(game: GameProject): Promise<void> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['games'], 'readwrite');
      const store = transaction.objectStore('games');
      const request = store.put(game);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject("Error saving game");
    });
  }

  async getAllGames(userId?: string): Promise<GameProject[]> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['games'], 'readonly');
        const store = transaction.objectStore('games');
        
        let request;
        if (userId) {
            const index = store.index('userId');
            request = index.getAll(userId);
        } else {
            request = store.getAll();
        }

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject("Error fetching games");
    });
  }

  async saveTypingResult(result: TypingResult): Promise<void> {
      if (!this.db) await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['typing_results'], 'readwrite');
        const store = transaction.objectStore('typing_results');
        store.add(result);
        requestAnimationFrame(() => resolve());
      });
  }

  async logAction(action: string, details: string): Promise<void> {
    if (!this.db) await this.initDB();
    const entry: Omit<LogEntry, 'id'> = {
      action,
      details,
      timestamp: Date.now()
    };
    
    const transaction = this.db!.transaction(['logs'], 'readwrite');
    const store = transaction.objectStore('logs');
    store.add(entry);
  }
}

export const storageService = new StorageService();