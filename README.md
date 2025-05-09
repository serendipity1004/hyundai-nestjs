# IAM 권한 생성하기

1. IAM 사용자 생성하기
  - AWS IAM접속 > 사용자 추가
  - 권한 추가
    - AdministratorAccess-AWSElasticBeanstalk
    - AmazonS3FullAccess
    - AmazonEC2FullAccess
  - 유저 선택 후 키 생성하기
    - Create Access Key
    - Application running outside AWS 선택
    - Done 누르고 저장

2. EB EC2 Admin Role 생성하기
  - AWS Service 선택
  - EC2 선택하기
  - Admin Access 추가하기

# Supabase 생성하기
1. Seoul에 생성하기
    1. 데이터베이스 비밀번호 확보해두기
2. Connection String 가져오기
3. ORM으로 가서 connection string 저장하기
4. 데이터베이스 설정으로 돌아와서 Connection URL 추가해주기
    1. type은 남기고 나머지는 comment
    2. url 추가
      ```typescript
      TypeOrmModule.forRoot({
        url: 'URL 여기에 붙여넣기',
        type: 'postgres',
        // host: 'localhost',
        // port: 3001,
        // username: 'postgres',
        // password: 'postgres',
        // database: 'postgres',
        entities: [
          PostEntity,
          UserEntity,
          UserProfileEntity,
          PostCommentEntity,
          TagEntity,
        ],
        synchronize: true,
      }),
      ```
    3. 연결 된 다음 migration 진행된거 확인 (Supabase Dashboard에서 Table 누르면 생성된 테이블 확인 가능)


# Elastic Beanstalk 애플리케이션 생성
## Step 1
1. Web Server Environment 선택
2. Application 이름 nestjs test
3. Platform → nodeJS
4. Sample Application
5. Single Instance (Free Tier Eligible)
6. Next

## Step 2
1. EB Role 자동 생성
2. EC2 Role은 [IAM]섹션 2번에서 생성한 Role 넣어주기
3. Next

# Step 3
1. VPC 아무거나 선택 (CIDR 172로 시작하는거 있으면 선택)
2. Next

# Step 4
1. Default Security Group 선택

# Step 5
1. 기본세팅으로 Next 누르기

# GitHub 환경변수 등록
1. Settings > Secrets and Variables > Actions > New Repository Secret
2. 등록할 변수 아래와 같음
AWS_ACCESS_KEY_ID : IAM에서 발급받은 키
AWS_SECRET_ACCESS_KEY : IAM에서 발급받은 시크릿
AWS_REGION : ap-northeast-2
EB_APP_NAME : Elastic Beanstalk 이름
EB_ENV_NAME : Elastic Beanstalk 환경 이름
S3_BUCKET_NAME : EB 생성 시 자동 생성된 S3 버켓 이름


# NestJS 수정하기
1. .gitignore에 무시할 파일 추가 (postgres-data등)
2. GitHub Action 파이프라인 생성하기
  - .github/workflows/deploy.yml 생성
  ```yaml
  name: Deploy to Elastic Beanstalk

  on:
    # 메인브란치에 푸쉬할때 실행
    push:
      branches:
        - main

  jobs:
    deploy:
      # ubuntu 환경에서 파이프라인 실행
      runs-on: ubuntu-latest

      steps:
        # 최신 소스 체크아웃
        - name: Checkout source code
          uses: actions/checkout@v3

        # nodeJS 설치
        - name: Set up Node.js
          uses: actions/setup-node@v4
          with:
            node-version: 18

        # pnpm 글로벌 설치
        - name: Install pnpm
          run: npm install -g pnpm

        # 의존성 설치
        - name: Install dependencies
          run: pnpm install

        # 빌드
        - name: Build NestJS app
          run: pnpm run build

        # 배포시 필요한 소스 전부 패키징
        - name: Zip deployment package
          run: |
            zip -r deploy.zip dist/ node_modules/ package.json Procfile

        # AWS 크레덴셜 등록
        - name: Configure AWS credentials
          uses: aws-actions/configure-aws-credentials@v2
          with:
            aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
            aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            aws-region: ${{ secrets.AWS_REGION }}

        # S3에 빌드한 프로젝트 업로드
        - name: Upload to S3
          run: |
            aws s3 cp deploy.zip s3://${{ secrets.S3_BUCKET_NAME }}/deploy-${{ github.sha }}.zip

        # EB 새 버전 생성
        - name: Create new application version
          run: |
            aws elasticbeanstalk create-application-version \
              --application-name ${{ secrets.EB_APP_NAME }} \
              --version-label "ver-${{ github.sha }}" \
              --source-bundle S3Bucket=${{ secrets.S3_BUCKET_NAME }},S3Key=deploy-${{ github.sha }}.zip

        # 환경 업데이트
        - name: Deploy new version to Elastic Beanstalk
          run: |
            aws elasticbeanstalk update-environment \
              --environment-name ${{ secrets.EB_ENV_NAME }} \
              --version-label "ver-${{ github.sha }}"
  ```

  3. Procfile 생성
  ```shell
  web: npm run start:prod
  ```

# 스케일링 테스트해보기

Environment > Configuration > min instance를 1에서 2로 올려보기
(EC2 탭으로 가보면 인스턴스 두개 생성된거 확인 가능)