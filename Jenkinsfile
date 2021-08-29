pipeline {
    environment {
        registry = 'dhamith93/sqlite-online'
        dockerImage = '' 
    }
    
    agent any

    stages {
        stage('build and test') {
            steps {
                sh 'npm ci'
                sh 'npm run test:ci'
            }
        }
      
        stage('bilding docker image') { 
            steps { 
                script { 
                    dockerImage = docker.build registry + ":$BUILD_NUMBER" 
                }
            }
        }
    }

    post {
        always {
            junit 'results/cypress-report.xml'
        }
    }  
}
