pipeline {
    agent any

    environment {
        DOCKER = "docker"   // docker.exe must be in PATH

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

        stage('Check Docker') {
            steps {
                bat 'docker version'
            }
        }

        stage('Build Backend Image') {
            steps {
                bat """
                %DOCKER% build -t %BACKEND_IMAGE%:%TAG% backend
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat """
                %DOCKER% build -t %FRONTEND_IMAGE%:%TAG% frontend
                """
            }
        }

        stage('Run Containers (Local)') {
            steps {
                bat """
                %DOCKER% rm -f workflow-backend || echo container not found
                %DOCKER% rm -f workflow-frontend || echo container not found

                %DOCKER% run -d ^
                  --name workflow-backend ^
                  -p 5000:5000 ^
                  %BACKEND_IMAGE%:%TAG%

                %DOCKER% run -d ^
                  --name workflow-frontend ^
                  -p 80:80 ^
                  %FRONTEND_IMAGE%:%TAG%
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
