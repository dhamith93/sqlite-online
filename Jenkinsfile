pipeline {
    agent any

    stages {
      stage('build and test') {
        steps {
          sh 'npm ci'
          sh "npm run test:ci:record"
        }
      }
    }

    post {
        always {
            junit 'results/cypress-report.xml'
        }
    }  
}
