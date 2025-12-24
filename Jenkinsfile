pipeline {
    agent any

    environment {
        DOCKER = "/usr/local/bin/docker"

        DOCKERHUB_USER = "magesh1307"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/workflow-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/workflow-frontend"

        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh """
                ${DOCKER} build \
                  -t ${BACKEND_IMAGE}:${TAG} \
                  backend
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh """
                ${DOCKER} build \
                  -t ${FRONTEND_IMAGE}:${TAG} \
                  frontend
                """
            }
        }

        stage('Run Containers (Local)') {
            steps {
                sh """
                ${DOCKER} rm -f workflow-backend || true
                ${DOCKER} rm -f workflow-frontend || true

                ${DOCKER} run -d \
                  --name workflow-backend \
                  -p 5000:5000 \
                  ${BACKEND_IMAGE}:${TAG}

                ${DOCKER} run -d \
                  --name workflow-frontend \
                  -p 80:80 \
                  ${FRONTEND_IMAGE}:${TAG}
                """
            }
        }
    }

    post {
        success {
            echo "✅ Docker images built and containers started successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
