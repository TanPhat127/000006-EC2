# Base image: Node.js 20 (đủ mới, tránh cảnh báo EBADENGINE như bản EC2 gặp)
FROM node:20-alpine

# Cài PM2 global ngay trong image — không còn lỗi "pm2: command not found"
RUN npm install -g pm2

WORKDIR /opt/app

# Copy package.json trước để tận dụng Docker cache layer khi build lại
COPY package*.json ./
RUN npm install --omit=dev

# Copy toàn bộ source code còn lại
COPY . .

EXPOSE 5000

# Dùng pm2-runtime thay vì pm2 thường — pm2-runtime chạy ở foreground,
# đúng chuẩn để làm PID 1 trong container (không thoát ngay sau khi start)
CMD ["pm2-runtime", "start", "app.js"]
