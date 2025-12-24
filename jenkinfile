pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = 'Sreeshma@143'
        DOCKERHUB_USER  = 'magesh1307'

        BACKEND_IMAGE  = "${DOCKERHUB_USER}/workflow-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/workflow-frontend"

        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t ${BACKEND_IMAGE}:${TAG} backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t ${FRONTEND_IMAGE}:${TAG} frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry(
                        'https://index.docker.io/v1/',
                        DOCKERHUB_CREDS
                    ) {
                        docker.image("${BACKEND_IMAGE}:${TAG}").push()
                        docker.image("${FRONTEND_IMAGE}:${TAG}").push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker pull ${BACKEND_IMAGE}:${TAG}
                docker pull ${FRONTEND_IMAGE}:${TAG}

                docker rm -f backend || true
                docker rm -f frontend || true

                docker run -d \
                  --name backend \
                  -p 5000:5000 \
                  --env-file backend/.env \
                  ${BACKEND_IMAGE}:${TAG}

                docker run -d \
                  --name frontend \
                  -p 80:80 \
                  ${FRONTEND_IMAGE}:${TAG}
                '''
            }
        }
    }
}
