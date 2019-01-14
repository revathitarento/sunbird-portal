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

		 withCredentials([string(credentialsId: 'hari-docker-pass', variable: 'dock-pass')]) {
   	sh('sudo ./dockerPushToRepo.sh')

}
            }
} 
}
 
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
