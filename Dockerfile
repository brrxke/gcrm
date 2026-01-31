FROM python:3.11-slim

WORKDIR /app

# Установите зависимости системы
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Копируйте requirements
COPY requirements.txt .

# Установите Python зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируйте код приложения
COPY . .

# Создайте папку для uploads
RUN mkdir -p uploads/profiles

# Откройте порт
EXPOSE 5000

# Запустите приложение
CMD ["python", "app.py"]