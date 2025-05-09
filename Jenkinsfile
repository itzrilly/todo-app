pipeline {
  agent any
  
  environment {
    DOCKER_REGISTRY = 'your-registry'
    KUBE_CONFIG = credentials('kubeconfig')
  }
  
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/itzrilly/todo-app.git'
      }
    }
    
    stage('Test Backend') {
      steps {
        dir('server') {
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
    
    stage('Test Frontend') {
      steps {
        dir('client') {
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
    
    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('sonarqube') {
          sh 'sonar-scanner'
        }
      }
    }
    
    stage('Build Docker Images') {
      steps {
        script {
          docker.build("${DOCKER_REGISTRY}/todo-backend:${env.BUILD_ID}", './server')
          docker.build("${DOCKER_REGISTRY}/todo-frontend:${env.BUILD_ID}", './client')
        }
      }
    }
    
    stage('Push Docker Images') {
      steps {
        script {
          docker.withRegistry('https://${DOCKER_REGISTRY}', 'docker-creds') {
            docker.image("${DOCKER_REGISTRY}/todo-backend:${env.BUILD_ID}").push()
            docker.image("${DOCKER_REGISTRY}/todo-frontend:${env.BUILD_ID}").push()
          }
        }
      }
    }
    
    stage('Deploy to Kubernetes') {
      steps {
        sh "kubectl apply -f k8s/ --kubeconfig=${KUBE_CONFIG}"
      }
    }
  }
  
  post {
    always {
      cleanWs()
    }
    success {
      slackSend(color: 'good', message: "Build ${env.BUILD_ID} succeeded!")
    }
    failure {
      slackSend(color: 'danger', message: "Build ${env.BUILD_ID} failed!")
    }
  }
}