pipeline {
    agent any

    environment {
        // PATH fix for macOS Jenkins
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
        DOCKER = "/usr/local/bin/docker"

        DOCKERHUB_USER = "magesh1307"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/workflow-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/workflow-frontend"

        TAG = "${BUILD_NUMBER}"

        EC2_HOST = "52-66-239-186"   // 🔴 CHANGE THIS
        EC2_USER = "ec2-user"
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

        stage('Save Images') {
            steps {
                sh """
                ${DOCKER} save ${BACKEND_IMAGE}:${TAG} -o backend.tar
                ${DOCKER} save ${FRONTEND_IMAGE}:${TAG} -o frontend.tar
                """
            }
        }

        stage('Copy Images to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    scp -o StrictHostKeyChecking=no backend.tar ${EC2_USER}@${EC2_HOST}:/home/ec2-user/
                    scp -o StrictHostKeyChecking=no frontend.tar ${EC2_USER}@${EC2_HOST}:/home/ec2-user/
                    """
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
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
    }

    post {
        success {
            echo "✅ Deployed successfully to EC2"
        }
        failure {
            echo "❌ Deployment failed"
        }
    }
}
