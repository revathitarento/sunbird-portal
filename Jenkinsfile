#!groovy

node('master') {

    currentBuild.result = "SUCCESS"

    try {

       stage('Checkout'){

          checkout scm
       }

       stage('Pre-Build'){

         sh('sudo ./installDeps.sh')

       }

       stage('Build'){

       } 
        stage('Docker-push') {

        withCredentials([string(credentialsId: 'Dock_pass', variable: 'dock-pass')]) {

        sh '''
               docker login -u haridasksd -p$dock-pass
               docker push "forwater/player:1.10.0-bronze"
           '''
        }
} 
}
 
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
