package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBSource      string
	ServerAddress string
	JWTSecret     string
}

func Load() Config {
	godotenv.Load()

	return Config{
		DBSource:      getEnv("DATABASE_URL", "marjakartta.db"),
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
