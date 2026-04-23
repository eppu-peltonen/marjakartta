package config

import "os"

type Config struct {
	DBSource      string
	ServerAddress string
	JWTSecret     string
}

func Load() Config {
	return Config{
		DBSource:      getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/marjakartta?sslmode=disable"),
		ServerAddress: getEnv("SERVER_ADDRESS", ":3000"),
		JWTSecret:     getEnv("JWT_SECRET", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
