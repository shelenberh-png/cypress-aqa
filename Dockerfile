# Використовуємо офіційний образ Cypress певної старішої версії (наприклад, 13.6.0)
FROM cypress/included:13.6.0

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо package.json та встановлюємо залежності
COPY package.json .
RUN npm install

# Копіюємо решту проекту
COPY . .