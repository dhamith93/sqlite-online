pipeline {
    environment {
        registry = 'dhamith93/sqlite-online'
        registryCredential = 'dockerhub_id'
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
      
        stage('building docker image') {
            steps { 
                script { 
                    dockerImage = docker.build registry + ":$BUILD_NUMBER" 
                }
            }
        }
        
        stage('deploying image to docker hub') { 
            steps { 
                script { 
                    docker.withRegistry('', registryCredential) { 
                        dockerImage.push() 
                    }
                } 
            }
        } 

        stage('cleaning up') { 
            steps { 
                sh "docker rmi $registry:$BUILD_NUMBER" 
            }
        }
    }

    post {
        always {
            junit 'results/cypress-report.xml'
        }
    }  
}
