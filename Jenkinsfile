pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git branch: 'master', credentialsId: 'Github-Credentials', url: 'https://github.com/miguelpmx7004/melate-microservicio.git'
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
