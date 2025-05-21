pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git branch: 'master', credentialsId: 'github-credentials', url: 'https://github.com/miguelpmx7004/melate-microservice.git'
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build' // o 'tsc' si usas TypeScript directamente
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm test' // si tienes pruebas configuradas
      }
    }
  }
}
