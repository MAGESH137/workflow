pipeline {
    agent any

    environment {
        // Fix PATH issues for macOS Jenkins
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
        DOCKER = "/usr/local/bin/docker"

        // Docker images
        DOCKERHUB_USER = "magesh1307"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/workflow-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/workflow-frontend"
        TAG = "${BUILD_NUMBER}"

        // EC2 details
        EC2_USER = "ec2-user"
        EC2_HOST = "52.66.239.186"
        EC2_KEY  = "/Users/apple/Downloads/pipeline.pem"

    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images (Local)') {
            steps {
                sh """
                ${DOCKER} build -t ${BACKEND_IMAGE}:${TAG} backend
                ${DOCKER} build -t ${FRONTEND_IMAGE}:${TAG} frontend
                """
            }
        }

        stage('Save Docker Images') {
            steps {
                sh """
                ${DOCKER} save ${BACKEND_IMAGE}:${TAG} -o backend.tar
                ${DOCKER} save ${FRONTEND_IMAGE}:${TAG} -o frontend.tar
                """
            }
        }

        stage('Copy Images to EC2') {
            steps {
                sh """
                scp -i ${EC2_KEY} -o StrictHostKeyChecking=no backend.tar ${EC2_USER}@${EC2_HOST}:/home/ec2-user/
                scp -i ${EC2_KEY} -o StrictHostKeyChecking=no frontend.tar ${EC2_USER}@${EC2_HOST}:/home/ec2-user/
                """
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh """
                ssh -i ${EC2_KEY} -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                  docker load -i backend.tar
                  docker load -i frontend.tar

                  docker rm -f workflow-backend || true
                  docker rm -f workflow-frontend || true

                  docker run -d \
                    --name workflow-backend \
                    -p 5000:5000 \
                    ${BACKEND_IMAGE}:${TAG}

                  docker run -d \
                    --name workflow-frontend \
                    -p 80:80 \
                    ${FRONTEND_IMAGE}:${TAG}
                '
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully on EC2"
        }
        failure {
            echo "❌ Deployment failed"
        }
    }
}
