module.exports = {
    apps: [
        {
            name: "ToGetThereAPI",
            script: "npm run start",
            watch: false,
            env: {
                "JWT_SECRET": "votre-super-secret-jwt-tres-securise-changez-moi-en-production",
                "JWT_EXPIRES_IN": "24h",
                "JWT_REMEMBER_EXPIRES_IN": "7d",
                "DATABASE_PATH": "./database.sqlite",
                "NODE_ENV": "development",
                "PORT": 3000
            },
        }
    ]
}