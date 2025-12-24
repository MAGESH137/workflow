pipeline {
    agent any

    environment {
        // Explicit PATH so Jenkins can find docker & docker-credential-desktop
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

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
                bat """
                echo "Using PATH: \$PATH"
                ${DOCKER} build -t ${BACKEND_IMAGE}:${TAG} backend
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat """
                ${DOCKER} build -t ${FRONTEND_IMAGE}:${TAG} frontend
                """
            }
        }

        stage('Run Containers (Local)') {
            steps {
                bat """
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
            echo "✅ Docker build and run completed successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
