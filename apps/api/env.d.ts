declare namespace NodeJS {
  interface ProcessEnv {
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
    USER_EMAIL: string;
    APP_PASSWORD: string;
    JWT_SECRET: string;
    JWT_EXPIRES: string;
  }
}
