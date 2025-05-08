# NodeJS 18 버전 사용하기
FROM node:18

# Working Directory 설정하기
WORKDIR /usr/src/app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 나머지 파일/폴더 전부 복사
COPY . .

# 포트 열기
EXPOSE 3000

# 커맨드 실행하기
CMD ["npm", "run", "start:dev"]